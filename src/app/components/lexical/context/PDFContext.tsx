import React, { createContext, useContext, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EXPORT_PDF_COMMAND } from '../plugins/PDFExportPlugin';

type PDFContextType = {
  exportPDF: () => void;
};

const PDFContext = createContext<PDFContextType | null>(null);

export function PDFProvider({ children }: { children: React.ReactNode }) {
  const [editor] = useLexicalComposerContext();

  const exportPDF = useCallback(() => {
    editor.dispatchCommand(EXPORT_PDF_COMMAND, undefined);
  }, [editor]);

  return (
    <PDFContext.Provider value={{ exportPDF }}>
      {children}
    </PDFContext.Provider>
  );
}

export function usePDF() {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
} 