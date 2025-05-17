"use client";
import React, { useCallback } from 'react';
import FileViewer from './PDFViewer';
import UploadArea from './Upload';
import PDFDrawer from './PDFDrawer';
import useStore from '../store/useStore';

const PDFUploader = () => {
  const {
    files,
    currentFile,
    currentPage,
    numPages,
    zoom,
    isDrawerOpen,
    error,
    isLoading,
    setCurrentPage,
    setNumPages,
    setZoom,
    setDrawerOpen,
    uploadFile,
    setCurrentFile
  } = useStore();

  const handleZoomIn = useCallback(() => {
    setZoom(Math.min(zoom + 0.25, 3));
  }, [zoom, setZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom(Math.max(zoom - 0.25, 0.5));
  }, [zoom, setZoom]);

  const handleFileUpload = useCallback((type) => async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Check file type
    if (selectedFile.type !== 'application/pdf') {
      useStore.getState().setError('Please select a valid PDF file');
      return;
    }

    // Check file size (limit to 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      useStore.getState().setError('File size must be less than 10MB');
      return;
    }

    try {
      await uploadFile(selectedFile);
      return true;
    } catch (err) {
      console.error('File upload error:', err);
      return false;
    }
  }, [uploadFile]);

  const handleFileSelect = useCallback((selectedFile) => {
    setCurrentFile(selectedFile);
    setDrawerOpen(false);
  }, [setCurrentFile, setDrawerOpen]);

  const handleLoadSuccess = useCallback(({ numPages }) => {
    console.log('PDF loaded with pages:', numPages);
    setNumPages(numPages);
  }, [setNumPages]);

  const handleLoadError = useCallback((error) => {
    console.error('PDF loading error:', error);
    useStore.getState().setError('Failed to load PDF. Please try another file.');
  }, []);

  const nextPage = useCallback(() => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, numPages, setCurrentPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, setCurrentPage]);

  const uploadingFile = isLoading ? 'pdf' : null;
  const isPremium = true;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <UploadArea
          handleFileUpload={handleFileUpload}
          uploadingFile={uploadingFile}
          isPremium={isPremium}
        />
      </div>

      <PDFDrawer
        files={files}
        currentFile={currentFile}
        onFileSelect={handleFileSelect}
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {currentFile && (
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
            <div className="flex items-center space-x-4">
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
              <div className="h-6 w-px bg-gray-200"></div>
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center space-x-2"
                title="Open Files"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">Files</span>
              </button>
            </div>
          </div>
          <div className="relative w-full overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', minHeight: '100%' }}>
              <FileViewer
                file={currentFile}
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