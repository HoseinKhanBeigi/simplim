import React, { useEffect, useRef, useState } from "react";
import { pdfjs } from "react-pdf";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";


pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PDFEditor() {
  const fileInputRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [textItems, setTextItems] = useState([]);
  const [originalPdfData, setOriginalPdfData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);

  const loadPdf = async (file) => {
    setIsLoading(true);
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const typedArray = new Uint8Array(fileReader.result);
      setOriginalPdfData(typedArray);
      const loadingTask = pdfjsLib.getDocument({ data: typedArray });
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      const page = await pdf.getPage(1);
      const content = await page.getTextContent();
      const items = content.items.map((item) => {
        const transform = item.transform;
        const [x, y] = [transform[4], transform[5]];
        return {
          str: item.str,
          x,
          y,
          fontSize: transform[0],
          style: "",
        };
      });
      setTextItems(items);
      setIsLoading(false);
    };
    fileReader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) loadPdf(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') loadPdf(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500');
  };

  const updateTextItem = (index, newText) => {
    setTextItems((prev) => {
      const updated = [...prev];
      updated[index].str = newText;
      return updated;
    });
  };

  const exportToPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    textItems.forEach((item) => {
      page.drawText(item.str, {
        x: item.x,
        y: item.y,
        size: item.fontSize || 12,
        font: font,
        color: rgb(0, 0, 0),
      });
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "edited.pdf";
    link.click();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="fixed top-0 w-full h-14 bg-white border-b px-4 flex items-center justify-between z-50">
        <div className="text-xl font-semibold text-gray-800">Simplim.dev</div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Hi, User!</span>
          <button className="text-gray-600 hover:text-gray-800">Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full mt-14">
        {/* Left Panel */}
        <div className="w-1/2 p-4 border-r">
          {!pdfDoc && !isManualMode ? (
            <div 
              className="h-96 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-4 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="text-xl font-medium text-gray-600">Upload a PDF to simplify and edit</div>
              <div className="flex gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Upload PDF
                </button>
                <button
                  onClick={() => setIsManualMode(true)}
                  className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Manual Input
                </button>
              </div>
              <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="h-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">Extracting text...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded" title="Bold">
                        <span className="font-bold">B</span>
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded" title="Italic">
                        <span className="italic">I</span>
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded" title="Underline">
                        <span className="underline">U</span>
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded" title="List">
                        <span>•</span>
                      </button>
                    </div>
                    <button
                      onClick={exportToPdf}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Save as PDF
                    </button>
                  </div>
          
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-1/2 p-4">
          <div className="bg-white rounded-lg p-4 h-full border">
            <h2 className="text-lg font-medium text-gray-800 mb-4">AI Clarification</h2>
            <p className="text-gray-600">
              Select text in the editor and click "Clarify" or drag it here to get AI-powered clarification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
