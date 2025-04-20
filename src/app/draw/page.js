"use client";

import React, { useEffect, useState } from 'react';
import ExcalidrawViewer from '../components/ExcalidrawViewer';
import { useRouter, useSearchParams } from 'next/navigation';
// import './draw.css';

export default function DrawPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    const text = searchParams.get('text');
    if (text) {
      setSelectedText(text);
    }
  }, [searchParams]);

  const handleSave = (data) => {
    // Handle saving the diagram data
    console.log('Diagram saved:', data);
    // You can implement logic to save the diagram to your backend here
  };

  return (
    <div className="h-screen w-screen bg-white">
      <div className="fixed top-4 left-4 z-50 flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-colors"
        >
          Back to Editor
        </button>
        
        {selectedText && (
          <div className="bg-gray-50 p-4 rounded-lg max-w-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Text:</h3>
            <p className="text-sm text-gray-600">{selectedText}</p>
          </div>
        )}
      </div>
      
      <ExcalidrawViewer 
        onSave={handleSave} 
        initialText={selectedText}
      />
    </div>
  );
} 