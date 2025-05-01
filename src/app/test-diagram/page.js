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

export default function TestDiagram() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  useEffect(() => {
    if (excalidrawAPI) {
      const now = Date.now();
      const rand = () => Math.floor(Math.random() * 100000);

      const createShape = ({ type, x, y, width, height, backgroundColor }) => ({
        id: crypto.randomUUID(),
        type,
        x,
        y,
        width,
        height,
        angle: 0,
        strokeColor: "#000000",
        backgroundColor,
        fillStyle: "solid",
        strokeWidth: 1,
        roughness: 1,
        opacity: 100,
        groupIds: [],
        roundness: null,
        seed: rand(),
        version: 1,
        versionNonce: rand(),
        isDeleted: false,
        boundElements: [],
        updated: now,
        link: null,
        locked: false,
      });

      const createText = ({ x, y, text }) => {
        const fontSize = 20;
        const lineHeight = 1.2;
        const lines = text.split("\n");
        const width = Math.max(...lines.map(line => line.length)) * (fontSize * 0.6);
        const height = fontSize * lineHeight * lines.length;

        return {
          id: crypto.randomUUID(),
          type: "text",
          x: x - width / 2,
          y: y - height / 2,
          width,
          height,
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
          text: text,
        };
      };

      const createArrow = ([x1, y1], [x2, y2]) => ({
        id: crypto.randomUUID(),
        type: "arrow",
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1,
        angle: 0,
        strokeColor: "#000000",
        backgroundColor: "transparent",
        fillStyle: "solid",
        strokeWidth: 1,
        roughness: 1,
        opacity: 100,
        groupIds: [],
        seed: rand(),
        version: 1,
        versionNonce: rand(),
        isDeleted: false,
        boundElements: [],
        updated: now,
        points: [
          [0, 0],
          [x2 - x1, y2 - y1],
        ],
        startArrowhead: null,
        endArrowhead: "arrow",
      });

      const elements = [];

      const addLabeledShape = ({ type, x, y, width, height, backgroundColor, text }) => {
        const shape = createShape({ type, x, y, width, height, backgroundColor });
        const textElement = createText({ 
          x: x + width / 2, 
          y: y + height / 2, 
          text 
        });
        elements.push(shape, textElement);
      };

      addLabeledShape({
        type: "rectangle",
        x: 100,
        y: 50,
        width: 280,
        height: 80,
        backgroundColor: "#e3f2fd",
        text: "Quantum System Complexity\nExponential Hilbert Space Growth",
      });

      addLabeledShape({
        type: "diamond",
        x: 460,
        y: 50,
        width: 260,
        height: 80,
        backgroundColor: "#fce4ec",
        text: "Limited by Noise\n(NISQ Devices)",
      });

      addLabeledShape({
        type: "rectangle",
        x: 100,
        y: 180,
        width: 280,
        height: 80,
        backgroundColor: "#fff3e0",
        text: "Random Circuit Sampling (RCS)\nBeyond-Classical Benchmark",
      });

      addLabeledShape({
        type: "rectangle",
        x: 460,
        y: 180,
        width: 260,
        height: 80,
        backgroundColor: "#e8f5e9",
        text: "Recent RCS Experiments\nSize↑ Fidelity↑",
      });

      addLabeledShape({
        type: "rectangle",
        x: 280,
        y: 310,
        width: 320,
        height: 80,
        backgroundColor: "#ede7f6",
        text: "Quantum-Classical Competition\nOptimized RCS with iSWAP Gates",
      });

      addLabeledShape({
        type: "ellipse",
        x: 180,
        y: 440,
        width: 280,
        height: 80,
        backgroundColor: "#f3e5f5",
        text: "Q: Where does Hilbert space\nexponential power kick in?",
      });

      addLabeledShape({
        type: "ellipse",
        x: 480,
        y: 440,
        width: 280,
        height: 80,
        backgroundColor: "#ffe0b2",
        text: "Q: Can we define a measurable\nboundary to probe this?",
      });

      elements.push(
        createArrow([240, 90], [240, 180]),
        createArrow([590, 90], [590, 180]),
        createArrow([240, 260], [440, 310]),
        createArrow([590, 260], [440, 310]),
        createArrow([440, 390], [320, 440]),
        createArrow([440, 390], [640, 440])
      );

      excalidrawAPI.updateScene({ elements });
    }
  }, [excalidrawAPI]);

  return (
    <div className="relative w-full h-screen">
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
