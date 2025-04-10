"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import ControllerNav from "../Navigation";
import UploadArea from "../Upload";
import * as ort from 'onnxruntime-web';

import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Configure worker
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

// Configure ONNX Runtime
ort.env.wasm.numThreads = 1;
ort.env.wasm.simd = true;

const LeftPanel = ({
  onFileUpload,
  onTextChange,
  textContent,
  currentFile,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  currentPage,
  totalPages,
  userRole,
  onSavePDF,
  onNewPDF,
  onUpgrade,
  children,
  isEditing,
  onEdit,
}) => {
  const [isManualInputVisible, setIsManualInputVisible] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [session, setSession] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelError, setModelError] = useState(null);
  const editorRef = useRef(null);
  const maxChars = 500;
  const isPremium = userRole === "premium";

  useEffect(() => {
    const loadModel = async () => {
      if (session) {
        console.log('Model already loaded');
        return;
      }

      setIsModelLoading(true);
      setModelError(null);
      
      try {
        console.log('Starting model load...');
        
        // First, check if WASM is available
        if (!ort.env.wasm) {
          throw new Error('WASM not available');
        }
        
        // For now, we'll use a simple rule-based approach
        // until we can properly set up the ONNX model
        console.log('Using simple text simplification rules');
        setSession({
          run: async (feeds) => {
            const input = feeds.input.data[0];
            // Simple text simplification rules
            const simplified = input
              .toLowerCase()
              .replace(/\s+/g, ' ')
              .replace(/[^\w\s]/g, '')
              .trim();
            return { output: { data: [simplified] } };
          }
        });
        
        toast.success('Text simplification ready');
      } catch (error) {
        console.error('Error setting up text simplification:', error);
        setModelError(error.message);
        toast.error(`Failed to set up text simplification: ${error.message}`);
      } finally {
        setIsModelLoading(false);
      }
    };

    loadModel();
  }, [session]);

  const simplifyText = async (text) => {
    if (!session) {
      console.warn('Model not loaded yet');
      if (modelError) {
        console.error('Model error:', modelError);
      }
      return text;
    }

    try {
      console.log('Simplifying text:', text);
      
      // Prepare input tensor
      const inputTensor = new ort.Tensor('string', [text], [1]);
      console.log('Input tensor created:', inputTensor);
      
      // Run inference
      const feeds = { input: inputTensor };
      console.log('Running inference with feeds:', feeds);
      
      const results = await session.run(feeds);
      console.log('Inference results:', results);
      
      // Get the output
      const output = results.output.data[0];
      console.log('Simplified text:', output);
      
      return output;
    } catch (error) {
      console.error('Error simplifying text:', error);
      toast.error('Error simplifying text');
      return text;
    }
  };

  // Handle text content from PDF with proper formatting
  const handlePdfTextContent = async (text) => {
    if (!text) return;

    try {
      // Store the raw text with line breaks preserved
      setPdfText(text);

      // If we're in editing mode, update the editor content
      if (isEditing && editorRef.current?.getQuill()) {
        const quill = editorRef.current.getQuill();

        // Convert the text to HTML with proper paragraphs
        const htmlContent = text
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => `<p>${line.trim()}</p>`)
          .join("");

        // Insert the formatted content into the editor
        quill.setText(""); // Clear existing content
        quill.clipboard.dangerouslyPasteHTML(0, htmlContent);

        // Update the editor content state
        setEditorContent(quill.root.innerHTML);
      }
    } catch (error) {
      console.error("Error processing PDF text:", error);
      toast.error("Error processing PDF text");
    }
  };

  const handleFileUpload = (type) => async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(type);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;

      let simplifiedText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map((item) => item.str).join(" ");

        // Simplify the text using the local model
        const simplified = await simplifyText(text);
        simplifiedText += simplified + "\n\n";
        // console.log(simplified);
      }

      const fileUrl = URL.createObjectURL(file);
      await onFileUpload({
        url: fileUrl,
        name: file.name,
        type: type,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploadingFile(null);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {isModelLoading && (
        <div className="fixed top-0 left-0 w-full p-4 bg-blue-100 text-blue-800">
          Loading text simplification model...
        </div>
      )}
      {modelError && (
        <div className="fixed top-0 left-0 w-full p-4 bg-red-100 text-red-800">
          Model Error: {modelError}
        </div>
      )}
      {!isEditing && (
        <div className="flex-none">
          <UploadArea
            handleFileUpload={handleFileUpload}
            uploadingFile={uploadingFile}
            isPremium={isPremium}
          />
        </div>
      )}

      {currentFile && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="sticky top-0 z-50 bg-white shadow-md">
            <ControllerNav
              fileType={currentFile?.type}
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevPage={onPrevPage}
              onNextPage={onNextPage}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onEdit={onEdit}
              isEditing={isEditing}
              // handleClick={handleClick}
            />
          </div>

          {/* PDF Viewer Container */}
          <div className="flex-1 overflow-y-auto relative">
            <div className="absolute inset-0 p-4">
              <div className="bg-white rounded-lg border border-gray-200 h-full">
                {React.cloneElement(children, {
                  onTextContentChange: handlePdfTextContent,
                  // onTextSelect: handleTextSelection,
                  isEditing: isEditing,
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {!currentFile && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Upload a PDF to simplify and understand it better.
        </div>
      )}
    </div>
  );
};

export default LeftPanel;
