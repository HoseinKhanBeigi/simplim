"use client";
import React, { useState, useCallback } from 'react';
import FileViewer from './PDFViewer';

const PDFUploader = () => {
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = useCallback((event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Check file type
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    // Check file size (limit to 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fileUrl = URL.createObjectURL(selectedFile);
      setFile({
        type: 'pdf',
        url: fileUrl,
        name: selectedFile.name
      });
      setCurrentPage(1);
    } catch (err) {
      setError('Error processing file. Please try again.');
      console.error('File processing error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoadSuccess = useCallback(({ numPages }) => {
    console.log('PDF loaded with pages:', numPages);
    setNumPages(numPages);
    setIsLoading(false);
  }, []);

  const handleLoadError = useCallback((error) => {
    console.error('PDF loading error:', error);
    setError('Failed to load PDF. Please try another file.');
    setIsLoading(false);
  }, []);

  const nextPage = useCallback(() => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, numPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 w-full max-w-md">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isLoading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3">Loading...</span>
        </div>
      )}

      {file && !isLoading && (
        <div className="w-full">
          <FileViewer
            file={file}
            currentPage={currentPage}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
          />
          
          {numPages > 0 && (
            <div className="mt-4 flex justify-center items-center gap-4">
              <button
                onClick={prevPage}
                disabled={currentPage <= 1 || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="py-2">
                Page {currentPage} of {numPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage >= numPages || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFUploader; 