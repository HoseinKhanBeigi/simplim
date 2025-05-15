"use client";
import React, { useState, useCallback } from 'react';
import FileViewer from './PDFViewer';
import UploadArea from './Upload';

const PDFUploader = () => {
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  }, []);

  const handleFileUpload = useCallback((type) => async (event) => {
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
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Error processing file. Please try again.');
      console.error('File processing error:', err);
      setIsLoading(false);
      return false;
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

  const uploadingFile = isLoading ? 'pdf' : null;
  const isPremium = true;

  return (
    <div className="flex flex-col items-center ">
    
        <UploadArea
          handleFileUpload={handleFileUpload}
          uploadingFile={uploadingFile}
          isPremium={isPremium}
        />
    
      {file && (
        <div className="w-full mt-4">
          <div className="flex items-center justify-between mb-4 px-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                title="Zoom Out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                title="Zoom In"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage <= 1}
                className={`p-2 rounded-md transition-colors ${
                  currentPage <= 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Previous Page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {numPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage >= numPages}
                className={`p-2 rounded-md transition-colors ${
                  currentPage >= numPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Next Page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div className="relative w-full overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', minHeight: '100%' }}>
              <FileViewer
                file={file}
                currentPage={currentPage}
                onLoadSuccess={handleLoadSuccess}
                onLoadError={handleLoadError}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUploader; 