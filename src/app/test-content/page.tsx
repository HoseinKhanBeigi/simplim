'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import ContentGenerationPlugin from '../components/lexical/plugins/ContentGenerationPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { GENERATE_CONTENT_COMMAND } from '../components/lexical/plugins/ContentGenerationPlugin';
import { useState } from 'react';
import { LexicalCommand } from 'lexical';
import testData from './test-data.json';

import '../components/lexical/plugins/ContentGenerationPlugin/index.css';

const theme = {
  // Theme styling goes here
  ltr: 'ltr',
  rtl: 'rtl',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
    h6: 'editor-heading-h6',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image',
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
  },
};

const initialConfig = {
  namespace: 'MyEditor',
  theme,
  onError: (error: Error) => {
    console.error(error);
  },
  nodes: [
    HeadingNode,
    QuoteNode,
    ListItemNode,
    ListNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

// URL matcher for AutoLinkPlugin
const URL_MATCHER = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text);
    return (
      match && {
        index: match.index,
        length: match[0].length,
        text: match[0],
        url: match[0],
      }
    );
  },
];

function GenerateButton() {
  const [editor] = useLexicalComposerContext();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API delay
    setTimeout(() => {
      editor.dispatchCommand(GENERATE_CONTENT_COMMAND as LexicalCommand<unknown>, {
        prompt: "Generate a comprehensive guide about React Hooks",
        testData: testData.content, // Pass the test data
        onComplete: () => setIsGenerating(false)
      });
    }, 1000); // 1 second delay to show loading state
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
    >
      {isGenerating ? 'Generating...' : 'Generate Content'}
    </button>
  );
}

export default function TestPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Content Generation Test Page</h1>
      <div className="border rounded-lg p-4">
        <LexicalComposer initialConfig={initialConfig}>
          <div className="editor-container">
            <div className="mb-4">
              <GenerateButton />
            </div>
            <div className="editor-shell">
              <RichTextPlugin
                contentEditable={<ContentEditable className="editor-input" />}
                placeholder={<div className="editor-placeholder">Enter some text...</div>}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <ListPlugin />
              <LinkPlugin />
              <AutoLinkPlugin matchers={MATCHERS} />
              <TablePlugin />
              <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
              <ContentGenerationPlugin />
            </div>
          </div>
        </LexicalComposer>
      </div>

      <style jsx global>{`
        .editor-container {
          margin: 20px auto 20px auto;
          border-radius: 2px;
          max-width: 100%;
          color: #000;
          position: relative;
          line-height: 1.7;
          font-weight: 400;
          text-align: left;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }

        .editor-shell {
          background: #fff;
          position: relative;
          border-radius: 0 0 2px 2px;
        }

        .editor-input {
          min-height: 150px;
          resize: none;
          font-size: 15px;
          position: relative;
          tab-size: 1;
          outline: 0;
          padding: 15px 10px;
          caret-color: #444;
        }

        .editor-placeholder {
          color: #999;
          overflow: hidden;
          position: absolute;
          text-overflow: ellipsis;
          top: 15px;
          left: 10px;
          font-size: 15px;
          user-select: none;
          display: inline-block;
          pointer-events: none;
        }

        .editor-heading-h1 {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .editor-heading-h2 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .editor-heading-h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 14px;
        }

        .editor-paragraph {
          margin-bottom: 12px;
        }

        .editor-quote {
          margin: 0;
          margin-left: 20px;
          margin-bottom: 10px;
          font-size: 15px;
          color: rgb(101, 103, 107);
          border-left-color: rgb(206, 208, 212);
          border-left-width: 4px;
          border-left-style: solid;
          padding-left: 16px;
        }

        .editor-list-ol {
          padding: 0;
          margin: 0;
          margin-left: 16px;
          list-style-type: decimal;
        }

        .editor-list-ul {
          padding: 0;
          margin: 0;
          margin-left: 16px;
          list-style-type: disc;
        }

        .editor-listitem {
          margin: 8px 32px;
        }

        .editor-code {
          background-color: rgb(240, 242, 245);
          font-family: Menlo, Consolas, Monaco, monospace;
          display: block;
          padding: 8px 8px;
          line-height: 1.53;
          font-size: 13px;
          margin: 8px 0;
          tab-size: 2;
          /* white-space: pre; */
          overflow-x: auto;
          position: relative;
          border-radius: 4px;
        }

        .editor-table {
          border-collapse: collapse;
          border: 1px solid #ccc;
          margin: 0;
          table-layout: fixed;
          width: 100%;
          overflow: hidden;
        }

        .editor-tableCell {
          border: 1px solid #ccc;
          box-sizing: border-box;
          min-width: 1em;
          padding: 3px 5px;
          position: relative;
          vertical-align: top;
        }

        .editor-tableCellHeader {
          background-color: #f8f9fa;
          font-weight: bold;
          text-align: left;
        }

        
      `}</style>
    </div>
  );
} 