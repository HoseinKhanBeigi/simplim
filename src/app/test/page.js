"use client";

import React, { useState } from 'react';
import ExcalidrawViewer from '../components/ExcalidrawViewer';

const TestPage = () => {
  const [drawingData, setDrawingData] = useState(null);

  const handleSave = (data) => {
    console.log('Saved drawing data:', data);
    setDrawingData(data);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1">
        <ExcalidrawViewer onSave={handleSave} />
      </div>

      {drawingData && (
        <div className="p-4 bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Saved Drawing Data</h2>
          <pre className="bg-white p-4 rounded overflow-auto max-h-40">
            {JSON.stringify(drawingData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestPage; 