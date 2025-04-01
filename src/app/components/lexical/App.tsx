/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";

import { $createLinkNode } from "@lexical/link";
import { $createListItemNode, $createListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isTextNode,
  DOMConversionMap,
  TextNode,
} from "lexical";

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
import { EXPORT_PDF_COMMAND } from './plugins/PDFExportPlugin';
import { PDFProvider } from './context/PDFContext';

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
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 py-8">
      <div className="editor-shell">
        <Editor />
        <ExportPDFButton />
      </div>
    </div>
  );
}

function App(): JSX.Element {
  const {
    settings: { isCollab, emptyEditor, measureTypingPerf },
  } = useSettings();

  const initialConfig = {
    editorState: isCollab ? null : emptyEditor ? undefined : undefined,
    html: { import: buildImportMap() },
    namespace: "Playground",
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PDFProvider>
        <SharedHistoryContext>
          <TableContext>
            <ToolbarContext>
              <EditorContainer />
            </ToolbarContext>
          </TableContext>
        </SharedHistoryContext>
      </PDFProvider>
    </LexicalComposer>
  );
}

export default function PlaygroundApp(): JSX.Element {
  return (
    <FlashMessageContext>
      <App />
    </FlashMessageContext>
  );
}