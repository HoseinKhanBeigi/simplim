import React, { useEffect, useMemo } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FileViewer = ({ file, currentPage, scale = 1.2, onLoadSuccess, onLoadComplete }) => {
  // Memoize options to prevent unnecessary reloads
  const options = useMemo(() => ({
    cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
    useSystemFonts: true
  }), []);

  if (!file) return null;

  switch (file.type) {
    case 'pdf':
      return (
        <Document
          file={file.url}
          onLoadSuccess={onLoadSuccess}
          loading={
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3">Loading PDF...</span>
            </div>
          }
          error={
            <div className="flex justify-center items-center p-8 text-red-500">
              Error loading PDF!
            </div>
          }
          onLoadComplete={onLoadComplete}
          options={options}
        >
          <Page 
            pageNumber={currentPage}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            scale={scale}
            className="pdf-page"
          />
        </Document>
      );

    case 'excel':
      return (
        <div className="flex justify-center items-center p-8 text-green-600">
          <span>Excel Viewer Coming Soon</span>
        </div>
      );

    case 'image':
      return (
        <div className="flex justify-center items-center">
          <img 
            src={file.url} 
            alt={file.name}
            className="max-w-full h-auto"
          />
        </div>
      );

    default:
      return (
        <div className="flex justify-center items-center p-8 text-gray-500">
          Unsupported file type
        </div>
      );
  }
};

export default FileViewer; 