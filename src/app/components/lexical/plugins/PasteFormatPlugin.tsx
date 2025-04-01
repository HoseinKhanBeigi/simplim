import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  ElementNode,
  COMMAND_PRIORITY_NORMAL,
  PASTE_COMMAND,
} from 'lexical';
import {useEffect} from 'react';

// Approximate characters per line based on editor width
const CHARS_PER_LINE = 783;

export default function PasteFormatPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData) {
          return false;
        }

        const text = clipboardData.getData('text/plain');
        if (!text) {
          return false;
        }

        editor.update(() => {
          const selection = $getSelection();
          let targetNode: ElementNode = $getRoot();

          // console.log('selection', selection);
          
          if ($isRangeSelection(selection)) {
            const anchor = selection.anchor;
            const node = anchor.getNode();
            
            if ($isElementNode(node)) {
              const parent = node.getParent();
              if (parent && parent.getType() === 'layout-item') {
                targetNode = parent as ElementNode;
              } else {
                targetNode = node;
              }
            }
            
            selection.removeText();
          }

          // Split text into paragraphs based on line width
          const words = text.trim().split(' ');
          let currentParagraph = '';
          let currentLineLength = 0;
          
          words.forEach((word, index) => {
            const wordLength = word.length + (currentParagraph ? 1 : 0); // +1 for space
            
            if (currentLineLength + wordLength > CHARS_PER_LINE) {
              // Create new paragraph when line is full
              const paragraphNode = $createParagraphNode();
              const textNode = $createTextNode(currentParagraph.trim());
              paragraphNode.append(textNode);
              targetNode.append(paragraphNode);
              
              // Start new paragraph
              currentParagraph = word;
              currentLineLength = word.length;
            } else {
              // Add word to current paragraph
              currentParagraph += (currentParagraph ? ' ' : '') + word;
              currentLineLength += wordLength;
            }
            
            // Create final paragraph
            if (index === words.length - 1) {
              const paragraphNode = $createParagraphNode();
              const textNode = $createTextNode(currentParagraph.trim());
              paragraphNode.append(textNode);
              targetNode.append(paragraphNode);
            }
          });
        });

        return true;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  }, [editor]);

  return null;
} 