"use client";

import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import ProtectedRoute from '../components/ProtectedRoute';
import AppLayout from '../components/AppLayout';

export default function TestMermaid() {
  const [diagramType, setDiagramType] = useState('flowchart');
  const [diagramCode, setDiagramCode] = useState(`flowchart TD
    %% Quantum Circuit Diagram
    subgraph Circuit[Quantum Circuit]
        direction TB
        
        %% Qubit Lines
        Q1["|0>"] --> H1[H]
        Q2["|0>"] --> H2[H]
        
        %% Gates
        H1 --> CNOT1[CNOT]
        H2 --> CNOT1
        
        %% Phase Gates
        CNOT1 --> S1[S]
        CNOT1 --> S2[S]
        
        %% Measurements
        S1 --> M1[M]
        S2 --> M2[M]
    end

    %% Legend
    subgraph Legend[Circuit Elements]
        direction LR
        L1[Qubit] --- L2[Gate] --- L3[Measurement]
    end

    %% Styling
    classDef qubit fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    classDef gate fill:#c8e6c9,stroke:#4caf50,stroke-width:2px
    classDef measure fill:#ffcdd2,stroke:#f44336,stroke-width:2px
    classDef circuit fill:#f5f5f5,stroke:#9e9e9e,stroke-width:2px
    
    class Q1,Q2 qubit
    class H1,H2,CNOT1,S1,S2 gate
    class M1,M2 measure
    class Circuit circuit`);

  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);
  const diagramRef = useRef(null);

  const diagramTypes = {
    flowchart: `flowchart TD
      %% Quantum Circuit Diagram
      subgraph Circuit[Quantum Circuit]
          direction TB
          
          %% Qubit Lines
          Q1["|0>"] --> H1[H]
          Q2["|0>"] --> H2[H]
          
          %% Gates
          H1 --> CNOT1[CNOT]
          H2 --> CNOT1
          
          %% Phase Gates
          CNOT1 --> S1[S]
          CNOT1 --> S2[S]
          
          %% Measurements
          S1 --> M1[M]
          S2 --> M2[M]
      end`,

    sequence: `sequenceDiagram
      participant Q1 as Qubit 1
      participant Q2 as Qubit 2
      participant H as Hadamard
      participant CNOT as CNOT Gate
      participant S as Phase Gate
      participant M as Measurement
      
      Q1->>H: Initialize |0>
      Q2->>H: Initialize |0>
      H->>CNOT: Apply H
      CNOT->>S: Apply CNOT
      S->>M: Apply S
      M->>M: Measure`,

    class: `classDiagram
      class QuantumCircuit {
        +Qubit q1
        +Qubit q2
        +applyHadamard()
        +applyCNOT()
        +applyPhase()
        +measure()
      }
      class Qubit {
        +String state
        +initialize()
      }
      class Gate {
        +String type
        +apply()
      }
      class Measurement {
        +measure()
        +getResult()
      }
      QuantumCircuit --> Qubit
      QuantumCircuit --> Gate
      QuantumCircuit --> Measurement`,

    state: `stateDiagram-v2
      [*] --> QubitInit
      QubitInit --> Hadamard
      Hadamard --> CNOT
      CNOT --> Phase
      Phase --> Measurement
      Measurement --> [*]
      
      state QubitInit {
        [*] --> |0>
        |0> --> |1>
      }
      
      state Hadamard {
        [*] --> H1
        H1 --> H2
      }
      
      state CNOT {
        [*] --> Control
        Control --> Target
      }`,

    er: `erDiagram
      QUANTUM_CIRCUIT ||--o{ QUBIT : contains
      QUANTUM_CIRCUIT ||--o{ GATE : contains
      QUANTUM_CIRCUIT ||--o{ MEASUREMENT : contains
      
      QUANTUM_CIRCUIT {
        string name
        int num_qubits
      }
      QUBIT {
        string state
        int position
      }
      GATE {
        string type
        int position
      }
      MEASUREMENT {
        string result
        int position
      }`,

    pie: `pie title Quantum Circuit Components
      "Qubits" : 2
      "Hadamard Gates" : 2
      "CNOT Gates" : 1
      "Phase Gates" : 2
      "Measurements" : 2`,

    gantt: `gantt
      title Quantum Circuit Timeline
      dateFormat  X
      axisFormat %s
      
      section Qubit 1
      Initialization    :0, 1
      Hadamard Gate     :1, 2
      CNOT Gate        :2, 3
      Phase Gate       :3, 4
      Measurement      :4, 5
      
      section Qubit 2
      Initialization    :0, 1
      Hadamard Gate     :1, 2
      CNOT Gate        :2, 3
      Phase Gate       :3, 4
      Measurement      :4, 5`,

    mindmap: `mindmap
      root((Quantum Circuit))
        (Qubits)
          [|0> State]
          [Initialization]
        (Gates)
          [Hadamard]
          [CNOT]
          [Phase]
        (Operations)
          [Apply H]
          [Apply CNOT]
          [Apply S]
        (Measurement)
          [Read Result]
          [Store Output]`,

    journey: `journey
      title Quantum Circuit Execution
      section Initialization
        Initialize Qubits: 5: Q1, Q2
      section Gates
        Apply Hadamard: 4: H1, H2
        Apply CNOT: 3: CNOT
        Apply Phase: 2: S1, S2
      section Final
        Measure Results: 1: M1, M2`,

    gitGraph: `gitGraph
      commit id: "init"
      branch qubit1
      commit id: "H1"
      commit id: "CNOT"
      commit id: "S1"
      commit id: "M1"
      checkout main
      branch qubit2
      commit id: "H2"
      commit id: "CNOT"
      commit id: "S2"
      commit id: "M2"
      checkout main
      merge qubit1
      merge qubit2`
  };

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  const handleDiagramTypeChange = (type) => {
    setDiagramType(type);
    setDiagramCode(diagramTypes[type]);
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
          <div className="w-[100%] p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Preview</h2>
              <div className="flex gap-2">
                <select 
                  onChange={(e) => handleDiagramTypeChange(e.target.value)}
                  className="px-3 py-1 border rounded"
                >
                  <option value="flowchart">Flowchart</option>
                  <option value="sequence">Sequence</option>
                  <option value="class">Class</option>
                  <option value="state">State</option>
                  <option value="er">Entity Relationship</option>
                  <option value="pie">Pie Chart</option>
                  <option value="gantt">Gantt Chart</option>
                  <option value="mindmap">Mind Map</option>
                  <option value="journey">Journey</option>
                  <option value="gitGraph">Git Graph</option>
                </select>
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