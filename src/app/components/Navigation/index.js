import React from 'react';

const ControllerNav = ({
  fileType,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onEdit,
  isEditing
}) => {
  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Navigation Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onPrevPage}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              aria-label="Previous page"
            >
              ←
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={onNextPage}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              aria-label="Next page"
            >
              →
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onZoomOut}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                aria-label="Zoom out"
              >
                -
              </button>
              <button
                onClick={onZoomIn}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                aria-label="Zoom in"
              >
                +
              </button>
            </div>

            {/* Make Button */}
            <button
              onClick={onEdit}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                isEditing 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
              title={isEditing ? "Hide Editor" : "Edit PDF"}
            >
              {isEditing ? "Done" : "Make"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ControllerNav; 