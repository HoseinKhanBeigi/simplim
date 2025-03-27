import React from 'react';

const PDFViewer = ({ children, onTextContentChange, onTextSelect }) => (
  <div className="flex-1">
    <div className="p-4">
      <div 
        className="bg-white rounded-lg border border-gray-200 overflow-auto" 
        style={{ height: 'calc(100vh - 300px)' }}
      >
        {React.cloneElement(children, {
          onTextContentChange,
          onTextSelect
        })}
      </div>
    </div>
  </div>
);

export default PDFViewer; 