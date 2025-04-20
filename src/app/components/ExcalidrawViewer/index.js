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

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-white">
      <div className="w-full h-full">
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
  );
};

export default ExcalidrawViewer;