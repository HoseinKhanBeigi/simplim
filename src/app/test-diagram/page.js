"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";

const ExcalidrawComponent = dynamic(
  () =>
    import("@excalidraw/excalidraw").then((mod) => {
      const { Excalidraw } = mod;
      return function ExcalidrawWrapper(props) {
        return <Excalidraw {...props} />;
      };
    }),
  { ssr: false }
);

// Domain-specific shape definitions
const DOMAIN_SHAPES = {
  qiskit: {
    "quantum-register": {
      type: "rectangle",
      style: "quantum-register",
      properties: ["qubits"],
      defaultHeight: 40,
      defaultWidth: 150,
      defaultColors: {
        background: "#e3f2fd",
        stroke: "#2196f3"
      }
    },
    "classical-register": {
      type: "rectangle",
      style: "classical-register",
      properties: ["bits"],
      defaultHeight: 40,
      defaultWidth: 150,
      defaultColors: {
        background: "#fff8e1",
        stroke: "#ffb300"
      }
    },
    "quantum-gate": {
      type: "rectangle",
      style: "quantum-gate",
      properties: ["gate", "target", "control"],
      defaultHeight: 40,
      defaultWidth: 60,
      defaultColors: {
        background: "#bbdefb",
        stroke: "#1976d2"
      }
    },
    "measurement": {
      type: "rectangle",
      style: "measurement",
      properties: ["qubit", "classical_bit"],
      defaultHeight: 40,
      defaultWidth: 80,
      defaultColors: {
        background: "#ffe082",
        stroke: "#f57c00"
      }
    }
  }
};

// Test diagram data
const testDiagram = {
 
  
  
    "domain": "qiskit",
    "shapes": [
      {
        "type": "rectangle",
        "style": "quantum-register",
        "x": 50,
        "y": 100,
        "width": 150,
        "height": 40,
        "backgroundColor": "#e3f2fd",
        "text": "QuantumRegister(2)",
        "strokeColor": "#2196f3",
        "strokeWidth": 2,
        "opacity": 100,
        "angle": 0,
        "properties": {
          "qubits": 2
        }
      },
      {
        "type": "rectangle",
        "style": "classical-register",
        "x": 50,
        "y": 160,
        "width": 150,
        "height": 40,
        "backgroundColor": "#fff8e1",
        "text": "ClassicalRegister(2)",
        "strokeColor": "#ffb300",
        "strokeWidth": 2,
        "opacity": 100,
        "angle": 0,
        "properties": {
          "bits": 2
        }
      },
      {
        "type": "rectangle",
        "style": "quantum-gate",
        "x": 250,
        "y": 100,
        "width": 60,
        "height": 40,
        "backgroundColor": "#bbdefb",
        "text": "H",
        "strokeColor": "#1976d2",
        "strokeWidth": 2,
        "opacity": 100,
        "angle": 0,
        "properties": {
          "gate": "Hadamard",
          "target": "q[0]"
        }
      },
      {
        "type": "rectangle",
        "style": "quantum-gate",
        "x": 350,
        "y": 100,
        "width": 60,
        "height": 40,
        "backgroundColor": "#c5e1a5",
        "text": "CX",
        "strokeColor": "#388e3c",
        "strokeWidth": 2,
        "opacity": 100,
        "angle": 0,
        "properties": {
          "gate": "CNOT",
          "control": "q[0]",
          "target": "q[1]"
        }
      },
      {
        "type": "rectangle",
        "style": "measurement",
        "x": 450,
        "y": 100,
        "width": 80,
        "height": 40,
        "backgroundColor": "#ffe082",
        "text": "Measure q[0]",
        "strokeColor": "#f57c00",
        "strokeWidth": 2,
        "opacity": 100,
        "angle": 0,
        "properties": {
          "qubit": "q[0]",
          "classical_bit": "c[0]"
        }
      },
      {
        "type": "rectangle",
        "style": "measurement",
        "x": 450,
        "y": 160,
        "width": 80,
        "height": 40,
        "backgroundColor": "#ffe082",
        "text": "Measure q[1]",
        "strokeColor": "#f57c00",
        "strokeWidth": 2,
        "opacity": 100,
        "angle": 0,
        "properties": {
          "qubit": "q[1]",
          "classical_bit": "c[1]"
        }
      }
    ],
    "connections": [
      {
        "type": "arrow",
        "style": "elbow",
        "start": [200, 120],
        "end": [250, 120],
        "strokeColor": "#9e9e9e",
        "strokeWidth": 2,
        "startArrowhead": null,
        "endArrowhead": "triangle",
        "controlPoints": [],
        "properties": {
          "flow": "initialization"
        }
      },
      {
        "type": "arrow",
        "style": "elbow",
        "start": [310, 120],
        "end": [350, 120],
        "strokeColor": "#9e9e9e",
        "strokeWidth": 2,
        "startArrowhead": null,
        "endArrowhead": "triangle",
        "controlPoints": [],
        "properties": {
          "flow": "from H to CX"
        }
      },
      {
        "type": "arrow",
        "style": "elbow",
        "start": [410, 120],
        "end": [450, 120],
        "strokeColor": "#9e9e9e",
        "strokeWidth": 2,
        "startArrowhead": null,
        "endArrowhead": "triangle",
        "controlPoints": [],
        "properties": {
          "flow": "from CX to Measure q[0]"
        }
      },
      {
        "type": "arrow",
        "style": "elbow",
        "start": [410, 120],
        "end": [450, 180],
        "strokeColor": "#9e9e9e",
        "strokeWidth": 2,
        "startArrowhead": null,
        "endArrowhead": "triangle",
        "controlPoints": [],
        "properties": {
          "flow": "from CX to Measure q[1]"
        }
      }
    ]
  
  
  
  
  
  
  
  
  
  
    
  
  
};

