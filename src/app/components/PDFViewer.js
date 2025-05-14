"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import dynamic from 'next/dynamic';

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
  const [pdfjs, setPdfjs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load PDF.js only on client side
    if (typeof window !== 'undefined' && !isInitialized) {
      setIsLoading(true);
      import('pdfjs-dist/build/pdf').then((pdfjsLib) => {
        console.log('PDF.js loaded successfully');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
        setPdfjs(pdfjsLib);
        setIsLoading(false);
        setIsInitialized(true);
      }).catch(err => {
        console.error('Error loading PDF.js:', err);
        setError('Failed to load PDF viewer');
        setIsLoading(false);
      });
    }
  }, [isInitialized]);

  // Memoize options to prevent unnecessary reloads
  const options = useMemo(
    () => ({
      cMapUrl: "//unpkg.com/pdfjs-dist@3.11.174/cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "//unpkg.com/pdfjs-dist@3.11.174/standard_fonts/",
      useSystemFonts: true,
      disableFontFace: false,
      isEvalSupported: true,
      useWorkerFetch: true,
      maxCanvasPixels: 16777216,
      disableStream: false,
      disableAutoFetch: false,
    }),
    []
  );

  const handlePageLoadSuccess = useCallback(async (page) => {
    if (!containerRef.current || typeof window === "undefined") return;
    try {
      console.log('Page loaded successfully:', page);
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
      setError('Error processing PDF content');
    }
  }, [scale, onTextContentChange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading PDF viewer...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center p-8 text-red-500">
        <p>{error}</p>
        <p className="text-sm mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  if (!file || !pdfjs) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500">
        <p>Please select a PDF file to view</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div
        ref={containerRef}
        className="relative pdf-viewer select-none"
        style={{ cursor: "text", display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <PDFDocument
          file={file.url}
          onLoadSuccess={(pdf) => {
            console.log('PDF loaded successfully:', pdf);
            onLoadSuccess?.(pdf);
          }}
          loading={
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3">Loading PDF...</span>
            </div>
          }
          error={(error) => {
            console.error('PDF loading error:', error);
            return (
              <div className="flex flex-col justify-center items-center p-8 text-red-500">
                <p>Error loading PDF!</p>
                <p className="text-sm mt-2">Please try another file or refresh the page.</p>
              </div>
            );
          }}
          onLoadComplete={onLoadComplete}
          options={options}
          onError={(error) => {
            console.error("PDF loading error:", error);
            setError('Failed to load PDF');
          }}
        >
          <PDFPage
            key={`page-${currentPage}`}
            pageNumber={currentPage}
            scale={scale}
            className="pdf-page"
            onLoadSuccess={handlePageLoadSuccess}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            }
            error={(error) => {
              console.error('Page loading error:', error);
              return (
                <div className="flex justify-center items-center p-4 text-red-500">
                  Error loading page
                </div>
              );
            }}
          />
        </PDFDocument>
      </div>
    </div>
  );
}

export default FileViewer; 