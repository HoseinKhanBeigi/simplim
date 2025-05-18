"use client";

import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ProtectedRoute from '../components/ProtectedRoute';
import AppLayout from '../components/AppLayout';
// Custom Node Components

const QuantumGateNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-400">
    <Handle type="target" position={Position.Left} className="w-3 h-3" />
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-green-500 mr-2" />
        <div className="text-lg font-bold">{data.label}</div>
      </div>
      <div className="text-gray-600">{data.description}</div>
    </div>
    <Handle type="source" position={Position.Right} className="w-3 h-3" />
  </div>
);

const MeasurementNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-red-400">
    <Handle type="target" position={Position.Left} className="w-3 h-3" />
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-red-500 mr-2" />
        <div className="text-lg font-bold">{data.label}</div>
      </div>
      <div className="text-gray-600">{data.description}</div>
    </div>
    <Handle type="source" position={Position.Right} className="w-3 h-3" />
  </div>
);

const QubitNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-400">
    <Handle type="target" position={Position.Left} className="w-3 h-3" />
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-blue-500 mr-2" />
        <div className="text-lg font-bold">{data.label}</div>
      </div>
      <div className="text-gray-600">{data.description}</div>
    </div>
    <Handle type="source" position={Position.Right} className="w-3 h-3" />
  </div>
);

const nodeTypes = {
  quantumGate: QuantumGateNode,
  measurement: MeasurementNode,
  qubit: QubitNode,
};

const initialNodes = [
  // Qubit initialization
  {
    id: 'qubit1',
    type: 'qubit',
    data: { label: '|0⟩', description: 'Initial state' },
    position: { x: 50, y: 100 },
  },
  {
    id: 'qubit2',
    type: 'qubit',
    data: { label: '|0⟩', description: 'Initial state' },
    position: { x: 50, y: 300 },
  },
  
  // Hadamard gates
  {
    id: 'h1',
    type: 'quantumGate',
    data: { label: 'H', description: 'Hadamard Gate' },
    position: { x: 200, y: 100 },
  },
  {
    id: 'h2',
    type: 'quantumGate',
    data: { label: 'H', description: 'Hadamard Gate' },
    position: { x: 200, y: 300 },
  },
  
  // CNOT gate
  {
    id: 'cnot',
    type: 'quantumGate',
    data: { label: 'CNOT', description: 'Controlled-NOT Gate' },
    position: { x: 350, y: 200 },
  },
  
  // Phase gates
  {
    id: 'phase1',
    type: 'quantumGate',
    data: { label: 'S', description: 'Phase Gate' },
    position: { x: 500, y: 100 },
  },
  {
    id: 'phase2',
    type: 'quantumGate',
    data: { label: 'S', description: 'Phase Gate' },
    position: { x: 500, y: 300 },
  },
  
  // Measurements
  {
    id: 'measure1',
    type: 'measurement',
    data: { label: 'M', description: 'Measurement' },
    position: { x: 650, y: 100 },
  },
  {
    id: 'measure2',
    type: 'measurement',
    data: { label: 'M', description: 'Measurement' },
    position: { x: 650, y: 300 },
  }
];

const initialEdges = [
  // Qubit to Hadamard connections
  { id: 'e1', source: 'qubit1', target: 'h1', type: 'smoothstep', animated: true },
  { id: 'e2', source: 'qubit2', target: 'h2', type: 'smoothstep', animated: true },
  
  // Hadamard to CNOT connections
  { id: 'e3', source: 'h1', target: 'cnot', type: 'smoothstep', animated: true },
  { id: 'e4', source: 'h2', target: 'cnot', type: 'smoothstep', animated: true },
  
  // CNOT to Phase connections
  { id: 'e5', source: 'cnot', target: 'phase1', type: 'smoothstep', animated: true },
  { id: 'e6', source: 'cnot', target: 'phase2', type: 'smoothstep', animated: true },
  
  // Phase to Measurement connections
  { id: 'e7', source: 'phase1', target: 'measure1', type: 'smoothstep', animated: true },
  { id: 'e8', source: 'phase2', target: 'measure2', type: 'smoothstep', animated: true }
];

