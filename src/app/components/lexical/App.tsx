/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";
import { useEffect } from "react";

import { $createLinkNode } from "@lexical/link";
import { $createListItemNode, $createListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from "@lexical/rich-text";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isTextNode,
  DOMConversionMap,
  TextNode,
  LexicalEditor,
} from "lexical";
import { $createCodeNode } from "@lexical/code";
import { $createTableNode, $createTableRowNode, $createTableCellNode } from "@lexical/table";

import "./index.css";
import "./editor.css";

import { isDevPlayground } from "./appSettings";
import { FlashMessageContext } from "./context/FlashMessageContext";
import { SettingsContext, useSettings } from "./context/SettingsContext";
import { SharedHistoryContext } from "./context/SharedHistoryContext";
import { ToolbarContext } from "./context/ToolbarContext";
import Editor from "./Editor";
import logo from "./images/logo.svg";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import DocsPlugin from "./plugins/DocsPlugin";
import PasteLogPlugin from "./plugins/PasteLogPlugin";
import { TableContext } from "./plugins/TablePlugin";
import TestRecorderPlugin from "./plugins/TestRecorderPlugin";
import { parseAllowedFontSize } from "./plugins/ToolbarPlugin/fontSize";
import TypingPerfPlugin from "./plugins/TypingPerfPlugin";
import Settings from "./Settings";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import { parseAllowedColor } from "./ui/ColorPicker";
import { EXPORT_PDF_COMMAND } from "./plugins/PDFExportPlugin";
import { PDFProvider } from "./context/PDFContext";
import { ErrorBoundary } from "react-error-boundary";

console.warn(
  "If you are profiling the playground app, please ensure you turn off the debug view. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting."
);

function buildImportMap(): DOMConversionMap {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          // const extraStyles = getExtraStyles(element);
          // if (extraStyles) {
          //   const {forChild} = output;
          //   return {
          //     ...output,
          //     forChild: (child, parent) => {
          //       const textNode = forChild(child, parent);
          //       if ($isTextNode(textNode)) {
          //         textNode.setStyle(textNode.getStyle() + extraStyles);
          //       }
          //       return textNode;
          //     },
          //   };
          // }
          return output;
        },
      };
    };
  }

  return importMap;
}

function ExportPDFButton() {
  const [editor] = useLexicalComposerContext();

  const handleClick = () => {
    editor.dispatchCommand(EXPORT_PDF_COMMAND, undefined);
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 fixed bottom-4 right-4"
    >
      📄 Export PDF
    </button>
  );
}

function EditorContainer(): JSX.Element {
  return (
 
      <div className="flex flex-row justify-center w-[100%] min-w-[796px]">
        <div className="editor-shell">
          <Editor />
          {/* <ExportPDFButton /> */}
        </div>
      </div>
  
  );
}

function InitializeEditor({ initialContent }: { initialContent?: any[] }): JSX.Element {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialContent && editor) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        
        initialContent.forEach((item: any) => {
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
    }
  }, [initialContent, editor]);

  return null;
}

function App({ initialContent }: { initialContent?: any[] }): JSX.Element {
  const {
    settings: { isCollab, emptyEditor, measureTypingPerf },
  } = useSettings();

  const initialConfig = {
    editorState: isCollab ? null : emptyEditor ? undefined : undefined,
    html: { import: buildImportMap() },
    namespace: "Playground",
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      console.error('Lexical editor error:', error);
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PDFProvider>
        <SharedHistoryContext>
          <TableContext>
            <ToolbarContext>
              <InitializeEditor initialContent={initialContent} />
              <EditorContainer />
            </ToolbarContext>
          </TableContext>
        </SharedHistoryContext>
      </PDFProvider>
    </LexicalComposer>
  );
}

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

export default function PlaygroundApp({ initialContent }: { initialContent?: any[] }): JSX.Element {
  return (
    <ErrorBoundary fallback={<div>Something went wrong with the editor. Please try refreshing the page.</div>}>
      <FlashMessageContext>
        <App initialContent={initialContent} />
      </FlashMessageContext>
    </ErrorBoundary>
  );
}
