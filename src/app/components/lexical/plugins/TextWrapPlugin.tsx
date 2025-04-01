import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  $isTextNode,
  ElementNode,
  TextNode,
  createCommand,
} from "lexical";
import { useEffect } from "react";

// Width of the editor in pixels
const EDITOR_WIDTH = 824;
// Average character width in pixels (assuming monospace font)
const AVERAGE_CHAR_WIDTH = 8;
// Calculate maximum characters per line
const MAX_CHARS_PER_LINE = Math.floor(EDITOR_WIDTH / AVERAGE_CHAR_WIDTH);

// Define the command
export const SET_LONG_LINE = createCommand<boolean>();

export default function TextWrapPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerNodeTransform(TextNode, (textNode: TextNode) => {
      // Get the parent node
      const parent = textNode.getParent();
      if (!$isElementNode(parent)) {
        return;
      }

      const text = textNode.getTextContent();
      if (text) {
        // Check if text has spaces
        const hasSpaces = text.includes(" ");

        if (text.length > MAX_CHARS_PER_LINE) {
          // Only style if text exceeds the calculated line width
          // textNode.__style = "word-break: break-all; background: antiquewhite;";
          // Dispatch an event to notify toolbar
          editor.dispatchCommand(SET_LONG_LINE, true);
        } else {
          // Normal text with spaces should wrap naturally
          // textNode.__style = "word-wrap: break-word;";
          // Reset toolbar state
          editor.dispatchCommand(SET_LONG_LINE, false);
        }
      }
    });
  }, [editor]);

  return null;
}
