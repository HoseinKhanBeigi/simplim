"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from 'next/dynamic';
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Dynamically import PDF.js components with no SSR
const PDFDocument = dynamic(() => import('react-pdf').then(mod => mod.Document), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-3">Loading PDF viewer...</span>
    </div>
  ),
});

const PDFPage = dynamic(() => import('react-pdf').then(mod => mod.Page), {
  ssr: false,
});

function FileViewer({
  file,
  currentPage,
  scale = 1.2,
  onLoadSuccess,
  onLoadComplete,
  onTextContentChange,
  onTextSelect,
}) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load PDF.js worker only on client side
    if (typeof window !== 'undefined') {
      import('pdfjs-dist/build/pdf').then((pdfjsLib) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        setIsLoading(false);
      });
    }
  }, []);

  // Memoize options to prevent unnecessary reloads
  const options = useMemo(
    () => ({
      cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/standard_fonts/",
      useSystemFonts: true,
      disableFontFace: false,
    }),
    []
  );

  const handlePageLoadSuccess = async (page) => {
    if (!containerRef.current || typeof window === "undefined") return;
    try {
      const viewport = page.getViewport({ scale });
      const textContent = await page.getTextContent();
      // Process text content with positioning
      let textItems = [];
      textContent.items.forEach((textItem) => {
        textItems.push({
          text: textItem.str,
          x: textItem.transform[4] * scale,
          y: viewport.height - textItem.transform[5] * scale,
          fontSize: textItem.transform[0] * scale,
        });
      });
      // Sort items by Y position to maintain reading order
      textItems.sort((a, b) => a.y - b.y);
      // Group items by lines (items with similar Y positions)
      let lines = [];
      let currentLine = [];
      let lastY = null;
      textItems.forEach((item) => {
        if (lastY === null || Math.abs(item.y - lastY) < 5) {
          currentLine.push(item);
        } else {
          if (currentLine.length > 0) {
            currentLine.sort((a, b) => a.x - b.x);
            lines.push(currentLine);
          }
          currentLine = [item];
        }
        lastY = item.y;
      });
      if (currentLine.length > 0) {
        currentLine.sort((a, b) => a.x - b.x);
        lines.push(currentLine);
      }
      const formattedText = lines
        .map((line) => line.map((item) => item.text).join(" "))
        .join("\n");
      if (onTextContentChange) {
        onTextContentChange(formattedText);
      }
    } catch (error) {
      console.error("Error getting text content:", error);
    }
  };

  if (!file) return null;

  return (
    <div className="flex flex-col flex-1">
      <div
        ref={containerRef}
        className="relative pdf-viewer select-none"
        style={{ 
          cursor: "text", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "flex-start",
          width: "100%",
          padding: "1rem"
        }}
      >
        <PDFDocument
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
          <PDFPage
            key={`page-${currentPage}`}
            pageNumber={currentPage}
            scale={scale}
            className="pdf-page shadow-lg"
            onLoadSuccess={handlePageLoadSuccess}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            }
            error={
              <div className="flex justify-center items-center p-4 text-red-500">
                Error loading page
              </div>
            }
          />
        </PDFDocument>
      </div>
    </div>
  );
}

export default FileViewer;