export default function TestFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [viewport, setViewport] = React.useState({ x: 0, y: 0, zoom: 1 });
  const reactFlowWrapper = React.useRef(null);
  const reactFlowInstance = React.useRef(null);

  // Load saved positions and viewport on mount
  React.useEffect(() => {
    const savedNodes = localStorage.getItem('flowNodes');
    const savedViewport = localStorage.getItem('flowViewport');
    if (savedNodes) {
      setNodes(JSON.parse(savedNodes));
    }
    if (savedViewport) {
      setViewport(JSON.parse(savedViewport));
    }
  }, []);

  // Save positions and viewport whenever they change
  React.useEffect(() => {
    localStorage.setItem('flowNodes', JSON.stringify(nodes));
  }, [nodes]);

  React.useEffect(() => {
    localStorage.setItem('flowViewport', JSON.stringify(viewport));
  }, [viewport]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onMove = useCallback((_, viewport) => {
    setViewport(viewport);
  }, []);

  const handleExport = (format) => {
    if (!reactFlowInstance.current) return;

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const transform = reactFlowInstance.current.getViewport();

    // Create a new SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', reactFlowBounds.width);
    svg.setAttribute('height', reactFlowBounds.height);
    svg.setAttribute('viewBox', `0 0 ${reactFlowBounds.width} ${reactFlowBounds.height}`);

    // Add background
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', 'white');
    svg.appendChild(background);

    // Add nodes
    nodes.forEach((node) => {
      const nodeElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      nodeElement.setAttribute('transform', `translate(${node.position.x * transform.zoom + transform.x}, ${node.position.y * transform.zoom + transform.y})`);

      // Create node rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', '120');
      rect.setAttribute('height', '80');
      rect.setAttribute('rx', '5');
      rect.setAttribute('fill', 'white');
      rect.setAttribute('stroke', node.type === 'quantumGate' ? '#4caf50' : node.type === 'measurement' ? '#f44336' : '#2196f3');
      rect.setAttribute('stroke-width', '2');
      nodeElement.appendChild(rect);

      // Add node label (title)
      const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      titleText.setAttribute('x', '60');
      titleText.setAttribute('y', '30');
      titleText.setAttribute('text-anchor', 'middle');
      titleText.setAttribute('dominant-baseline', 'middle');
      titleText.setAttribute('font-weight', 'bold');
      titleText.setAttribute('font-size', '14');
      titleText.textContent = node.data.label;
      nodeElement.appendChild(titleText);

      // Add node description
      const descText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      descText.setAttribute('x', '60');
      descText.setAttribute('y', '55');
      descText.setAttribute('text-anchor', 'middle');
      descText.setAttribute('dominant-baseline', 'middle');
      descText.setAttribute('font-size', '12');
      descText.setAttribute('fill', '#666');
      descText.textContent = node.data.description;
      nodeElement.appendChild(descText);

      svg.appendChild(nodeElement);
    });

    // Add edges
    edges.forEach((edge) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const sourceX = sourceNode.position.x * transform.zoom + transform.x + 120;
        const sourceY = sourceNode.position.y * transform.zoom + transform.y + 40;
        const targetX = targetNode.position.x * transform.zoom + transform.x;
        const targetY = targetNode.position.y * transform.zoom + transform.y + 40;

        path.setAttribute('d', `M ${sourceX} ${sourceY} C ${(sourceX + targetX) / 2} ${sourceY}, ${(sourceX + targetX) / 2} ${targetY}, ${targetX} ${targetY}`);
        path.setAttribute('stroke', '#999');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        svg.appendChild(path);
      }
    });

    if (format === 'svg') {
      // Export as SVG
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'quantum-circuit.svg';
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'png') {
      // Export as PNG
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = reactFlowBounds.width;
        canvas.height = reactFlowBounds.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = 'quantum-circuit.png';
        link.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div style={{ width: '100vw', height: '100vh' }}>
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-white/90 p-3 rounded-lg shadow-lg">
            <div className="text-sm font-medium text-gray-700 mb-1">Export Diagram</div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('svg')}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors duration-200 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                SVG
              </button>
              <button
                onClick={() => handleExport('png')}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors duration-200 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                PNG
              </button>
            </div>
          </div>
          <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onMove={onMove}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              initialViewport={viewport}
              panOnDrag={true}
              panOnScroll={true}
              selectionOnDrag={false}
              minZoom={0.1}
              maxZoom={4}
              onInit={(instance) => {
                reactFlowInstance.current = instance;
              }}
            >
              <Controls />
              <MiniMap />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
} 
