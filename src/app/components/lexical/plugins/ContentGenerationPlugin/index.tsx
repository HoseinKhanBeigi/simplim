import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { $createListItemNode, $createListNode } from '@lexical/list';
import { $createQuoteNode } from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/code';
import { $createTableNode, $createTableRowNode, $createTableCellNode } from '@lexical/table';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import Button from '../../ui/Button';
import { createCommand, LexicalCommand } from 'lexical';

export const GENERATE_CONTENT_COMMAND: LexicalCommand<{
  prompt: string;
  testData?: any[];
  onComplete?: () => void;
}> = createCommand('GENERATE_CONTENT_COMMAND');

const getHeadingTag = (level: number): HeadingTagType => {
  switch (level) {
    case 1: return 'h1';
    case 2: return 'h2';
    case 3: return 'h3';
    case 4: return 'h4';
    case 5: return 'h5';
    case 6: return 'h6';
    default: return 'h1';
  }
};

export default function ContentGenerationPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    return editor.registerCommand(
      GENERATE_CONTENT_COMMAND,
      ({ prompt, testData, onComplete }) => {
        setIsGenerating(true);
        
        // If test data is provided, use it directly
        if (testData) {
          editor.update(() => {
            const root = $getRoot();
            root.clear();
            
            testData.forEach((item: any) => {
              switch (item.type) {
                case 'heading':
                  const level = Math.min(Math.max(parseInt(item.level) || 1, 1), 6);
                  const headingNode = $createHeadingNode(getHeadingTag(level));
                  headingNode.append($createTextNode(item.content));
                  root.append(headingNode);
                  break;

                case 'paragraph':
                  const paragraphNode = $createParagraphNode();
                  paragraphNode.append($createTextNode(item.content));
                  root.append(paragraphNode);
                  break;

                case 'list':
                  const listNode = $createListNode(item.style === 'ordered' ? 'number' : 'bullet');
                  item.items.forEach((listItem: string) => {
                    const listItemNode = $createListItemNode();
                    listItemNode.append($createTextNode(listItem));
                    listNode.append(listItemNode);
                  });
                  root.append(listNode);
                  break;

                case 'quote':
                  const quoteNode = $createQuoteNode();
                  quoteNode.append($createTextNode(item.content));
                  root.append(quoteNode);
                  break;

                case 'code':
                  const codeNode = $createCodeNode(item.language);
                  codeNode.append($createTextNode(item.content));
                  root.append(codeNode);
                  break;

                case 'table':
                  const tableNode = $createTableNode();
                  // Add header row
                  const headerRow = $createTableRowNode();
                  item.columns.forEach((column: string) => {
                    const cell = $createTableCellNode(1);
                    cell.append($createTextNode(column));
                    headerRow.append(cell);
                  });
                  tableNode.append(headerRow);
                  // Add data rows
                  item.rows.forEach((row: string[]) => {
                    const dataRow = $createTableRowNode();
                    row.forEach((cell: string) => {
                      const cellNode = $createTableCellNode(0);
                      cellNode.append($createTextNode(cell));
                      dataRow.append(cellNode);
                    });
                    tableNode.append(dataRow);
                  });
                  root.append(tableNode);
                  break;
              }
            });
          });
          
          setIsGenerating(false);
          onComplete?.();
          return true;
        }

        // Otherwise, make API call
        fetch('/api/generate-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        })
        .then(response => response.json())
        .then(data => {
          editor.update(() => {
            const root = $getRoot();
            root.clear();
            
            data.content.forEach((item: any) => {
              switch (item.type) {
                case 'heading':
                  const level = Math.min(Math.max(parseInt(item.level) || 1, 1), 6);
                  const headingNode = $createHeadingNode(getHeadingTag(level));
                  headingNode.append($createTextNode(item.content));
                  root.append(headingNode);
                  break;

                case 'paragraph':
                  const paragraphNode = $createParagraphNode();
                  paragraphNode.append($createTextNode(item.content));
                  root.append(paragraphNode);
                  break;

                case 'list':
                  const listNode = $createListNode(item.style === 'ordered' ? 'number' : 'bullet');
                  item.items.forEach((listItem: string) => {
                    const listItemNode = $createListItemNode();
                    listItemNode.append($createTextNode(listItem));
                    listNode.append(listItemNode);
                  });
                  root.append(listNode);
                  break;

                case 'quote':
                  const quoteNode = $createQuoteNode();
                  quoteNode.append($createTextNode(item.content));
                  root.append(quoteNode);
                  break;

                case 'code':
                  const codeNode = $createCodeNode(item.language);
                  codeNode.append($createTextNode(item.content));
                  root.append(codeNode);
                  break;

                case 'table':
                  const tableNode = $createTableNode();
                  // Add header row
                  const headerRow = $createTableRowNode();
                  item.columns.forEach((column: string) => {
                    const cell = $createTableCellNode(1);
                    cell.append($createTextNode(column));
                    headerRow.append(cell);
                  });
                  tableNode.append(headerRow);
                  // Add data rows
                  item.rows.forEach((row: string[]) => {
                    const dataRow = $createTableRowNode();
                    row.forEach((cell: string) => {
                      const cellNode = $createTableCellNode(0);
                      cellNode.append($createTextNode(cell));
                      dataRow.append(cellNode);
                    });
                    tableNode.append(dataRow);
                  });
                  root.append(tableNode);
                  break;
              }
            });
          });
        })
        .catch(error => {
          console.error('Error generating content:', error);
        })
        .finally(() => {
          setIsGenerating(false);
          onComplete?.();
        });

        return true;
      },
      1
    );
  }, [editor]);

  return null;
} 