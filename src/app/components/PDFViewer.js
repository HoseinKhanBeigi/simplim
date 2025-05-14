"use client";
import React, { useEffect, useRef, useState } from "react";

const PDFViewer = () => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const [pdfjs, setPdfjs] = useState(null);

  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        // Import PDF.js
        const pdfjsLib = await import('pdfjs-dist/build/pdf.js');
        
        // Set worker source
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        
        setPdfjs(pdfjsLib);
      } catch (error) {
        console.error('Error loading PDF.js:', error);
        setError('Failed to initialize PDF viewer. Please refresh the page.');
      }
    };

    loadPdfJs();
  }, []);

  const loadPDF = async (url) => {
    if (!pdfjs) {
      setError('PDF viewer is not initialized. Please refresh the page.');
      return;
    }

    try {
      setError(null);
      const loadingTask = pdfjs.getDocument(url);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
    } catch (error) {
      console.error('Error loading PDF:', error);
      setError('Failed to load PDF. Please try another file.');
    }
  };

  const renderPage = async (pageNum) => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering page:', error);
      setError('Failed to render PDF page. Please try again.');
    }
  };

  useEffect(() => {
    if (pdfDoc && canvasRef.current) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      loadPDF(fileUrl);
    }
  };

  const nextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="mb-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}
      
      {pdfDoc && (
        <div className="flex flex-col items-center">
          <canvas ref={canvasRef} className="border border-gray-300 shadow-lg" />
          <div className="mt-4 flex gap-4">
            <button
              onClick={prevPage}
              disabled={currentPage <= 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="py-2">
              Page {currentPage} of {numPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage >= numPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFViewer; 