"use client";

import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function TestMermaid() {
  const [diagramCode, setDiagramCode] = useState(`flowchart TD
    %% Event Handlers
    Start([Start]) --> Init[Initialize Component]
    Init --> RegisterEvents[Register Event Handlers]
    
    %% Click Event Flow
    RegisterEvents --> ClickHandler{Click Event}
    ClickHandler -->|Single Click| ToggleSelect[Toggle Selection]
    ClickHandler -->|Double Click| OpenModal[Open Excalidraw Modal]
    
    %% Modal Events
    OpenModal --> ModalEvents{Modal Events}
    ModalEvents -->|Save| SaveData[Save Drawing Data]
    ModalEvents -->|Delete| DeleteNode[Delete Node]
    ModalEvents -->|Close| CloseModal[Close Modal]
    
    %% Resize Events
    RegisterEvents --> ResizeHandler{Resize Event}
    ResizeHandler -->|Start| StartResize[Start Resizing]
    StartResize --> ResizeOps[Resize Operations]
    ResizeOps -->|End| EndResize[End Resizing]
    EndResize --> UpdateDimensions[Update Node Dimensions]
    
    %% Selection Events
    ToggleSelect --> SelectionState{Selection State}
    SelectionState -->|Selected| ShowResizer[Show Image Resizer]
    SelectionState -->|Not Selected| HideResizer[Hide Image Resizer]
    
    %% Data Flow
    SaveData --> UpdateEditor[Update Editor State]
    DeleteNode --> RemoveNode[Remove Node from Editor]
    CloseModal --> CheckElements{Has Elements?}
    CheckElements -->|No| RemoveNode
    CheckElements -->|Yes| KeepNode[Keep Node]
    
    %% Styling
    classDef event fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    classDef handler fill:#bbdefb,stroke:#1976d2,stroke-width:2px
    classDef state fill:#ffe082,stroke:#f57c00,stroke-width:2px
    classDef action fill:#fff8e1,stroke:#ffb300,stroke-width:2px
    
    class Start,Init,RegisterEvents event
    class ClickHandler,ResizeHandler,ModalEvents,SelectionState,CheckElements handler
    class ToggleSelect,OpenModal,StartResize,EndResize state
    class SaveData,DeleteNode,CloseModal,UpdateDimensions,ShowResizer,HideResizer,UpdateEditor,RemoveNode,KeepNode action`);

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
    <div className="flex h-screen">
      {/* Code Editor */}
      <div className="w-1/2 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Mermaid Code</h2>
        <textarea
          value={diagramCode}
          onChange={handleCodeChange}
          className="w-full h-[calc(100vh-8rem)] p-4 font-mono text-sm border rounded"
          placeholder="Enter Mermaid diagram code..."
        />
      </div>

      {/* Diagram Preview */}
      <div className="w-1/2 p-4">
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
  );
} 