"use client";

import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import ControllerNav from "../Navigation";
import UploadArea from "../Upload";

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
}) => {
  const [isManualInputVisible, setIsManualInputVisible] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [pdfText, setPdfText] = useState("");
  const editorRef = useRef(null);
  const maxChars = 500;
  const isPremium = userRole === "premium";

  // Handle text content from PDF with proper formatting
  const handlePdfTextContent = (text) => {
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

  const handleTextSelection = (text) => {
    if (isEditing) {
      setSelectedText(text);
      // Get the current Quill instance
      const quill = editorRef.current?.getQuill();
      if (quill) {
        // Insert the selected text at the current cursor position
        const range = quill.getSelection();
        if (range) {
          quill.insertText(range.index, text);
        } else {
          quill.insertText(quill.getLength(), text);
        }
      }
    }
  };

  const handleSavePDF = async () => {
    const quill = editorRef.current?.getQuill();
    if (!quill) {
      toast.error("Editor not initialized");
      return;
    }

    try {
      toast.loading("Generating PDF...");

      // Get the HTML content from Quill
      const htmlContent = quill.root.innerHTML;

      // Call the API endpoint
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ htmlContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      // Get the PDF blob from the response
      const pdfBlob = await response.blob();

      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = currentFile
        ? `edited_${currentFile.name}`
        : "new_document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Update the view mode content
      onTextChange(htmlContent);
      setEditorContent(htmlContent);
      setIsEditing(false);

      // Notify parent component
      await onSavePDF();

      toast.dismiss();
      toast.success("PDF saved successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to generate PDF. Please try again.");
    }
  };

  const handleNewPDF = () => {
    setEditorContent("");
    setIsEditing(true);
    onNewPDF();
  };

  const handleEditPDF = () => {
    setIsEditing(true);
    const quill = editorRef.current?.getQuill();
    if (quill && pdfText) {
      // Convert the stored text to HTML with proper paragraphs
      const htmlContent = pdfText
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => `<p>${line.trim()}</p>`)
        .join("");

      // Set the content in the editor
      quill.setText(""); // Clear existing content
      quill.clipboard.dangerouslyPasteHTML(0, htmlContent);
      setEditorContent(quill.root.innerHTML);
    }
  };

  const handlePrevPage = () => {
    // Previous page logic
  };

  const handleNextPage = () => {
    // Next page logic
  };

  const handleZoomIn = () => {
    // Zoom in logic
  };

  const handleZoomOut = () => {
    // Zoom out logic
  };

  const handleEdit = () => {
    // Edit logic
  };

  const handleSave = () => {
    // Save logic
  };

  const handleNew = () => {
    // New document logic
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-none">
        <UploadArea
          handleFileUpload={handleFileUpload}
          uploadingFile={uploadingFile}
          isPremium={isPremium}
        />
      </div>

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
              onEdit={handleEditPDF}
            />
          </div>

          {/* PDF Viewer Container */}
          <div className="flex-1 overflow-y-auto relative">
            <div className="absolute inset-0 p-4">
              <div className="bg-white rounded-lg border border-gray-200 h-full">
                {React.cloneElement(children, {
                  onTextContentChange: handlePdfTextContent,
                  onTextSelect: handleTextSelection,
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
