import React, { useState, useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { toast } from 'react-hot-toast';

// Import Quill modules and formats
const Font = Quill.import('formats/font');
const List = Quill.import('formats/list');
const Bold = Quill.import('formats/bold');
const Italic = Quill.import('formats/italic');
const Strike = Quill.import('formats/strike');
const Underline = Quill.import('formats/underline');
const Header = Quill.import('formats/header');
const Align = Quill.import('formats/align');

// Add fonts
Font.whitelist = [
  'arial',
  'comic-sans',
  'courier-new',
  'georgia',
  'helvetica',
  'lucida',
  'times-new-roman'
];

// Register formats
Quill.register({
  'formats/font': Font,
  'formats/list': List,
  'formats/bold': Bold,
  'formats/italic': Italic,
  'formats/strike': Strike,
  'formats/underline': Underline,
  'formats/header': Header,
  'formats/align': Align
});

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

const EditorToolbar = ({ onSave, onNew, isPremium, onUpgrade }) => (
  <div className="flex items-center justify-between p-2 bg-white border-b border-gray-200">
    <div className="flex items-center space-x-2">
      <button
        onClick={onNew}
        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
      >
        New PDF
      </button>
      <button
        onClick={onSave}
        className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
      >
        Save as PDF
      </button>
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
);

// Custom QuillEditor component
const QuillEditor = React.forwardRef(({ value, onChange }, ref) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only initialize if not already initialized
    if (editorRef.current && !isInitialized) {
      // Remove any existing toolbars and editors
      const existingToolbars = document.querySelectorAll('.ql-toolbar');
      existingToolbars.forEach(toolbar => toolbar.remove());
      
      const existingEditors = document.querySelectorAll('.ql-editor');
      existingEditors.forEach(editor => editor.remove());

      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'font': Font.whitelist }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': ['', 'center', 'right', 'justify'] }],
            ['clean']
          ],
          clipboard: {
            matchVisual: false
          }
        },
        formats: ['font', 'header', 'bold', 'italic', 'underline', 'strike', 'align', 'list']
      });

      quillRef.current.root.style.height = '500px';
      quillRef.current.root.style.fontSize = '14px';
      quillRef.current.root.style.lineHeight = '1.5';
      
      quillRef.current.on('text-change', () => {
        const content = quillRef.current.root.innerHTML;
        onChange(content);
      });

      // Expose the Quill instance through ref
      if (ref) {
        ref.current = {
          getQuill: () => quillRef.current
        };
      }

      setIsInitialized(true);
    }

    // Cleanup function
    return () => {
      if (quillRef.current) {
        // Clean up Quill instance and remove all toolbars
        const toolbars = document.querySelectorAll('.ql-toolbar');
        toolbars.forEach(toolbar => toolbar.remove());
        
        const editors = document.querySelectorAll('.ql-editor');
        editors.forEach(editor => editor.remove());
        
        quillRef.current = null;
        setIsInitialized(false);
      }
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="quill-editor-container">
      <div ref={editorRef} className="bg-white" />
      <style jsx global>{`
        .quill-editor-container .ql-editor {
          min-height: 500px;
          font-family: 'Arial', sans-serif;
        }
        .quill-editor-container .ql-toolbar {
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }
        .quill-editor-container .ql-container {
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }
        .quill-editor-container .ql-toolbar .ql-stroke {
          stroke: #4b5563;
        }
        .quill-editor-container .ql-toolbar .ql-fill {
          fill: #4b5563;
        }
        .quill-editor-container .ql-toolbar .ql-picker {
          color: #4b5563;
        }
        .quill-editor-container .ql-snow.ql-toolbar button:hover,
        .quill-editor-container .ql-snow .ql-toolbar button:hover {
          color: #2563eb;
        }
        .quill-editor-container .ql-snow.ql-toolbar button:hover .ql-stroke,
        .quill-editor-container .ql-snow .ql-toolbar button:hover .ql-stroke {
          stroke: #2563eb;
        }
        .quill-editor-container .ql-snow.ql-toolbar button:hover .ql-fill,
        .quill-editor-container .ql-snow .ql-toolbar button:hover .ql-fill {
          fill: #2563eb;
        }
      `}</style>
    </div>
  );
});

QuillEditor.displayName = 'QuillEditor';

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
  const editorRef = useRef(null);
  const maxChars = 500;
  const isPremium = userRole === 'premium';

  // Initialize editor content when file is uploaded
  useEffect(() => {
    if (currentFile && textContent) {
      setEditorContent(textContent);
    }
  }, [currentFile, textContent]);

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
    // Set the editor content from textContent when Edit PDF is clicked
    if (textContent) {
      setEditorContent(textContent);
      // If we have a Quill instance, update its content
      const quill = editorRef.current?.getQuill();
      if (quill) {
        quill.root.innerHTML = textContent;
      }
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
            {isEditing && (
              <div className="border-b border-gray-200 bg-white">
                <div className="p-4">
                  <QuillEditor
                    ref={editorRef}
                    value={editorContent}
                    onChange={setEditorContent}
                  />
                </div>
              </div>
            )}

            {/* PDF Viewer */}
            <div className="flex-1">
              <div className="p-4">
                <div 
                  className="bg-white rounded-lg border border-gray-200 overflow-auto" 
                  style={{ height: 'calc(100vh - 300px)' }}
                  onMouseUp={() => {
                    const selectedText = window.getSelection()?.toString();
                    if (selectedText) {
                      handleTextSelection(selectedText);
                    }
                  }}
                >
                  {children}
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