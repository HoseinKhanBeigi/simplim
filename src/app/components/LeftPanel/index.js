"use client";

import React, { useState, useRef, useEffect } from "react";
import ControllerNav from "../Navigation";

const LeftPanel = ({
  currentFile,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  currentPage,
  totalPages,
  children,
  isEditing,
  onEdit,
}) => {

  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelError, setModelError] = useState(null);


  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {isModelLoading && (
        <div className="fixed top-0 left-0 w-full p-4 bg-blue-100 text-blue-800">
          Loading text simplification model...
        </div>
      )}
      {modelError && (
        <div className="fixed top-0 left-0 w-full p-4 bg-red-100 text-red-800">
          Model Error: {modelError}
        </div>
      )}
      {currentFile && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="sticky top-0 z-50 bg-white shadow-md">
            <ControllerNav
              fileType={currentFile?.type}
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevPage={onPrevPage}
              onNextPage={onNextPage}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onEdit={onEdit}
              isEditing={isEditing}
            />
          </div>

          {/* PDF Viewer Container */}
          <div className="flex-1 overflow-y-auto relative">
            <div className="absolute inset-0 p-4">
              <div className="bg-white rounded-lg border border-gray-200 h-full">
                {React.cloneElement(children, {
                  isEditing: isEditing,
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {!currentFile && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Upload a PDF to simplify and understand it better.
        </div>
      )}
    </div>
  );
};

export default LeftPanel;
