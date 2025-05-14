"use client";
import React, { useState } from 'react';
import FileViewer from './PDFViewer';

const PDFUploader = () => {
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(selectedFile);
      setFile({
        type: 'pdf',
        url: fileUrl,
        name: selectedFile.name
      });
      setCurrentPage(1);
      setError(null);
    } else {
      setError('Please select a valid PDF file');
    }
  };

  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
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
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 w-full max-w-md">
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

      {file && (
        <div className="w-full">
          <FileViewer
            file={file}
            currentPage={currentPage}
            onLoadSuccess={handleLoadSuccess}
          />
          
          {numPages > 0 && (
            <div className="mt-4 flex justify-center items-center gap-4">
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
          )}
        </div>
      )}
    </div>
  );
};

export default PDFUploader; 