"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import ProtectedRoute from "../components/ProtectedRoute";
import AppLayout from "../components/AppLayout";
// Custom Node Components

const CollectionNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-400">
    <Handle type="target" position={Position.Left} className="w-3 h-3" />
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-blue-500 mr-2" />
        <div className="text-lg font-bold">{data.label}</div>
      </div>
      <div className="text-gray-600 text-sm mt-2 bg-blue-50 p-3 rounded border border-blue-100">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="font-medium text-blue-700 mb-1">Collection Details</div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-blue-600">Size:</span>
                <span className="bg-blue-100 px-2 py-0.5 rounded text-xs">{data.description.split(',')[0]}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-600">Distance:</span>
                <span className="bg-blue-100 px-2 py-0.5 rounded text-xs">{data.description.split(',')[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Handle type="source" position={Position.Right} className="w-3 h-3" />
  </div>
);

const FunctionNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-400">
    <Handle type="target" position={Position.Left} className="w-3 h-3" />
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-green-500 mr-2" />
        <div className="text-lg font-bold">{data.label}</div>
      </div>
      <div className="text-gray-600 text-sm mt-2 bg-green-50 p-3 rounded border border-green-100">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <div>
            <div className="font-medium text-green-700 mb-1">Operation Details</div>
            <div className="flex items-center gap-1">
              <span className="text-green-600">Type:</span>
              <span className="bg-green-100 px-2 py-0.5 rounded text-xs">{data.description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Handle type="source" position={Position.Right} className="w-3 h-3" />
  </div>
);

const AnnotationNode = ({ data }) => {
  return (
    <div className="px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 cursor-move">
      <div className="flex items-start gap-2">
        <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md font-bold">
          {data.level}.
        </div>
        <div className="text-gray-700">{data.text}</div>
      </div>
      <div className="text-blue-500 text-xl mt-2 transform rotate-45">⤹</div>
    </div>
  );
};

const nodeTypes = {
  collection: CollectionNode,
  function: FunctionNode,
  annotation: AnnotationNode,
};

const initialNodes = [
  // Add annotation nodes first
  {
    id: 'annotation-1',
    type: 'annotation',
    data: { 
      level: 1,
      text: 'Collections store your data with vector embeddings for similarity search'
    },
    position: { x: 100, y: 50 },
    draggable: true,
    selectable: true,
  },
  {
    id: 'annotation-2',
    type: 'annotation',
    data: { 
      level: 2,
      text: 'Functions perform operations like storing, searching, and retrieving data'
    },
    position: { x: 400, y: 50 },
    draggable: true,
    selectable: true,
  },
  {
    id: 'annotation-3',
    type: 'annotation',
    data: { 
      level: 3,
      text: 'Connect nodes to create your data flow pipeline'
    },
    position: { x: 700, y: 50 },
    draggable: true,
    selectable: true,
  },
  // Collections
  {
    id: "documents",
    type: "collection",
    data: { 
      label: "Documents Collection", 
      description: "size: 1536, distance: COSINE" 
    },
    position: { x: 100, y: 100 },
  },
  {
    id: "conversations",
    type: "collection",
    data: { 
      label: "Conversations Collection", 
      description: "size: 1536, distance: COSINE" 
    },
    position: { x: 100, y: 250 },
  },
  {
    id: "chunks",
    type: "collection",
    data: { 
      label: "Document Chunks Collection", 
      description: "size: 1536, distance: COSINE" 
    },
    position: { x: 100, y: 400 },
  },

  // Document Operations
  {
    id: "init",
    type: "function",
    data: { 
      label: "Initialize Collections", 
      description: "Create collections if they don't exist" 
    },
    position: { x: 400, y: 250 },
  },
  {
    id: "store_doc",
    type: "function",
    data: { 
      label: "Store Document", 
      description: "Store document with embedding" 
    },
    position: { x: 700, y: 100 },
  },
  {
    id: "store_chunk",
    type: "function",
    data: { 
      label: "Store Chunks", 
      description: "Store document chunks" 
    },
    position: { x: 1000, y: 400 },
  },
  {
    id: "search",
    type: "function",
    data: { 
      label: "Search Similar", 
      description: "Search for similar documents" 
    },
    position: { x: 1200, y: 100 },
  },
  {
    id: "search_chunk",
    type: "function",
    data: { 
      label: "Search Chunks", 
      description: "Search for similar chunks" 
    },
    position: { x: 1200, y: 400 },
  },
  {
    id: "get_chunks",
    type: "function",
    data: { 
      label: "Get Document Chunks", 
      description: "Retrieve chunks for a document" 
    },
    position: { x: 1300, y: 250 },
  },

  // Conversation Operations
  {
    id: "store_conv",
    type: "function",
    data: { 
      label: "Store Conversation", 
      description: "Store conversation with embedding" 
    },
    position: { x: 2000, y: 250 },
  },
  {
    id: "search_conv",
    type: "function",
    data: { 
      label: "Search Conversations", 
      description: "Search for similar conversations" 
    },
    position: { x: 2200, y: 250 },
  },
  {
    id: "get_conv",
    type: "function",
    data: { 
      label: "Get Conversation", 
      description: "Retrieve specific conversation" 
    },
    position: { x: 2300, y: 150 },
  },
  {
    id: "update_conv",
    type: "function",
    data: { 
      label: "Update Conversation", 
      description: "Update existing conversation" 
    },
    position: { x: 2300, y: 350 },
  },
];

const initialEdges = [
  // Initialize Collections connections
  {
    id: "e1",
    source: "init",
    target: "documents",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "e2",
    source: "init",
    target: "conversations",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "e3",
    source: "init",
    target: "chunks",
    type: "smoothstep",
    animated: true,
  },

  // Document operations
  {
    id: "e4",
    source: "documents",
    target: "store_doc",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "e5",
    source: "store_doc",
    target: "search",
    type: "smoothstep",
    animated: true,
  },

  // Chunk operations
  {
    id: "e6",
    source: "chunks",
    target: "store_chunk",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "e7",
    source: "store_chunk",
    target: "search_chunk",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "e8",
    source: "search_chunk",
    target: "get_chunks",
    type: "smoothstep",
    animated: true,
  },

  // Conversation operations
  {
    id: "e9",
    source: "conversations",
    target: "store_conv",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "e10",
    source: "store_conv",
    target: "search_conv",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "e11",
    source: "search_conv",
    target: "get_conv",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "e12",
    source: "get_conv",
    target: "update_conv",
    type: "smoothstep",
    animated: true,
  },
];

// Update the styles
const annotationStyles = `
  .react-flow__node-annotation {
    pointer-events: all;
  }
  .react-flow__node-annotation .annotation-content {
    max-width: 300px;
  }
`;

export default function TestFlow() {
  // Initialize with empty arrays first
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [viewport, setViewport] = React.useState({ x: 0, y: 0, zoom: 1 });
  const [saveStatus, setSaveStatus] = React.useState('');
  const reactFlowWrapper = React.useRef(null);
  const reactFlowInstance = React.useRef(null);

  // Load saved positions and viewport on mount
  React.useEffect(() => {
    try {
      const savedNodes = localStorage.getItem("flowNodes");
      const savedEdges = localStorage.getItem("flowEdges");
      const savedViewport = localStorage.getItem("flowViewport");
      
      if (savedNodes && savedEdges) {
        const parsedNodes = JSON.parse(savedNodes);
        const parsedEdges = JSON.parse(savedEdges);
        setNodes(parsedNodes);
        setEdges(parsedEdges);
        setSaveStatus('Loaded saved layout');
      } else {
        // Only use initialNodes if there's no saved data
        setNodes(initialNodes);
        setEdges(initialEdges);
      }
      
      if (savedViewport) {
        const parsedViewport = JSON.parse(savedViewport);
        setViewport(parsedViewport);
      }
    } catch (error) {
      console.error('Error loading saved layout:', error);
      setSaveStatus('Error loading saved layout');
      // Fallback to initial nodes if there's an error
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, []);

  // Save positions and edges whenever they change
  React.useEffect(() => {
    if (nodes.length === 0) return; // Don't save if nodes are empty
    
    try {
      localStorage.setItem("flowNodes", JSON.stringify(nodes));
      localStorage.setItem("flowEdges", JSON.stringify(edges));
      setSaveStatus('Layout saved');
      
      // Clear the status message after 2 seconds
      const timer = setTimeout(() => {
        setSaveStatus('');
      }, 2000);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error saving layout:', error);
      setSaveStatus('Error saving layout');
    }
  }, [nodes, edges]);

  // Save viewport whenever it changes
  React.useEffect(() => {
    try {
      localStorage.setItem("flowViewport", JSON.stringify(viewport));
    } catch (error) {
      console.error('Error saving viewport:', error);
    }
  }, [viewport]);

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        style: { strokeWidth: 2 },
        markerEnd: {
          type: 'arrowclosed',
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
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
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", reactFlowBounds.width);
    svg.setAttribute("height", reactFlowBounds.height);
    svg.setAttribute(
      "viewBox",
      `0 0 ${reactFlowBounds.width} ${reactFlowBounds.height}`
    );

    // Add background
    const background = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    background.setAttribute("width", "100%");
    background.setAttribute("height", "100%");
    background.setAttribute("fill", "white");
    svg.appendChild(background);

    // Add nodes
    nodes.forEach((node) => {
      const nodeElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      nodeElement.setAttribute(
        "transform",
        `translate(${node.position.x * transform.zoom + transform.x}, ${
          node.position.y * transform.zoom + transform.y
        })`
      );

      // Create node rectangle
      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      rect.setAttribute("width", "120");
      rect.setAttribute("height", "80");
      rect.setAttribute("rx", "5");
      rect.setAttribute("fill", "white");
      rect.setAttribute(
        "stroke",
        node.type === "quantumGate"
          ? "#4caf50"
          : node.type === "measurement"
          ? "#f44336"
          : "#2196f3"
      );
      rect.setAttribute("stroke-width", "2");
      nodeElement.appendChild(rect);

      // Add node label (title)
      const titleText = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      titleText.setAttribute("x", "60");
      titleText.setAttribute("y", "30");
      titleText.setAttribute("text-anchor", "middle");
      titleText.setAttribute("dominant-baseline", "middle");
      titleText.setAttribute("font-weight", "bold");
      titleText.setAttribute("font-size", "14");
      titleText.textContent = node.data.label;
      nodeElement.appendChild(titleText);

      // Add node description
      const descText = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      descText.setAttribute("x", "60");
      descText.setAttribute("y", "55");
      descText.setAttribute("text-anchor", "middle");
      descText.setAttribute("dominant-baseline", "middle");
      descText.setAttribute("font-size", "12");
      descText.setAttribute("fill", "#666");
      descText.textContent = node.data.description;
      nodeElement.appendChild(descText);

      svg.appendChild(nodeElement);
    });

    // Add edges
    edges.forEach((edge) => {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      if (sourceNode && targetNode) {
        const sourceX =
          sourceNode.position.x * transform.zoom + transform.x + 120;
        const sourceY =
          sourceNode.position.y * transform.zoom + transform.y + 40;
        const targetX = targetNode.position.x * transform.zoom + transform.x;
        const targetY =
          targetNode.position.y * transform.zoom + transform.y + 40;

        path.setAttribute(
          "d",
          `M ${sourceX} ${sourceY} C ${(sourceX + targetX) / 2} ${sourceY}, ${
            (sourceX + targetX) / 2
          } ${targetY}, ${targetX} ${targetY}`
        );
        path.setAttribute("stroke", "#999");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("fill", "none");
        svg.appendChild(path);
      }
    });

    if (format === "svg") {
      // Export as SVG
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "quantum-circuit.svg";
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === "png") {
      // Export as PNG
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = reactFlowBounds.width;
        canvas.height = reactFlowBounds.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "quantum-circuit.png";
        link.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  // Create ref for the input element
  const inputRef = useRef(null);

  // Create state for the input value
  const [inputValue, setInputValue] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <AppLayout>
      <style>{annotationStyles}</style>
      <div style={{ width: "100vw", height: "100vh" }}>
        {saveStatus && (
          <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300">
            {saveStatus}
          </div>
        )}
        <div ref={reactFlowWrapper} style={{ width: "100%", height: "100%" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onMove={onMove}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ 
              padding: 0.5,
              minZoom: 0.5,
              maxZoom: 1.5
            }}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { strokeWidth: 2 },
              markerEnd: {
                type: 'arrowclosed',
              },
            }}
            initialViewport={viewport}
            panOnDrag={true}
            panOnScroll={true}
            selectionOnDrag={true}
            minZoom={0.1}
            maxZoom={4}
            onInit={(instance) => {
              reactFlowInstance.current = instance;
            }}
          >
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                switch (node.type) {
                  case 'collection':
                    return '#3b82f6';
                  case 'function':
                    return '#10b981';
                  case 'annotation':
                    return '#93c5fd';
                  default:
                    return '#999';
                }
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </AppLayout>
  );
}
