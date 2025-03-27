"use client";

import React, { useState, useEffect } from 'react';

const SplitScreenLayout = ({ 
  leftPane, 
  rightPane,
  initialLeftWidth = 50, // Initial width of left pane in percentage
  minLeftWidth = 20,     // Minimum width of left pane in percentage
  maxLeftWidth = 80      // Maximum width of left pane in percentage
}) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const container = document.getElementById('split-screen-container');
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Constrain the width between min and max values
      const constrainedWidth = Math.min(Math.max(newLeftWidth, minLeftWidth), maxLeftWidth);
      setLeftWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minLeftWidth, maxLeftWidth]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  return (
    <div 
      id="split-screen-container"
      className="flex h-screen w-full overflow-hidden select-none"
    >
      {/* Left Pane */}
      <div 
        className="h-full overflow-auto"
        style={{ width: `${leftWidth}%` }}
      >
        {leftPane}
      </div>

      {/* Resizer */}
      <div
        className="w-2 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors active:bg-blue-600 flex-shrink-0"
        onMouseDown={handleMouseDown}
        style={{ cursor: isResizing ? 'col-resize' : 'default' }}
      />

      {/* Right Pane */}
      <div 
        className="h-full overflow-auto"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {rightPane}
      </div>
    </div>
  );
};

export default SplitScreenLayout;
