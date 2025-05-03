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

// Test diagram data
const testDiagram = {
  
  
  
    "shapes": [
      {
        "type": "ellipse",
        "x": 100,
        "y": 40,
        "width": 240,
        "height": 80,
        "backgroundColor": "#e0f7fa",
        "text": "Input Question q",
        "strokeColor": "#000000",
        "strokeWidth": 1,
        "opacity": 100,
        "angle": 0
      },
      {
        "type": "rectangle",
        "x": 100,
        "y": 160,
        "width": 280,
        "height": 80,
        "backgroundColor": "#fff9c4",
        "text": "Old Policy π_old → Sample Group Outputs {o₁..o_G}",
        "strokeColor": "#000000",
        "strokeWidth": 1,
        "opacity": 100,
        "angle": 0
      },
      {
        "type": "rectangle",
        "x": 100,
        "y": 280,
        "width": 280,
        "height": 80,
        "backgroundColor": "#f8bbd0",
        "text": "Compute Rewards r₁..r_G",
        "strokeColor": "#000000",
        "strokeWidth": 1,
        "opacity": 100,
        "angle": 0
      },
      {
        "type": "rectangle",
        "x": 100,
        "y": 400,
        "width": 320,
        "height": 80,
        "backgroundColor": "#dcedc8",
        "text": "Compute Advantage Aᵢ = (rᵢ - mean) / std",
        "strokeColor": "#000000",
        "strokeWidth": 1,
        "opacity": 100,
        "angle": 0
      },
      {
        "type": "rectangle",
        "x": 480,
        "y": 160,
        "width": 280,
        "height": 80,
        "backgroundColor": "#e3f2fd",
        "text": "New Policy π_θ(oᵢ | q)",
        "strokeColor": "#000000",
        "strokeWidth": 1,
        "opacity": 100,
        "angle": 0
      },
      {
        "type": "rectangle",
        "x": 480,
        "y": 280,
        "width": 280,
        "height": 80,
        "backgroundColor": "#ede7f6",
        "text": "Clipped Objective: min(ratio * Aᵢ, clip(ratio, 1±ε) * Aᵢ)",
        "strokeColor": "#000000",
        "strokeWidth": 1,
        "opacity": 100,
        "angle": 0
      },
      {
        "type": "rectangle",
        "x": 480,
        "y": 400,
        "width": 280,
        "height": 80,
        "backgroundColor": "#f3e5f5",
        "text": "Penalty: β * KL(π_θ || π_ref)",
        "strokeColor": "#000000",
        "strokeWidth": 1,
        "opacity": 100,
        "angle": 0
      },
      {
        "type": "diamond",
        "x": 300,
        "y": 520,
        "width": 300,
        "height": 80,
        "backgroundColor": "#ffe0b2",
        "text": "GRPO Objective J_GRPO(θ)\n= Expected Score - β * KL",
        "strokeColor": "#000000",
        "strokeWidth": 1,
        "opacity": 100,
        "angle": 0
      }
    ],
    "connections": [
      {
        "type": "arrow",
        "style": "elbow",
        "start": [220, 80],
        "end": [240, 160],
        "strokeColor": "#000000",
        "strokeWidth": 2,
        "startArrowhead": "triangle",
        "endArrowhead": "triangle",
        "controlPoints": []
      },
      {
        "type": "arrow",
        "style": "elbow",
        "start": [240, 240],
        "end": [240, 280],
        "strokeColor": "#000000",
        "strokeWidth": 2,
        "startArrowhead": "triangle",
        "endArrowhead": "triangle",
        "controlPoints": []
      },
      {
        "type": "arrow",
        "style": "elbow",
        "start": [240, 360],
        "end": [260, 400],
        "strokeColor": "#000000",
        "strokeWidth": 2,
        "startArrowhead": "triangle",
        "endArrowhead": "triangle",
        "controlPoints": []
      },
      {
        "type": "arrow",
        "style": "sharp",
        "start": [620, 240],
        "end": [620, 280],
        "strokeColor": "#000000",
        "strokeWidth": 2,
        "startArrowhead": "triangle",
        "endArrowhead": "triangle",
        "controlPoints": []
      },
      {
        "type": "arrow",
        "style": "elbow",
        "start": [620, 360],
        "end": [620, 400],
        "strokeColor": "#000000",
        "strokeWidth": 2,
        "startArrowhead": "triangle",
        "endArrowhead": "triangle",
        "controlPoints": []
      },
      {
        "type": "arrow",
        "style": "elbow",
        "start": [260, 480],
        "end": [360, 520],
        "strokeColor": "#000000",
        "strokeWidth": 2,
        "startArrowhead": null,
        "endArrowhead": "triangle",
        "controlPoints": []
      },
      {
        "type": "arrow",
        "style": "elbow",
        "start": [620, 480],
        "end": [540, 520],
        "strokeColor": "#000000",
        "strokeWidth": 2,
        "startArrowhead": null,
        "endArrowhead": "triangle",
        "controlPoints": []
      }
    ]
  
  
  
  
  
  
  
};

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
    x, 
    y, 
    width, 
    height, 
    backgroundColor = "transparent", 
    text, 
    strokeColor = "#000000",
    strokeWidth = 1,
    opacity = 100,
    angle = 0
  }) => {
    const now = Date.now();
    const rand = () => Math.floor(Math.random() * 100000);
    
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
      strokeWidth,
      roughness: 1,
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
    };

    if (text) {
      const fontSize = 20;
      const lineHeight = 1.2;
      const lines = text.split("\n");
      const textWidth = Math.max(...lines.map(line => line.length)) * (fontSize * 0.6);
      const textHeight = fontSize * lineHeight * lines.length;

      const textElement = {
        id: crypto.randomUUID(),
        type: "text",
        x: x + width/2 - textWidth/2,
        y: y + height/2 - textHeight/2,
        width: textWidth,
        height: textHeight,
        angle: 0,
        strokeColor: "#000000",
        backgroundColor: "transparent",
        fillStyle: "solid",
        strokeWidth: 1,
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
        fontSize,
        fontFamily: 1,
        textAlign: "center",
        verticalAlign: "middle",
        baseline: fontSize,
        text,
        raw: text,
        originalText: text,
        lineHeight: lineHeight,
      };

      return [shape, textElement];
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
    controlPoints = []
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
    } else if (style === "curved" && controlPoints.length > 0) {
      points = [
        [0, 0],
        ...controlPoints.map(([x, y]) => [x - start[0], y - start[1]]),
        [end[0] - start[0], end[1] - start[1]]
      ];
    } else {
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
      strokeWidth,
      roughness: 1,
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
    // Check if excalidrawAPI is available
    if (!excalidrawAPI) {
      setError("Excalidraw is not ready yet. Please wait.");
      return;
    }

    const elements = [];
    
    // Process shapes from test diagram
    testDiagram.shapes.forEach(shape => {
      elements.push(...createShape(shape));
    });

    // Process connections from test diagram
    testDiagram.connections.forEach(connection => {
      elements.push(createConnection(connection));
    });

    // Update the scene
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