import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useEffect} from 'react';
import {LexicalCommand, createCommand} from 'lexical';

export const EXPORT_PDF_COMMAND: LexicalCommand<void> = createCommand();

export default function PDFExportPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      EXPORT_PDF_COMMAND,
      () => {
        // Get the editor content as HTML
        const editorState = editor.getEditorState();
        let htmlContent = '';
        
        editorState.read(() => {
          const htmlElement = document.createElement('div');
          const editorElement = document.querySelector('.editor-shell');
          if (editorElement) {
            htmlElement.innerHTML = editorElement?.children[1]?.children[0]?.children[0].innerHTML;
            htmlContent = htmlElement.outerHTML;
          }
        });

        // console.log('htmlContent', htmlContent);

        // Call our API endpoint to generate PDF
        fetch('/api/generate-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ html: htmlContent }),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to generate PDF');
          }
          return response.blob();
        })
        .then(blob => {
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);
          
          // Create a temporary link and click it to download the PDF
          const link = document.createElement('a');
          link.href = url;
          link.download = 'document.pdf';
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Error generating PDF:', error);
        });

        return true;
      },
      1,
    );
  }, [editor]);

  return null;
} 