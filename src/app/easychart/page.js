"use client";

import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import ProtectedRoute from '../components/ProtectedRoute';
import AppLayout from '../components/AppLayout';

export default function TestMermaid() {
  const [diagramCode, setDiagramCode] = useState(`flowchart TD
    %% Main Application Structure
    Start([FastAPI App]) --> AuthRouter[Auth Router]
    Start --> PDFRouter[PDF Router]
    Start --> HealthEndpoints[Health Endpoints]
    Start --> MonitorEndpoints[Monitor Endpoints]

    %% Auth Router Endpoints
    AuthRouter --> AuthLogin[POST /auth/login]
    AuthRouter --> AuthRegister[POST /auth/register]
    AuthRouter --> AuthMe[GET /auth/me]

    %% PDF Router Endpoints
    PDFRouter --> PDFUpload[POST /pdf/upload]
    PDFRouter --> PDFList[GET /pdf/list]
    PDFRouter --> PDFDelete[DELETE /pdf/id]

    %% Health Endpoints
    HealthEndpoints --> Root[GET /]
    HealthEndpoints --> Health[GET /health]
    HealthEndpoints --> DBStatus[GET /db-status]

    %% Monitor Endpoints
    MonitorEndpoints --> MonitorDB[GET /monitor/db]
    MonitorEndpoints --> MonitorUsers[GET /monitor/users]

    %% Database Operations
    AuthLogin --> DB[(Database)]
    AuthRegister --> DB
    AuthMe --> DB
    PDFUpload --> DB
    PDFList --> DB
    PDFDelete --> DB
    DBStatus --> DB
    MonitorDB --> DB
    MonitorUsers --> DB

    %% Error Handling
    DB --> ErrorHandler[Error Handler]
    ErrorHandler --> ErrorResponse[Error Response]

    %% Styling
    classDef endpoint fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    classDef router fill:#bbdefb,stroke:#1976d2,stroke-width:2px
    classDef db fill:#ffe082,stroke:#f57c00,stroke-width:2px
    classDef error fill:#ffcdd2,stroke:#d32f2f,stroke-width:2px
    
    class Start,Root,Health,DBStatus,MonitorDB,MonitorUsers endpoint
    class AuthRouter,PDFRouter router
    class DB db
    class ErrorHandler,ErrorResponse error`);

  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);
  const diagramRef = useRef(null);

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  const handleCodeChange = (e) => {
    setDiagramCode(e.target.value);
    setError(null);
  };

  const renderDiagram = async () => {
    try {
      const { svg } = await mermaid.render('mermaid-diagram', diagramCode);
      setSvg(svg);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    renderDiagram();
  }, [diagramCode]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  const handleDownload = (format) => {
    if (!diagramRef.current) return;

    const svgElement = diagramRef.current.querySelector('svg');
    if (!svgElement) return;

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'diagram.svg';
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'png') {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = 'diagram.png';
        link.click();
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svgElement));
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="flex h-screen">
          {/* Code Editor */}
          {/* <div className="w-1/2 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Mermaid Code</h2>
        <textarea
          value={diagramCode}
          onChange={handleCodeChange}
          className="w-full h-[calc(100vh-8rem)] p-4 font-mono text-sm border rounded"
          placeholder="Enter Mermaid diagram code..."
        />
      </div> */}

          {/* Diagram Preview */}
          <div className="w-1/2 p-4 w-[100%]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleZoomIn}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Zoom In
                </button>
                <button
                  onClick={handleZoomOut}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Zoom Out
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Reset
                </button>
                <button
                  onClick={() => handleDownload('svg')}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Download SVG
                </button>
                <button
                  onClick={() => handleDownload('png')}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Download PNG
                </button>
              </div>
            </div>
            <div className="border rounded p-4 h-[calc(100vh-8rem)] overflow-auto">
              {error ? (
                <div className="p-4 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              ) : (
                <div
                  ref={diagramRef}
                  className="mermaid-diagram"
                  style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>


  );
} 