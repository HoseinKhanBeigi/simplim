"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import ControllerNav from "../Navigation";
import UploadArea from "../Upload";
import * as ort from "onnxruntime-web";

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

  const handleFileUpload = (type) => async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(type);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;

      // First, just upload the file with basic info
      const fileUrl = URL.createObjectURL(file);
      await onFileUpload({
        url: fileUrl,
        name: file.name,
        type: type,
        numPages: pdf.numPages,
        currentPage: 1
      });

      // Start processing in the background
      processPDF(pdf, fileUrl, file.name, type);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload file: ${error.message}`);
    } finally {
      setUploadingFile(null);
    }
  };
  function isTitleLine(line, nextLine = '') {
    line = line.trim();
    
    // Pattern 1: Numbered titles (e.g., "1. Introduction" or "1) Overview")
    const numberedPattern = /^\d{1,2}[.)]\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s{2,}/;
    if (numberedPattern.test(line)) return true;
    
    // Pattern 2: ALL CAPS titles with double space
    const allCapsPattern = /^[A-Z\s]{5,}\s{2,}/;
    if (allCapsPattern.test(line)) return true;
    
    // Pattern 3: Short capitalized line followed by lowercase text
    const shortTitlePattern = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/;
    if (shortTitlePattern.test(line) && nextLine && /^[a-z]/.test(nextLine.trim())) {
      return true;
    }
    
    // Pattern 4: Title with colon (e.g., "Introduction:")
    const colonTitlePattern = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s*:/;
    if (colonTitlePattern.test(line)) return true;
    
    // Pattern 5: Section headers with special characters
    const sectionHeaderPattern = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s*[-–—]\s*[A-Z][a-z]+/;
    if (sectionHeaderPattern.test(line)) return true;
    
    // Pattern 6: Title with double space in middle
    const doubleSpacePattern = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s{2,}[A-Z][a-z]+/;
    if (doubleSpacePattern.test(line)) return true;
    
    // Pattern 7: Roman numeral titles (e.g., "I. Introduction")
    const romanNumeralPattern = /^[IVX]+\.\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/;
    if (romanNumeralPattern.test(line)) return true;
    
    return false;
  }

  function detectParagraphSubject(text) {
    const patterns = [
      // Pattern 1: First sentence with key terms
      /^[A-Z][^.!?]+(?:because|therefore|thus|hence|consequently|however|but|although|while|whereas)[^.!?]+[.!?]/,
      
      // Pattern 2: Questions as subjects
      /^[A-Z][^.!?]+\?/,
      
      // Pattern 3: Definitions or explanations
      /^[A-Z][^.!?]+(?:is|are|was|were|means|refers to|defined as)[^.!?]+[.!?]/,
      
      // Pattern 4: Lists or enumerations
      /^[A-Z][^.!?]+(?:first|second|third|finally|additionally|moreover|furthermore)[^.!?]+[.!?]/,
      
      // Pattern 5: Contrast or comparison
      /^[A-Z][^.!?]+(?:compared to|unlike|similar to|in contrast to)[^.!?]+[.!?]/
    ];

    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    
    for (const sentence of sentences) {
      for (const pattern of patterns) {
        if (pattern.test(sentence)) {
          return sentence;
        }
      }
    }
    
    // If no pattern matches, return the first sentence
    return sentences[0] || '';
  }

  function detectTitlesFromText(rawText) {
    const lines = splitToLines(rawText);
    const titles = [];
    const subjects = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1] || '';
      
      if (isTitleLine(line, nextLine)) {
        titles.push({
          type: 'title',
          content: line.trim(),
          position: i
        });
      }
      
      // Detect paragraph subjects
      const subject = detectParagraphSubject(line);
      if (subject && subject.length > 0) {
        subjects.push({
          type: 'subject',
          content: subject,
          position: i
        });
      }
    }

    return {
      titles,
      subjects
    };
  }

  // 💡 Split by period or newline, then trim
  function splitToLines(text) {
    return text
      .replace(/\n/g, ' ')
      .split(/(?<=\.|\?|\!)\s+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }
  
  // 🧪 Process full raw text
  function detectTitlesFromText(rawText) {

    const lines = splitToLines(rawText);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1] || '';

      if (isTitleLine(line, nextLine)) {

        console.log(`[TITLE] ${line}`);
      }
    }
  }
  
  const processPDF = async (pdf, fileUrl, fileName, type) => {
    try {
      const pageSummaries = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const text = content.items.map((item) => item.str).join(" ");

          // Detect titles and subjects
          const { titles, subjects } = detectTitlesFromText(text);
          
          pageSummaries.push({
            page: i,
            titles: titles.map(t => t.content),
            subjects: subjects.map(s => s.content),
            text: text
          });

          toast.success(`Processed page ${i} of ${pdf.numPages}`);
        } catch (pageError) {
          console.error(`Error processing page ${i}:`, pageError);
          continue;
        }
      }

  
      toast.success("PDF processing complete!");
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Error processing PDF");
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
                  // onTextContentChange: handlePdfTextContent,
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