// Properties display component
function PropertiesDisplay({ properties, style }) {
  if (!properties) return null;
  
  return (
    <div className="absolute bg-white p-2 rounded shadow-lg border border-gray-200 text-sm">
      <div className="font-semibold mb-1">{style}</div>
      {Object.entries(properties).map(([key, value]) => (
        <div key={key} className="flex gap-2">
          <span className="text-gray-600">{key}:</span>
          <span className="text-gray-800">{value}</span>
        </div>
      ))}
    </div>
  );
}

export default function TestDiagram() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize the canvas
  useEffect(() => {
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: [],
        appState: {
          currentItemStrokeColor: "#000000",
          currentItemBackgroundColor: "transparent",
          currentItemFillStyle: "solid",
          currentItemStrokeWidth: 2,
          currentItemRoughness: 1,
          currentItemOpacity: 100,
        },
      });
    }
  }, [excalidrawAPI]);

  const createShape = ({ 
    type, 
    style,
    x, 
    y, 
    width, 
    height, 
    backgroundColor = "transparent", 
    text, 
    strokeColor = "#000000",
    strokeWidth = 1,
    opacity = 100,
    angle = 0,
    properties = {}
  }) => {
    const now = Date.now();
    const rand = () => Math.floor(Math.random() * 100000);
    
    // Apply domain-specific styling if available
    const domainStyle = DOMAIN_SHAPES.qiskit?.[style];
    if (domainStyle) {
      backgroundColor = domainStyle.defaultColors?.background || backgroundColor;
      strokeColor = domainStyle.defaultColors?.stroke || strokeColor;
      width = width || domainStyle.defaultWidth;
      height = height || domainStyle.defaultHeight;
    }
    
    const shape = {
      id: crypto.randomUUID(),
      type,
      x,
      y,
      width,
      height,
      angle,
      strokeColor,
      backgroundColor,
      fillStyle: "solid",
      strokeWidth: 1,
      roughness: 0,
      opacity,
      groupIds: [],
      seed: rand(),
      version: 1,
      versionNonce: rand(),
      isDeleted: false,
      boundElements: [],
      updated: now,
      link: null,
      locked: false,
      customData: {
        style,
        properties
      }
    };

    if (text) {
      // Text styling constants
      const mainTextStyle = {
        fontSize: 11, // Smaller font size
        lineHeight: 1.2,
        fontFamily: 'normal', // Normal font
        fontWeight: 400, // Normal weight
        charWidth: 0.6,
        strokeWidth: 0.5,
        color: "#000000"
      };

      const propertiesTextStyle = {
        fontSize: 10, // Even smaller for properties
        lineHeight: 1.2,
        fontFamily: 'normal', // Normal font
        fontWeight: 400, // Normal weight
        charWidth: 0.6,
        strokeWidth: 0.5,
        color: "#666666"
      };

      // Calculate main text dimensions
      const lines = text.split("\n");
      const textWidth = Math.max(...lines.map(line => line.length)) * (mainTextStyle.fontSize * mainTextStyle.charWidth);
      const finalTextWidth = Math.min(textWidth, width * 0.9);
      const textHeight = mainTextStyle.fontSize * mainTextStyle.lineHeight * lines.length;

      const textElement = {
        id: crypto.randomUUID(),
        type: "text",
        x: x + width/2 - finalTextWidth/2,
        y: y + height/2 - textHeight/2,
        width: finalTextWidth,
        height: textHeight,
        angle: 0,
        strokeColor: mainTextStyle.color,
        backgroundColor: "transparent",
        fillStyle: "solid",
        strokeWidth: mainTextStyle.strokeWidth,
        roughness: 0,
        opacity: 100,
        groupIds: [],
        seed: rand(),
        version: 1,
        versionNonce: rand(),
        isDeleted: false,
        boundElements: [],
        updated: now,
        link: null,
        locked: false,
        fontSize: mainTextStyle.fontSize,
        fontFamily: mainTextStyle.fontFamily,
        fontWeight: mainTextStyle.fontWeight,
        textAlign: "center",
        verticalAlign: "middle",
        baseline: mainTextStyle.fontSize,
        text,
        raw: text,
        originalText: text,
        lineHeight: mainTextStyle.lineHeight,
      };

      // Calculate properties text dimensions
      const propertiesText = Object.entries(properties)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      const propertiesWidth = Math.min(
        Math.max(...Object.entries(properties).map(([k, v]) => (k + v).length)) * 
          (propertiesTextStyle.fontSize * propertiesTextStyle.charWidth),
        width * 0.9
      );
      const propertiesHeight = propertiesTextStyle.fontSize * 
        propertiesTextStyle.lineHeight * 
        Object.keys(properties).length;

      const propertiesElement = {
        id: crypto.randomUUID(),
        type: "text",
        x: x + width/2 - propertiesWidth/2,
        y: y + height + 2,
        width: propertiesWidth,
        height: propertiesHeight,
        angle: 0,
        strokeColor: propertiesTextStyle.color,
        backgroundColor: "transparent",
        fillStyle: "solid",
        strokeWidth: propertiesTextStyle.strokeWidth,
        roughness: 0,
        opacity: 80,
        groupIds: [],
        seed: rand(),
        version: 1,
        versionNonce: rand(),
        isDeleted: false,
        boundElements: [],
        updated: now,
        link: null,
        locked: false,
        fontSize: propertiesTextStyle.fontSize,
        fontFamily: propertiesTextStyle.fontFamily,
        fontWeight: propertiesTextStyle.fontWeight,
        textAlign: "center",
        verticalAlign: "top",
        baseline: propertiesTextStyle.fontSize,
        text: propertiesText,
        raw: propertiesText,
        originalText: propertiesText,
        lineHeight: propertiesTextStyle.lineHeight,
      };

      return [shape, textElement, propertiesElement];
    }

    return [shape];
  };

  const createConnection = ({ 
    type = "arrow", 
    style = "sharp",
    start, 
    end, 
    strokeColor = "#000000",
    strokeWidth = 1,
    startArrowhead = null,
    endArrowhead = "triangle",
    controlPoints = [],
    properties = {}
  }) => {
    const now = Date.now();
    const rand = () => Math.floor(Math.random() * 100000);

    let points;
    if (style === "elbow") {
      const midX = start[0];
      const midY = end[1];
      points = [
        [0, 0],
        [midX - start[0], 0],
        [midX - start[0], end[1] - start[1]],
        [end[0] - start[0], end[1] - start[1]]
      ];
    } else {
      // Always use straight lines for non-elbow connections
      points = [
        [0, 0],
        [end[0] - start[0], end[1] - start[1]]
      ];
    }

    return {
      id: crypto.randomUUID(),
      type,
      x: start[0],
      y: start[1],
      width: end[0] - start[0],
      height: end[1] - start[1],
      angle: 0,
      strokeColor,
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 2, // Increased stroke width for better visibility
      roughness: 0, // Set to 0 for clean lines
      opacity: 100,
      groupIds: [],
      seed: rand(),
      version: 1,
      versionNonce: rand(),
      isDeleted: false,
      boundElements: [],
      updated: now,
      points,
      startArrowhead,
      endArrowhead,
      customData: {
        style,
        properties
      }
    };
  };

  const analyzePromptWithGPT = async (prompt) => {
    try {
      const response = await fetch('/api/analyze-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze prompt');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      throw error;
    }
  };

  const generateDiagram = async (prompt) => {
    setIsLoading(true);
    setError(null);

    try {
      // First, analyze the prompt with GPT
      const analysis = await analyzePromptWithGPT(prompt);
      
      // Generate diagram based on GPT's analysis
      const elements = [];
      
      // Process shapes from GPT analysis
      if (analysis.shapes && Array.isArray(analysis.shapes)) {
        analysis.shapes.forEach(shape => {
          elements.push(...createShape(shape));
        });
      }

      // Process connections from GPT analysis
      if (analysis.connections && Array.isArray(analysis.connections)) {
        analysis.connections.forEach(connection => {
          elements.push(createConnection(connection));
        });
      }

      excalidrawAPI.updateScene({ elements });
    } catch (err) {
      setError("Failed to generate diagram. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const testDiagramGeneration = () => {
    const elements = [];
    
    // Process shapes from test diagram
    testDiagram.shapes.forEach(shape => {
      elements.push(...createShape(shape));
    });

    // Process connections from test diagram
    testDiagram.connections.forEach(connection => {
      elements.push(createConnection(connection));
    });

    excalidrawAPI.updateScene({ elements });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      generateDiagram(prompt);
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Prompt Input */}
      <div className="absolute top-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your diagram..."
            className="px-4 py-2 border rounded-lg w-64"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
          <button
            type="button"
            onClick={testDiagramGeneration}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Test Diagram
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Drawing Canvas */}
      <div className="w-full h-full">
        <ExcalidrawComponent
          excalidrawAPI={setExcalidrawAPI}
          theme="light"
          UIOptions={{
            canvasActions: {
              saveToActiveFile: false,
              loadScene: false,
              export: false,
              toggleTheme: false,
            },
          }}
        />
      </div>
    </div>
  );
}