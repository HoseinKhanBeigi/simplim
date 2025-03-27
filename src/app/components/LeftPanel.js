'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';

const FileUploadButton = ({ icon, label, accept, onUpload, isDisabled, isLoading, tooltip }) => (
  <label className={`
    relative flex flex-col items-center justify-center
    w-[140px] h-[80px] p-2
    rounded-lg border-2 border-dashed
    transition-all duration-200 ease-in-out
    ${isDisabled 
      ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
      : isLoading
        ? 'border-blue-200 bg-blue-50 cursor-wait'
        : 'border-blue-200 bg-white hover:bg-blue-50 hover:border-blue-300 hover:scale-105 cursor-pointer'
    }
  `}>
    <input
      type="file"
      accept={accept}
      onChange={onUpload}
      disabled={isDisabled || isLoading}
      className="hidden"
    />
    <span className="text-2xl mb-1">{icon}</span>
    <span className={`
      text-sm font-medium text-center
      ${isDisabled ? 'text-gray-400' : 'text-gray-600'}
    `}>
      {isLoading ? 'Uploading...' : label}
    </span>
    {isDisabled && (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-5 rounded-lg">
        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
          {tooltip || 'Upgrade to unlock!'}
        </span>
      </div>
    )}
    {isLoading && (
      <div className="absolute top-1 right-1 h-4 w-4">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      </div>
    )}
  </label>
);

const ControllerNav = ({ fileType, onPrevPage, onNextPage, onZoomIn, onZoomOut, currentPage, totalPages, onEdit }) => (
  <div className="flex items-center space-x-2 p-3 bg-gray-50/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
    {fileType === 'pdf' && (
      <>
        <button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="h-6 w-px bg-gray-300 mx-2"></div>
        <button
          onClick={onZoomOut}
          className="p-2 rounded hover:bg-gray-200"
          title="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={onZoomIn}
          className="p-2 rounded hover:bg-gray-200"
          title="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="h-6 w-px bg-gray-300 mx-2"></div>
        <button
          onClick={onEdit}
          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          title="Edit PDF"
        >
          Edit PDF
        </button>
      </>
    )}
    {fileType === 'excel' && (
      <button className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100">
        Switch Sheet
      </button>
    )}
    {fileType === 'image' && (
      <button className="px-3 py-1 text-sm bg-purple-50 text-purple-600 rounded hover:bg-purple-100">
        OCR Extract
      </button>
    )}
  </div>
);



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
  children
}) => {
  const [isManualInputVisible, setIsManualInputVisible] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [pdfText, setPdfText] = useState('');
  const editorRef = useRef(null);
  const maxChars = 500;
  const isPremium = userRole === 'premium';

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
          .split('\n')
          .filter(line => line.trim())
          .map(line => `<p>${line.trim()}</p>`)
          .join('');

        // Insert the formatted content into the editor
        quill.setText(''); // Clear existing content
        quill.clipboard.dangerouslyPasteHTML(0, htmlContent);
        
        // Update the editor content state
        setEditorContent(quill.root.innerHTML);
      }
    } catch (error) {
      console.error('Error processing PDF text:', error);
      toast.error('Error processing PDF text');
    }
  };

  const handleFileUpload = (type) => async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(type);
    try {
      const fileUrl = URL.createObjectURL(file);
      await onFileUpload({
        url: fileUrl,
        name: file.name,
        type: type
      });
    } catch (error) {
      console.error('Error uploading file:', error);
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
      toast.error('Editor not initialized');
      return;
    }

    try {
      toast.loading('Generating PDF...');
      
      // Get the HTML content from Quill
      const htmlContent = quill.root.innerHTML;

      // Call the API endpoint
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ htmlContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Get the PDF blob from the response
      const pdfBlob = await response.blob();

      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentFile ? `edited_${currentFile.name}` : 'new_document.pdf';
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
      toast.success('PDF saved successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss();
      toast.error(error.message || 'Failed to generate PDF. Please try again.');
    }
  };

  const handleNewPDF = () => {
    setEditorContent('');
    setIsEditing(true);
    onNewPDF();
  };

  const handleEditPDF = () => {
    setIsEditing(true);
    const quill = editorRef.current?.getQuill();
    if (quill && pdfText) {
      // Convert the stored text to HTML with proper paragraphs
      const htmlContent = pdfText
        .split('\n')
        .filter(line => line.trim())
        .map(line => `<p>${line.trim()}</p>`)
        .join('');

      // Set the content in the editor
      quill.setText(''); // Clear existing content
      quill.clipboard.dangerouslyPasteHTML(0, htmlContent);
      setEditorContent(quill.root.innerHTML);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Upload Buttons - Always visible at top */}
      <div className="flex-none bg-gray-50 p-4 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FileUploadButton
            icon="📄"
            label="Upload PDF"
            accept=".pdf"
            onUpload={handleFileUpload('pdf')}
            isLoading={uploadingFile === 'pdf'}
          />
          <FileUploadButton
            icon="📊"
            label="Upload Excel"
            accept=".xlsx,.xls"
            onUpload={handleFileUpload('excel')}
            isLoading={uploadingFile === 'excel'}
            isDisabled={!isPremium}
            tooltip="Premium: Excel support"
          />
          <FileUploadButton
            icon="🖼️"
            label="Upload PNG"
            accept=".png,.jpg,.jpeg"
            onUpload={handleFileUpload('image')}
            isLoading={uploadingFile === 'image'}
            isDisabled={!isPremium}
            tooltip="Premium: Image support"
          />
          <FileUploadButton
            icon="✨"
            label="Upload SVG"
            accept=".svg"
            isDisabled={!isPremium}
            tooltip="Premium: SVG support"
            onUpload={handleFileUpload('svg')}
            isLoading={uploadingFile === 'svg'}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {currentFile ? (
          <div className="flex flex-col">
            {/* Edit Controls - Always visible when PDF is loaded */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleEditPDF}
                    className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Edit PDF
                  </button>
                  <button
                    onClick={handleNewPDF}
                    className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    New PDF
                  </button>
                  {isEditing && (
                    <button
                      onClick={handleSavePDF}
                      className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                    >
                      Save as PDF
                    </button>
                  )}
                </div>
                {!isPremium && (
                  <button
                    onClick={onUpgrade}
                    className="px-3 py-1.5 text-sm bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors"
                  >
                    Upgrade for More Features
                  </button>
                )}
              </div>
              
              {/* PDF Navigation Controls */}
              <div className="px-4 pb-4">
                <ControllerNav
                  fileType={currentFile.type}
                  onPrevPage={onPrevPage}
                  onNextPage={onNextPage}
                  onZoomIn={onZoomIn}
                  onZoomOut={onZoomOut}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onEdit={handleEditPDF}
                />
              </div>
            </div>

            {/* Text Editor Area - Only shown when editing */}
          

            {/* PDF Viewer */}
            <div className="flex-1">
              <div className="p-4">
                <div 
                  className="bg-white rounded-lg border border-gray-200 overflow-auto" 
                  style={{ height: 'calc(100vh - 300px)' }}
                >
                  {React.cloneElement(children, {
                    onTextContentChange: handlePdfTextContent,
                    onTextSelect: handleTextSelection
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center text-gray-500">
              Upload a PDF to start editing
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel; 