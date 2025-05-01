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

      const createLine = (points, strokeColor = "#ff0000") => ({
        id: crypto.randomUUID(),
        type: "line",
        x: points[0][0],
        y: points[0][1],
        width: points[points.length - 1][0] - points[0][0],
        height: points[points.length - 1][1] - points[0][1],
        angle: 0,
        strokeColor,
        backgroundColor: "transparent",
        fillStyle: "solid",
        strokeWidth: 1,
        roughness: 0,
        opacity: 100,
        groupIds: [],
        seed: Math.floor(Math.random() * 100000),
        version: 1,
        versionNonce: Math.floor(Math.random() * 100000),
        isDeleted: false,
        boundElements: [],
        updated: Date.now(),
        points: points.map(([x, y], i) => {
          const x0 = points[0][0], y0 = points[0][1];
          return [x - x0, y - y0];
        }),
        startArrowhead: null,
        endArrowhead: null,
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

      // Create a simple house shape
      const houseBase = [
        [300, 500],
        [500, 500],
        [500, 400],
        [300, 400],
        [300, 500]
      ];

      const houseRoof = [
        [300, 400],
        [400, 300],
        [500, 400]
      ];

      const houseDoor = [
        [380, 500],
        [420, 500],
        [420, 450],
        [380, 450],
        [380, 500]
      ];

      const houseWindow = [
        [320, 450],
        [360, 450],
        [360, 420],
        [320, 420],
        [320, 450]
      ];

      elements.push(
        createLine(houseBase, "#000000"),
        createLine(houseRoof, "#000000"),
        createLine(houseDoor, "#000000"),
        createLine(houseWindow, "#000000")
      );

      const starPoints = [
        [400, 300], // top
        [450, 400], // right
        [350, 400], // left
        [500, 450], // bottom right
        [300, 450], // bottom left
        [400, 300]  // back to top
      ];

      const carBody = [
        [200, 400],
        [600, 400],
        [600, 350],
        [200, 350],
        [200, 400]
      ];

      const carRoof = [
        [250, 350],
        [550, 350],
        [550, 300],
        [250, 300],
        [250, 350]
      ];

      elements.push(
        createLine(carBody, "#000000"),
        createLine(carRoof, "#000000")
      );

      const treeTrunk = [
        [400, 500],
        [420, 500],
        [420, 400],
        [400, 400],
        [400, 500]
      ];

      const treeLeaves = [
        [350, 400],
        [470, 400],
        [410, 300],
        [350, 400]
      ];

      elements.push(
        createLine(treeTrunk, "#000000"),
        createLine(treeLeaves, "#000000")
      );

      // Create curved shapes
      const heartCurve = [];
      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const x = 400 + 16 * Math.pow(Math.sin(t * Math.PI), 3);
        const y = 300 - (13 * Math.cos(t * Math.PI) - 5 * Math.cos(2 * t * Math.PI) - 2 * Math.cos(3 * t * Math.PI) - Math.cos(4 * t * Math.PI));
        heartCurve.push([x, y]);
      }

      const waveCurve = [];
      for (let i = 0; i <= 100; i++) {
        const x = 100 + i * 7;
        const y = 500 + Math.sin(i * 0.2) * 30;
        waveCurve.push([x, y]);
      }

      const spiralCurve = [];
      for (let i = 0; i <= 200; i++) {
        const t = i / 20;
        const x = 600 + t * Math.cos(t);
        const y = 300 + t * Math.sin(t);
        spiralCurve.push([x, y]);
      }

      elements.push(
        createLine(heartCurve, "#ff0000"),
        createLine(waveCurve, "#0000ff"),
        createLine(spiralCurve, "#00ff00")
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
