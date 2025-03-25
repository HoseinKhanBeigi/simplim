import React from 'react';

const PDFControls = ({
  pageNumber,
  numPages,
  scale,
  jumpToPage,
  onPrevPage,
  onNextPage,
  onJumpToPage,
  onJumpToPageChange,
  onZoomIn,
  onZoomOut
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
      <div className="flex items-center space-x-4">
        <button
          onClick={onPrevPage}
          disabled={pageNumber <= 1}
          className="px-3 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={onNextPage}
          disabled={pageNumber >= numPages}
          className="px-3 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
        <form onSubmit={onJumpToPage} className="flex items-center space-x-2">
          <input
            type="number"
            value={jumpToPage}
            onChange={onJumpToPageChange}
            min="1"
            max={numPages}
            className="w-16 px-2 py-1 border rounded-md"
            placeholder="Page"
          />
          <span className="text-gray-600">
            of {numPages || 0}
          </span>
        </form>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onZoomOut}
          className="px-3 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50"
        >
          -
        </button>
        <span className="text-gray-600">
          {(scale * 100).toFixed(0)}%
        </span>
        <button
          onClick={onZoomIn}
          className="px-3 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default PDFControls; 