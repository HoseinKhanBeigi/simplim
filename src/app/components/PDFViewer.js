"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  onPageChange,
}) {
  const containerRef = useRef(null);
  const pdfRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paragraphs, setParagraphs] = useState([]);

  useEffect(() => {
    // Load PDF.js worker only on client side
    if (typeof window !== 'undefined') {
      import('pdfjs-dist/build/pdf').then((pdfjsLib) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        setIsLoading(false);
      });
    }
  }, []);

  // Clear paragraphs when page changes
  useEffect(() => {
    setParagraphs([]);
  }, [currentPage]);

  // Handle link clicks using react-pdf's onItemClick
  const handleItemClick = useCallback(async (item) => {
    if (!onPageChange || !pdfRef.current) {
      console.log('onItemClick called but missing onPageChange or pdfRef');
      return;
    }

    console.log('onItemClick called with:', item);

    try {
      const { dest, pageIndex } = item || {};
      
      // Handle internal destination links
      if (dest) {
        let destination = dest;
        // If dest is a string (named destination), resolve it
        if (typeof destination === 'string') {
          destination = await pdfRef.current.getDestination(destination);
        }
        
        if (destination && Array.isArray(destination) && destination.length > 0) {
          const destRef = destination[0];
          let targetPage = null;

          if (destRef && typeof destRef === 'object' && 'num' in destRef) {
            targetPage = destRef.num + 1; // PDF.js uses 0-indexed, we use 1-indexed
          } else if (typeof destRef === 'number') {
            targetPage = destRef + 1;
          }

          if (targetPage && targetPage > 0 && targetPage <= pdfRef.current.numPages) {
            console.log('Navigating to page:', targetPage);
            onPageChange(targetPage);
            return;
          }
        }
      }
      // Handle page index directly (if provided)
      if (typeof pageIndex === 'number') {
        const targetPage = pageIndex + 1; // Convert 0-indexed to 1-indexed
        if (targetPage > 0 && targetPage <= pdfRef.current.numPages) {
          console.log('Navigating to page (from pageIndex):', targetPage);
          onPageChange(targetPage);
          return;
        }
      }
    } catch (error) {
      console.error('Error handling link click:', error);
    }
  }, [onPageChange]);

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
      const annotations = await page.getAnnotations();
      
      // Store PDF reference from page object
      if (!pdfRef.current && page._pdfInfo?.pdf) {
        pdfRef.current = page._pdfInfo.pdf;
      }

      // Also handle link clicks manually as a fallback
      if (onPageChange && pdfRef.current) {
        setTimeout(() => {
          const annotationLayer = containerRef.current?.querySelector('.react-pdf__Page__annotations');
          if (!annotationLayer) return;

          const linkElements = annotationLayer.querySelectorAll('a.annotationLink');
          linkElements.forEach((linkEl) => {
            // Remove existing handlers to avoid duplicates
            const newLink = linkEl.cloneNode(true);
            linkEl.parentNode?.replaceChild(newLink, linkEl);

            newLink.addEventListener('click', async (e) => {
              // Skip external URLs (let browser handle them)
              const href = newLink.getAttribute('href');
              if (href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:'))) {
                return;
              }

              e.preventDefault();
              e.stopPropagation();

              try {
                // Get annotations for this page
                const pageAnnotations = await page.getAnnotations();
                const linkAnnotations = pageAnnotations.filter(ann => ann.subtype === 'Link');
                
                // Find which annotation was clicked by position
                const rect = newLink.getBoundingClientRect();
                const pageRect = containerRef.current?.querySelector('.react-pdf__Page')?.getBoundingClientRect();
                if (!pageRect) return;

                const clickX = (rect.left + rect.width / 2 - pageRect.left) / scale;
                const clickY = (rect.top + rect.height / 2 - pageRect.top) / scale;
                const viewport = page.getViewport({ scale: 1.0 });

                for (const annotation of linkAnnotations) {
                  if (!annotation.rect) continue;
                  const [x1, y1, x2, y2] = annotation.rect;
                  const pdfY = viewport.height - clickY;

                  if (clickX >= x1 && clickX <= x2 && pdfY >= y1 && pdfY <= y2) {
                    // Handle internal destination
                    if (annotation.dest) {
                      let dest = annotation.dest;
                      if (typeof dest === 'string') {
                        dest = await pdfRef.current.getDestination(dest);
                      }
                      
                      if (dest && Array.isArray(dest) && dest.length > 0) {
                        const destRef = dest[0];
                        let targetPage = null;

                        if (destRef && typeof destRef === 'object' && 'num' in destRef) {
                          targetPage = destRef.num + 1;
                        } else if (typeof destRef === 'number') {
                          targetPage = destRef + 1;
                        }

                        if (targetPage && targetPage > 0 && targetPage <= pdfRef.current.numPages) {
                          console.log('Manual handler: Navigating to page', targetPage);
                          onPageChange(targetPage);
                          return;
                        }
                      }
                    }
                    // Handle GoTo action
                    else if (annotation.action === 'GoTo' && annotation.dest) {
                      let dest = annotation.dest;
                      if (typeof dest === 'string') {
                        dest = await pdfRef.current.getDestination(dest);
                      }
                      if (dest && Array.isArray(dest) && dest.length > 0) {
                        const destRef = dest[0];
                        let targetPage = null;

                        if (destRef && typeof destRef === 'object' && 'num' in destRef) {
                          targetPage = destRef.num + 1;
                        } else if (typeof destRef === 'number') {
                          targetPage = destRef + 1;
                        }

                        if (targetPage && targetPage > 0 && targetPage <= pdfRef.current.numPages) {
                          console.log('Manual handler: Navigating to page', targetPage);
                          onPageChange(targetPage);
                          return;
                        }
                      }
                    }
                  }
                }
              } catch (error) {
                console.error('Error in manual link handler:', error);
              }
            }, true);
          });
        }, 500);
      }
      
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

      // Group lines into paragraphs (detect larger gaps between lines)
      const paragraphs = [];
      let currentParagraph = [];
      let lastLineY = null;
      let lastLineHeight = null;
      const paragraphGapThreshold = 20; // Minimum gap to start a new paragraph (increased)
      const minParagraphLines = 2; // Minimum lines to consider it a paragraph

      lines.forEach((line, index) => {
        const lineY = line[0]?.y || 0;
        const lineHeight = line[0]?.fontSize || 12;
        const lineText = line.map((item) => item.text).join(" ").trim();
        
        if (!lineText) {
          // Empty line might indicate paragraph break
          if (currentParagraph.length > 0) {
            paragraphs.push([...currentParagraph]);
            currentParagraph = [];
          }
          lastLineY = null;
          return;
        }

        if (lastLineY === null) {
          // First line
          currentParagraph = [line];
        } else {
          const gap = lineY - lastLineY;
          const avgLineHeight = lastLineHeight || lineHeight;
          
          // Check if gap is large enough to be a paragraph break
          // Gap should be at least 1.5x the line height
          if (gap > (avgLineHeight * 1.5) || gap > paragraphGapThreshold) {
            // Start a new paragraph
            if (currentParagraph.length >= minParagraphLines) {
              paragraphs.push([...currentParagraph]);
            }
            currentParagraph = [line];
          } else {
            // Continue current paragraph
            currentParagraph.push(line);
          }
        }
        
        lastLineY = lineY;
        lastLineHeight = lineHeight;
      });
      
      // Add the last paragraph if it has enough lines
      if (currentParagraph.length >= minParagraphLines) {
        paragraphs.push(currentParagraph);
      }

      // Extract paragraph info with positions
      const paragraphData = paragraphs.map((paraLines, index) => {
        const firstLine = paraLines[0];
        const topY = firstLine[0]?.y || 0;
        // Calculate both left and right positions
        const firstLineItems = firstLine || [];
        const leftX = Math.min(...firstLineItems.map(item => item.x));
        const rightX = Math.max(...firstLineItems.map(item => {
          const itemWidth = (item.text?.length || 0) * (item.fontSize || 10);
          return item.x + itemWidth;
        }));
        
        return {
          id: `para-${currentPage}-${index}`,
          topY: topY,
          leftX: leftX,
          rightX: rightX,
          page: currentPage,
        };
      });

      setParagraphs(paragraphData);

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
          onLoadSuccess={(pdf) => {
            pdfRef.current = pdf;
            if (onLoadSuccess) onLoadSuccess(pdf);
          }}
          onItemClick={handleItemClick}
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
        
        {/* Paragraph buttons overlay */}
        {paragraphs.length > 0 && (
          <div className="absolute inset-0 pointer-events-none" style={{ padding: '1rem' }}>
            {paragraphs.map((para) => {
              // Position buttons at the top-right of each paragraph
              const buttonY = para.topY - 30; // Position above paragraph
              // Position button aligned with the right edge of the paragraph text
              const buttonX = para.rightX; // Right side of paragraph
              
              return (
                <button
                  key={para.id}
                  className="pointer-events-auto absolute bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded shadow-md transition-colors z-10 font-medium"
                  style={{
                    left: `${buttonX}px`,
                    top: `${buttonY}px`,
                    transform: 'translateX(-100%)', // Align button to the right
                  }}
                  onClick={() => {
                    console.log('Simplify me clicked for paragraph:', para.id);
                    // Add your simplify action here
                  }}
                >
                  simplify me
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FileViewer;
