"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import { toast } from "react-hot-toast";
import "@excalidraw/excalidraw/index.css";

// Import Excalidraw and its dependencies only on the client side
const ExcalidrawComponent = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => {
    const { Excalidraw, exportToBlob } = mod;
    return function ExcalidrawWrapper(props) {
      return <Excalidraw {...props} />;
    };
  }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    ),
  }
);

const ExcalidrawViewer = ({ onSave, initialData = null, initialText = '' }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState("light");
  const [isMounted, setIsMounted] = useState(false);
  const [exportFormat, setExportFormat] = useState("png");
  const [isAPIReady, setIsAPIReady] = useState(false);
  const [command, setCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [generatedCommands, setGeneratedCommands] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    console.log("Component mounted");
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (initialText && isAPIReady) {
      // Here you would integrate with your AI agent to generate commands
      // For now, we'll simulate it with some example commands
      const commands = [
        { type: 'rectangle', x: 100, y: 100, width: 200, height: 100 },
        { type: 'ellipse', x: 400, y: 100, width: 150, height: 150 },
        { type: 'diamond', x: 300, y: 300, width: 200, height: 100 }
      ];
      setGeneratedCommands(commands);
    }
  }, [initialText, isAPIReady]);

  const handleExcalidrawAPI = (api) => {
    console.log("Excalidraw API received:", api);
    setExcalidrawAPI(api);
    setIsAPIReady(true);
  };

  const handleAddRectangle = () => {
    console.log("handleAddRectangle called");
    console.log("Current API:", excalidrawAPI);
    if (!excalidrawAPI) {
      console.error("Excalidraw API is not initialized");
      return;
    }

    try {
      // Get the current viewport center
      const appState = excalidrawAPI.getAppState();
      const viewportCenter = {
        x: appState.scrollX + appState.width / 2,
        y: appState.scrollY + appState.height / 2
      };

      // Create a new rectangle element
      const rectangle = {
        type: "rectangle",
        x: viewportCenter.x - 100, // Center the rectangle
        y: viewportCenter.y - 50,
        width: 200,
        height: 100,
        strokeColor: "#000000",
        backgroundColor: "#ffffff",
        fillStyle: "solid",
        strokeWidth: 1,
        roughness: 1,
        opacity: 100,
        angle: 0,
        groupIds: [],
        strokeSharpness: "sharp",
        boundElements: null,
        updated: Date.now(),
        version: 1,
        versionNonce: Math.floor(Math.random() * 1000000),
        isDeleted: false,
        id: `rect-${Date.now()}`,
        seed: Math.floor(Math.random() * 1000000)
      };

      // Get current elements and add the new rectangle
      const elements = excalidrawAPI.getSceneElements();
      excalidrawAPI.updateScene({
        elements: [...elements, rectangle]
      });

      console.log("Rectangle added to canvas");
    } catch (error) {
      console.error("Error adding rectangle:", error);
    }
  };

  const handleAddEllipse = () => {
    console.log("handleAddEllipse called");
    console.log("Current API:", excalidrawAPI);
    if (!excalidrawAPI) {
      console.error("Excalidraw API is not initialized");
      return;
    }

    try {
      // Get the current viewport center
      const appState = excalidrawAPI.getAppState();
      const viewportCenter = {
        x: appState.scrollX + appState.width / 2,
        y: appState.scrollY + appState.height / 2
      };

      // Create a new ellipse element
      const ellipse = {
        type: "ellipse",
        x: viewportCenter.x - 100,
        y: viewportCenter.y - 50,
        width: 200,
        height: 100,
        strokeColor: "#000000",
        backgroundColor: "#ffffff",
        fillStyle: "solid",
        strokeWidth: 1,
        roughness: 1,
        opacity: 100,
        angle: 0,
        groupIds: [],
        strokeSharpness: "sharp",
        boundElements: null,
        updated: Date.now(),
        version: 1,
        versionNonce: Math.floor(Math.random() * 1000000),
        isDeleted: false,
        id: `ellipse-${Date.now()}`,
        seed: Math.floor(Math.random() * 1000000)
      };

      // Get current elements and add the new ellipse
      const elements = excalidrawAPI.getSceneElements();
      excalidrawAPI.updateScene({
        elements: [...elements, ellipse]
      });

      console.log("Ellipse added to canvas");
    } catch (error) {
      console.error("Error adding ellipse:", error);
    }
  };

  const handleAddDiamond = () => {
    console.log("handleAddDiamond called");
    console.log("Current API:", excalidrawAPI);
    if (!excalidrawAPI) {
      console.error("Excalidraw API is not initialized");
      return;
    }

    try {
      // Get the current viewport center
      const appState = excalidrawAPI.getAppState();
      const viewportCenter = {
        x: appState.scrollX + appState.width / 2,
        y: appState.scrollY + appState.height / 2
      };

      // Create a new diamond element
      const diamond = {
        type: "diamond",
        x: viewportCenter.x - 100,
        y: viewportCenter.y - 50,
        width: 200,
        height: 100,
        strokeColor: "#000000",
        backgroundColor: "#ffffff",
        fillStyle: "solid",
        strokeWidth: 1,
        roughness: 1,
        opacity: 100,
        angle: 0,
        groupIds: [],
        strokeSharpness: "sharp",
        boundElements: null,
        updated: Date.now(),
        version: 1,
        versionNonce: Math.floor(Math.random() * 1000000),
        isDeleted: false,
        id: `diamond-${Date.now()}`,
        seed: Math.floor(Math.random() * 1000000)
      };

      // Get current elements and add the new diamond
      const elements = excalidrawAPI.getSceneElements();
      excalidrawAPI.updateScene({
        elements: [...elements, diamond]
      });

      console.log("Diamond added to canvas");
    } catch (error) {
      console.error("Error adding diamond:", error);
    }
  };

  const handleSave = async () => {
    if (!excalidrawAPI) return;

    try {
      setIsSaving(true);
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      
      // Dynamically import exportToBlob when needed
      const { exportToBlob } = await import("@excalidraw/excalidraw");
      
      // Determine mime type based on selected format
      const mimeTypes = {
        png: "image/png",
        svg: "image/svg+xml",
        jpeg: "image/jpeg"
      };

      // Export to blob
      const blob = await exportToBlob({
        elements,
        appState,
        files: null,
        mimeType: mimeTypes[exportFormat],
      });

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        if (onSave) {
          onSave({
            elements,
            appState,
            image: base64data,
            format: exportFormat
          });
        }
        toast.success(`Drawing saved as ${exportFormat.toUpperCase()}!`);
      };
    } catch (error) {
      console.error("Error saving drawing:", error);
      toast.error("Failed to save drawing");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCommand = (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    const cmd = command.toLowerCase().trim();
    setCommandHistory(prev => [...prev, cmd]);
    
    try {
      if (cmd.startsWith("rect")) {
        handleAddRectangle();
      } else if (cmd.startsWith("ellipse")) {
        handleAddEllipse();
      } else if (cmd.startsWith("diamond")) {
        handleAddDiamond();
      } else if (cmd.startsWith("clear")) {
        // Clear the canvas
        excalidrawAPI.updateScene({
          elements: []
        });
      } else if (cmd.startsWith("help")) {
        // Show available commands
        toast.success("Available commands: rect, ellipse, diamond, clear, help");
      } else {
        toast.error("Unknown command. Type 'help' for available commands.");
      }
    } catch (error) {
      console.error("Error executing command:", error);
      toast.error("Error executing command");
    }

    setCommand("");
  };

  const handleApplyCommand = (command) => {
    if (!excalidrawAPI) {
      console.error("Excalidraw API is not initialized");
      return;
    }

    try {
      const appState = excalidrawAPI.getAppState();
      const viewportCenter = {
        x: appState.scrollX + appState.width / 2,
        y: appState.scrollY + appState.height / 2
      };

      const element = {
        type: command.type,
        x: command.x || viewportCenter.x - command.width / 2,
        y: command.y || viewportCenter.y - command.height / 2,
        width: command.width,
        height: command.height,
        strokeColor: "#000000",
        backgroundColor: "#ffffff",
        fillStyle: "solid",
        strokeWidth: 1,
        roughness: 1,
        opacity: 100,
        angle: 0,
        groupIds: [],
        strokeSharpness: "sharp",
        boundElements: null,
        updated: Date.now(),
        version: 1,
        versionNonce: Math.floor(Math.random() * 1000000),
        isDeleted: false,
        id: `${command.type}-${Date.now()}`,
        seed: Math.floor(Math.random() * 1000000)
      };

      const elements = excalidrawAPI.getSceneElements();
      excalidrawAPI.updateScene({
        elements: [...elements, element]
      });
    } catch (error) {
      console.error("Error applying command:", error);
      toast.error("Failed to apply command");
    }
  };

  const handleGenerateFromText = () => {
    // This will be implemented to get selected text from the editor
    // and generate commands based on it
    toast.info("This feature will be implemented soon!");
  };

  const handleGenerateFromPrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate diagram');
      }

      const data = await response.json();
      const aiResponse = {
        commands: data.commands
      };

      setGeneratedCommands(aiResponse.commands);
      toast.success('Diagram commands generated successfully!');
    } catch (error) {
      console.error('Error generating commands:', error);
      toast.error('Failed to generate diagram commands');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyGeneratedCommands = () => {
    if (!excalidrawAPI || generatedCommands.length === 0) return;

    try {
      const elements = excalidrawAPI.getSceneElements();
      const newElements = [...elements];

      generatedCommands.forEach(cmd => {
        const element = {
          type: cmd.type,
          x: cmd.x,
          y: cmd.y,
          width: cmd.width,
          height: cmd.height,
          strokeColor: cmd.strokeColor || '#000000',
          backgroundColor: cmd.backgroundColor || '#ffffff',
          fillStyle: cmd.fillStyle || 'solid',
          strokeWidth: 1,
          roughness: 1,
          opacity: 100,
          angle: 0,
          groupIds: [],
          strokeSharpness: 'sharp',
          boundElements: null,
          updated: Date.now(),
          version: 1,
          versionNonce: Math.floor(Math.random() * 1000000),
          isDeleted: false,
          id: `${cmd.type}-${Date.now()}-${Math.random()}`,
          seed: Math.floor(Math.random() * 1000000)
        };

        // Add text if present
        if (cmd.text) {
          element.text = cmd.text;
        }

        // Handle arrow points if present
        if (cmd.points) {
          element.points = cmd.points;
          element.startArrowhead = cmd.startArrowhead;
          element.endArrowhead = cmd.endArrowhead;
        }

        newElements.push(element);
      });

      excalidrawAPI.updateScene({
        elements: newElements
      });

      toast.success('Diagram applied successfully!');
    } catch (error) {
      console.error('Error applying commands:', error);
      toast.error('Failed to apply diagram');
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-white">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt (e.g., 'Draw a red rectangle and a blue circle')"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleGenerateFromPrompt}
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Commands'}
            </button>
            {generatedCommands.length > 0 && (
              <button
                onClick={handleApplyGeneratedCommands}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Apply Commands
              </button>
            )}
          </div>
        </div>
        <div className="flex-1">
        <ExcalidrawComponent
          excalidrawAPI={handleExcalidrawAPI}
          initialData={initialData}
          theme={theme}
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
    </div>
  );
};

export default ExcalidrawViewer;