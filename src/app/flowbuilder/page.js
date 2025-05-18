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

const EventNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-400">
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-blue-500 mr-2" />
        <div className="text-lg font-bold">{data.label}</div>
      </div>
      <div className="text-gray-600">{data.description}</div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </div>
);

const HandlerNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-400">
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-purple-500 mr-2" />
        <div className="text-lg font-bold">{data.label}</div>
      </div>
      <div className="text-gray-600">{data.description}</div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </div>
);

const StateNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-orange-400">
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-orange-500 mr-2" />
        <div className="text-lg font-bold">{data.label}</div>
      </div>
      <div className="text-gray-600">{data.description}</div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </div>
);

const ActionNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-yellow-400">
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-yellow-500 mr-2" />
        <div className="text-lg font-bold">{data.label}</div>
      </div>
      <div className="text-gray-600">{data.description}</div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </div>
);

const nodeTypes = {
  event: EventNode,
  handler: HandlerNode,
  state: StateNode,
  action: ActionNode,
};

const initialNodes = [
  // Main Service Structure
  {
    id: 'storage-service',
    type: 'event',
    data: { label: 'SupabaseStorageService', description: 'File storage management' },
    position: { x: 250, y: 50 },
  },
  {
    id: 'init',
    type: 'state',
    data: { label: 'Initialization', description: 'Configure Supabase client' },
    position: { x: 250, y: 150 },
  },
  {
    id: 'client',
    type: 'state',
    data: { label: 'Supabase Client', description: 'Lazy initialization' },
    position: { x: 250, y: 250 },
  },
  {
    id: 'upload',
    type: 'handler',
    data: { label: 'Upload File', description: 'Store files in Supabase' },
    position: { x: 100, y: 350 },
  },
  {
    id: 'delete',
    type: 'handler',
    data: { label: 'Delete File', description: 'Remove files from storage' },
    position: { x: 400, y: 350 },
  },
  {
    id: 'list',
    type: 'handler',
    data: { label: 'List Files', description: 'Get user files' },
    position: { x: 100, y: 450 },
  },
  {
    id: 'metadata',
    type: 'handler',
    data: { label: 'Get Metadata', description: 'File information' },
    position: { x: 400, y: 450 },
  },
  {
    id: 'url',
    type: 'handler',
    data: { label: 'Get URL', description: 'Public file URL' },
    position: { x: 250, y: 550 },
  },
  {
    id: 'error-handling',
    type: 'action',
    data: { label: 'Error Handling', description: 'Log and handle errors' },
    position: { x: 250, y: 650 },
  },
  {
    id: 'logging',
    type: 'action',
    data: { label: 'Logging', description: 'Track operations' },
    position: { x: 250, y: 750 },
  },
  {
    id: 'file-info',
    type: 'action',
    data: { label: 'File Information', description: 'Metadata and URLs' },
    position: { x: 250, y: 850 },
  },
  {
    id: 'security',
    type: 'action',
    data: { label: 'Security', description: 'User isolation and access control' },
    position: { x: 250, y: 950 },
  }
];

const initialEdges = [
  // Main flow
  { id: 'e1', source: 'storage-service', target: 'init', type: 'smoothstep', animated: true },
  { id: 'e2', source: 'init', target: 'client', type: 'smoothstep', animated: true },

  // File operations
  { id: 'e3', source: 'client', target: 'upload', type: 'smoothstep', animated: true },
  { id: 'e4', source: 'client', target: 'delete', type: 'smoothstep', animated: true },
  { id: 'e5', source: 'client', target: 'list', type: 'smoothstep', animated: true },
  { id: 'e6', source: 'client', target: 'metadata', type: 'smoothstep', animated: true },
  { id: 'e7', source: 'client', target: 'url', type: 'smoothstep', animated: true },

  // Error handling and logging
  { id: 'e8', source: 'upload', target: 'error-handling', type: 'smoothstep', animated: true },
  { id: 'e9', source: 'delete', target: 'error-handling', type: 'smoothstep', animated: true },
  { id: 'e10', source: 'list', target: 'error-handling', type: 'smoothstep', animated: true },
  { id: 'e11', source: 'metadata', target: 'error-handling', type: 'smoothstep', animated: true },
  { id: 'e12', source: 'url', target: 'error-handling', type: 'smoothstep', animated: true },

  // Logging and information
  { id: 'e13', source: 'error-handling', target: 'logging', type: 'smoothstep', animated: true },
  { id: 'e14', source: 'upload', target: 'file-info', type: 'smoothstep', animated: true },
  { id: 'e15', source: 'metadata', target: 'file-info', type: 'smoothstep', animated: true },

  // Security
  { id: 'e16', source: 'upload', target: 'security', type: 'smoothstep', animated: true },
  { id: 'e17', source: 'delete', target: 'security', type: 'smoothstep', animated: true },
  { id: 'e18', source: 'list', target: 'security', type: 'smoothstep', animated: true }
];

export default function TestFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ProtectedRoute>
      <AppLayout>
        <div style={{ width: '100vw', height: '100vh' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
} 