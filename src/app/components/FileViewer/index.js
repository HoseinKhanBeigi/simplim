"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Configure worker
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

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

  // Memoize options to prevent unnecessary reloads
  const options = useMemo(
    () => ({
      cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
      cMapPacked: true,
      standardFontDataUrl:
        "https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/",
      useSystemFonts: true,
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

  switch (file.type) {
    case "pdf":
      return (
        <div className="flex flex-col flex-1">
          <div 
            ref={containerRef}
            className="relative pdf-viewer select-none"
            style={{ cursor: "text" ,display: "flex",justifyContent: "center",alignItems: "center"}}
          >
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
                scale={scale}
                className="pdf-page"
                onLoadSuccess={handlePageLoadSuccess}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </div>
        </div>
      );

    case "excel":
      return (
        <div className="flex justify-center items-center p-8 text-green-600">
          <span>Excel Viewer Coming Soon</span>
        </div>
      );

    case "image":
      return (
        <div className="flex justify-center items-center">
          <img src={file.url} alt={file.name} className="max-w-full h-auto" />
        </div>
      );

    default:
      return (
        <div className="flex justify-center items-center p-8 text-gray-500">
          Unsupported file type
        </div>
      );
  }
}

export default FileViewer;
