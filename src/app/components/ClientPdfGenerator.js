'use client';

import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function ClientPdfGenerator({ html, filename = 'document.pdf' }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generatePdf = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Create a temporary div to render the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      document.body.appendChild(tempDiv);
      
      // Configure PDF options
      const options = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        },
        pagebreak: { mode: 'avoid-all' }
      };
      
      // Generate and download the PDF
      await html2pdf().from(tempDiv).set(options).save();
      
      // Clean up
      document.body.removeChild(tempDiv);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <button 
        onClick={generatePdf} 
        disabled={isGenerating}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isGenerating ? 'Generating PDF...' : 'Download PDF'}
      </button>
      
      {error && (
        <div className="mt-2 text-red-500">
          Error: {error}
        </div>
      )}
    </div>
  );
} 