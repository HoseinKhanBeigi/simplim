"use client";

import React, { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";
import ProtectedRoute from "../components/ProtectedRoute";
import AppLayout from "../components/AppLayout";

export default function TestMermaid() {
  const [diagramType, setDiagramType] = useState("flowchart");
  const [diagramCode, setDiagramCode] = useState(`flowchart TD
    %% Qdrant Database Management System
    subgraph Collections[Qdrant Collections]
        direction TB
        
        %% Collections
        DOC[Documents Collection]
        CONV[Conversations Collection]
        CHUNK[Document Chunks Collection]
        
        %% Collection Properties
        DOC --> |"size: 1536
        distance: COSINE"| DOC_PROPS[Vector Properties]
        CONV --> |"size: 1536
        distance: COSINE"| CONV_PROPS[Vector Properties]
        CHUNK --> |"size: 1536
        distance: COSINE"| CHUNK_PROPS[Vector Properties]
    end

    %% Main Functions
    subgraph Functions[Core Functions]
        direction TB
        
        %% Document Operations
        INIT[Initialize Collections]
        STORE_DOC[Store Document]
        STORE_CHUNK[Store Chunks]
        SEARCH[Search Similar]
        SEARCH_CHUNK[Search Chunks]
        GET_CHUNKS[Get Document Chunks]
        
        %% Conversation Operations
        STORE_CONV[Store Conversation]
        SEARCH_CONV[Search Conversations]
        GET_CONV[Get Conversation]
        UPDATE_CONV[Update Conversation]
    end

    %% Relationships
    INIT --> DOC
    INIT --> CONV
    INIT --> CHUNK
    
    STORE_DOC --> DOC
    STORE_CHUNK --> CHUNK
    SEARCH --> DOC
    SEARCH_CHUNK --> CHUNK
    GET_CHUNKS --> CHUNK
    
    STORE_CONV --> CONV
    SEARCH_CONV --> CONV
    GET_CONV --> CONV
    UPDATE_CONV --> CONV

    %% Styling
    classDef collection fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    classDef function fill:#c8e6c9,stroke:#4caf50,stroke-width:2px
    classDef props fill:#f5f5f5,stroke:#9e9e9e,stroke-width:2px
    
    class DOC,CONV,CHUNK collection
    class INIT,STORE_DOC,STORE_CHUNK,SEARCH,SEARCH_CHUNK,GET_CHUNKS,STORE_CONV,SEARCH_CONV,GET_CONV,UPDATE_CONV function
    class DOC_PROPS,CONV_PROPS,CHUNK_PROPS props`);

  const [svg, setSvg] = useState("");
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
      merge qubit2`,
  };

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
    });
  }, []);

  const handleDiagramTypeChange = (type) => {
    setDiagramType(type);
    setDiagramCode(diagramTypes[type]);
  };

  const renderDiagram = async () => {
    try {
      const { svg } = await mermaid.render("mermaid-diagram", diagramCode);
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
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  const handleDownload = (format) => {
    if (!diagramRef.current) return;

    const svgElement = diagramRef.current.querySelector("svg");
    if (!svgElement) return;

    if (format === "svg") {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "diagram.svg";
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === "png") {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "diagram.png";
        link.click();
      };

      img.src =
        "data:image/svg+xml;base64," +
        btoa(new XMLSerializer().serializeToString(svgElement));
    }
  };

  return (
    <AppLayout>
      <div className="flex h-screen">
        <div className="w-[100%] p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Preview</h2>
            <div className="flex items-center gap-4">
              {/* Diagram Type Selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Diagram Type:
                </label>
                <select
                  onChange={(e) => handleDiagramTypeChange(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2 bg-white/90 p-2 rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  title="Zoom In"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  title="Zoom Out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  title="Reset Zoom"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Export Controls */}
              <div className="flex items-center gap-2 bg-white/90 p-2 rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => handleDownload("svg")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  title="Download SVG"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  SVG
                </button>
                <button
                  onClick={() => handleDownload("png")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors duration-200"
                  title="Download PNG"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  PNG
                </button>
              </div>
            </div>
          </div>
          <div className="border rounded p-4 h-[calc(100vh-8rem)] overflow-auto">
            {error ? (
              <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
            ) : (
              <div
                ref={diagramRef}
                className="mermaid-diagram"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
