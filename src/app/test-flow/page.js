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
  // Event Nodes
  {
    id: 'start',
    type: 'event',
    data: { label: 'Start', description: 'Initial state' },
    position: { x: 250, y: 50 },
  },
  {
    id: 'init',
    type: 'event',
    data: { label: 'Initialize Component', description: 'Component initialization' },
    position: { x: 250, y: 150 },
  },
  {
    id: 'register',
    type: 'event',
    data: { label: 'Register Event Handlers', description: 'Event registration' },
    position: { x: 250, y: 250 },
  },

  // Handler Nodes
  {
    id: 'click-handler',
    type: 'handler',
    data: { label: 'Click Event', description: 'Handle click events' },
    position: { x: 100, y: 350 },
  },
  {
    id: 'resize-handler',
    type: 'handler',
    data: { label: 'Resize Event', description: 'Handle resize events' },
    position: { x: 400, y: 350 },
  },
  {
    id: 'modal-events',
    type: 'handler',
    data: { label: 'Modal Events', description: 'Handle modal interactions' },
    position: { x: 250, y: 450 },
  },
  {
    id: 'selection-state',
    type: 'handler',
    data: { label: 'Selection State', description: 'Manage selection state' },
    position: { x: 100, y: 550 },
  },
  {
    id: 'check-elements',
    type: 'handler',
    data: { label: 'Has Elements?', description: 'Check for existing elements' },
    position: { x: 400, y: 550 },
  },

  // State Nodes
  {
    id: 'toggle-select',
    type: 'state',
    data: { label: 'Toggle Selection', description: 'Toggle selection state' },
    position: { x: 50, y: 450 },
  },
  {
    id: 'open-modal',
    type: 'state',
    data: { label: 'Open Excalidraw Modal', description: 'Open drawing modal' },
    position: { x: 150, y: 450 },
  },
  {
    id: 'start-resize',
    type: 'state',
    data: { label: 'Start Resizing', description: 'Begin resize operation' },
    position: { x: 350, y: 450 },
  },
  {
    id: 'end-resize',
    type: 'state',
    data: { label: 'End Resizing', description: 'Complete resize operation' },
    position: { x: 450, y: 450 },
  },

  // Action Nodes
  {
    id: 'save-data',
    type: 'action',
    data: { label: 'Save Drawing Data', description: 'Save current drawing' },
    position: { x: 150, y: 550 },
  },
  {
    id: 'delete-node',
    type: 'action',
    data: { label: 'Delete Node', description: 'Remove node' },
    position: { x: 250, y: 550 },
  },
  {
    id: 'close-modal',
    type: 'action',
    data: { label: 'Close Modal', description: 'Close drawing modal' },
    position: { x: 350, y: 550 },
  },
  {
    id: 'update-dimensions',
    type: 'action',
    data: { label: 'Update Node Dimensions', description: 'Update size' },
    position: { x: 450, y: 550 },
  },
  {
    id: 'show-resizer',
    type: 'action',
    data: { label: 'Show Image Resizer', description: 'Display resize controls' },
    position: { x: 50, y: 650 },
  },
  {
    id: 'hide-resizer',
    type: 'action',
    data: { label: 'Hide Image Resizer', description: 'Hide resize controls' },
    position: { x: 150, y: 650 },
  },
  {
    id: 'update-editor',
    type: 'action',
    data: { label: 'Update Editor State', description: 'Update editor' },
    position: { x: 250, y: 650 },
  },
  {
    id: 'remove-node',
    type: 'action',
    data: { label: 'Remove Node from Editor', description: 'Remove from editor' },
    position: { x: 350, y: 650 },
  },
  {
    id: 'keep-node',
    type: 'action',
    data: { label: 'Keep Node', description: 'Maintain node' },
    position: { x: 450, y: 650 },
  },
];

const initialEdges = [
  // Initial Flow
  { id: 'e1', source: 'start', target: 'init', type: 'smoothstep', animated: true },
  { id: 'e2', source: 'init', target: 'register', type: 'smoothstep', animated: true },

  // Click Event Flow
  { id: 'e3', source: 'register', target: 'click-handler', type: 'smoothstep', animated: true },
  { id: 'e4', source: 'click-handler', target: 'toggle-select', type: 'smoothstep', animated: true, label: 'Single Click' },
  { id: 'e5', source: 'click-handler', target: 'open-modal', type: 'smoothstep', animated: true, label: 'Double Click' },

  // Modal Events
  { id: 'e6', source: 'open-modal', target: 'modal-events', type: 'smoothstep', animated: true },
  { id: 'e7', source: 'modal-events', target: 'save-data', type: 'smoothstep', animated: true, label: 'Save' },
  { id: 'e8', source: 'modal-events', target: 'delete-node', type: 'smoothstep', animated: true, label: 'Delete' },
  { id: 'e9', source: 'modal-events', target: 'close-modal', type: 'smoothstep', animated: true, label: 'Close' },

  // Resize Events
  { id: 'e10', source: 'register', target: 'resize-handler', type: 'smoothstep', animated: true },
  { id: 'e11', source: 'resize-handler', target: 'start-resize', type: 'smoothstep', animated: true, label: 'Start' },
  { id: 'e12', source: 'start-resize', target: 'end-resize', type: 'smoothstep', animated: true },
  { id: 'e13', source: 'end-resize', target: 'update-dimensions', type: 'smoothstep', animated: true },

  // Selection Events
  { id: 'e14', source: 'toggle-select', target: 'selection-state', type: 'smoothstep', animated: true },
  { id: 'e15', source: 'selection-state', target: 'show-resizer', type: 'smoothstep', animated: true, label: 'Selected' },
  { id: 'e16', source: 'selection-state', target: 'hide-resizer', type: 'smoothstep', animated: true, label: 'Not Selected' },

  // Data Flow
  { id: 'e17', source: 'save-data', target: 'update-editor', type: 'smoothstep', animated: true },
  { id: 'e18', source: 'delete-node', target: 'remove-node', type: 'smoothstep', animated: true },
  { id: 'e19', source: 'close-modal', target: 'check-elements', type: 'smoothstep', animated: true },
  { id: 'e20', source: 'check-elements', target: 'remove-node', type: 'smoothstep', animated: true, label: 'No' },
  { id: 'e21', source: 'check-elements', target: 'keep-node', type: 'smoothstep', animated: true, label: 'Yes' },
];

export default function TestFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
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
  );
} 