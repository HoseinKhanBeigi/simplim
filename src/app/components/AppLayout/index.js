"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "../Header";
import AIInsightsPanel from "../AIInsightsPanel";
import { Toaster, toast } from "react-hot-toast";
import useStore from "../../store/useStore";

const AppLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [selectedTextStack, setSelectedTextStack] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [textContent, setTextContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [pdfInstance, setPdfInstance] = useState(null);
  const [insights, setInsights] = useState([
    { content: "", source: null },
  ]);
  const [isResizing, setIsResizing] = useState(false);
  const [pdfsEdited, setPdfsEdited] = useState(0);
  const [showAIPanel, setShowAIPanel] = useState(true); // Always show AI panel (like Cursor)
  const [isRightResizing, setIsRightResizing] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(35); // Default width for AI panel (more prominent like Cursor)

  const MAX_FREE_PDFS = 5;
  const [isEditing, setIsEditing] = useState(false);

  // Get layout state from global store
  const { leftPanelWidth, setLeftPanelWidth } = useStore();

  // Handle panel resizing
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing) return;
      const windowWidth = window.innerWidth;
      const newWidth = (e.clientX / windowWidth) * 100;
      // Limit the resize between 30% and 70%
      if (newWidth >= 30 && newWidth <= 70) {
        setLeftPanelWidth(newWidth);
      }
    },
    [isResizing, setLeftPanelWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Handle text selection
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      // Check if selection is inside an input, textarea, or AI panel
      const activeElement = document.activeElement;
      const isInputElement = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.closest('.ai-insights-panel') ||
        activeElement.closest('[role="textbox"]')
      );

      // Ignore selections inside input fields or AI panel
      if (isInputElement) {
        return;
      }

      // Check if selection is inside any input/textarea
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      if (range) {
        const container = range.commonAncestorContainer;
        const isInsideInput = container.nodeType === Node.TEXT_NODE 
          ? container.parentElement?.closest('input, textarea, [contenteditable="true"]')
          : container.closest('input, textarea, [contenteditable="true"]');
        
        if (isInsideInput) {
          return;
        }
      }

      // Only update if there's actual text selected and it's from PDF
      if (text.length > 10) {
        // Add to stack instead of replacing
        setSelectedTextStack(prev => {
          // Check if this text is already in the stack
          if (!prev.includes(text)) {
            const newStack = [...prev, text];
            // Update the combined selected text
            setSelectedText(newStack.join('\n\n---\n\n'));
            return newStack;
          }
          return prev;
        });
      }
    };

    // Handle PDF text selection from simplify button
    const handlePDFTextSelected = (event) => {
      const { text, forceAdd } = event.detail;
      if (text) {
        // Check if stack/selectedText is empty (user cleared input)
        setSelectedTextStack(prev => {
          const isStackEmpty = prev.length === 0 || !selectedText || selectedText.trim().length === 0;
          
          if (isStackEmpty) {
            // Start fresh - replace stack with just this new text
            setSelectedText(text);
            return [text];
          }
          
          // If forceAdd is true (from button click), always add to ensure it appears in input
          // Otherwise check if this text is already in the stack
          if (forceAdd) {
            // Always add when button is clicked, even if duplicate
            const newStack = [...prev, text];
            // Update the combined selected text
            setSelectedText(newStack.join('\n\n---\n\n'));
            return newStack;
          } else if (!prev.includes(text)) {
            // Manual selection - only add if not already in stack
            const newStack = [...prev, text];
            setSelectedText(newStack.join('\n\n---\n\n'));
            return newStack;
          }
          return prev;
        });
      }
    };

    // Handle clearing the stack when user manually clears input
    const handleClearStack = () => {
      setSelectedTextStack([]);
      setSelectedText("");
    };

    document.addEventListener("mouseup", handleTextSelection);
    window.addEventListener("pdfTextSelected", handlePDFTextSelected);
    window.addEventListener("clearTextStack", handleClearStack);
    
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      window.removeEventListener("pdfTextSelected", handlePDFTextSelected);
      window.removeEventListener("clearTextStack", handleClearStack);
    };
  }, [currentPage]);

  // Cleanup PDF instance
  useEffect(() => {
    return () => {
      if (pdfInstance) {
        pdfInstance.cleanup();
        pdfInstance.destroy();
      }
    };
  }, [pdfInstance]);

  // Load PDFs from IndexedDB on component mount

  const handleLogin = async ({ email, password }) => {
    try {
      // TODO: Implement actual authentication
      setUser({
        email,
        role: "free", // or 'premium'
        clarificationsUsed: 0,
        clarificationsLimit: 10,
        isGuest: false,
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleGuestMode = () => {
    setUser({
      email: "guest@example.com",
      role: "free",
      clarificationsUsed: 0,
      clarificationsLimit: 3,
      isGuest: true,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentFile(null);
    setSelectedText("");
    setSelectedTextStack([]);
    setTextContent("");
    if (pdfInstance) {
      pdfInstance.cleanup();
      pdfInstance.destroy();
    }
    // Note: We don't clear IndexedDB on logout to persist files between sessions
  };

  const handleFileUpload = async (fileData) => {
    try {
      // Clean up previous file URL if it exists
      if (currentFile?.url) {
        URL.revokeObjectURL(currentFile.url);
      }

      // Clean up previous PDF instance
      if (pdfInstance) {
        pdfInstance.cleanup();
        pdfInstance.destroy();
      }

      // Reset states
      setCurrentPage(1);
      setTotalPages(1);
      setScale(1.2);
      setSelectedText("");
      setSelectedTextStack([]);

      // Set new file
      setCurrentFile(fileData);
    } catch (error) {
      toast.error("Error uploading file. Please try again.");
      console.error("File upload error:", error);
    }
  };

  const handleClarification = async (text) => {
    if (
      user.role === "premium" ||
      user.clarificationsUsed < user.clarificationsLimit
    ) {
      try {
        // TODO: Replace with actual AI clarification API call
        const clarifiedContent = `This is a clarified version of: ${text}`;
        setInsights([{ content: clarifiedContent, source: "AI Analysis" }]);

        if (user.role !== "premium") {
          setUser((prev) => ({
            ...prev,
            clarificationsUsed: prev.clarificationsUsed + 1,
          }));
        }
        return true;
      } catch (error) {
        toast.error("Failed to clarify text. Please try again.");
        return false;
      }
    } else {
      toast.error(
        "Clarification limit reached. Upgrade to Premium for unlimited access!"
      );
      return false;
    }
  };

  const handleSavePDF = async (content) => {
    if (!user.role === "premium" && pdfsEdited >= MAX_FREE_PDFS) {
      toast.error(
        "Free tier limit reached. Upgrade to continue creating PDFs!"
      );
      return;
    }

    try {
      if (user.role !== "premium") {
        setPdfsEdited((prev) => prev + 1);
      }

      toast.success("PDF saved successfully!");
    } catch (error) {
      toast.error("Failed to save PDF. Please try again.");
      console.error("PDF save error:", error);
    }
  };

  const handleNewPDF = () => {
    if (user.role !== "premium" && pdfsEdited >= MAX_FREE_PDFS) {
      toast.error(
        "Free tier limit reached. Upgrade to continue creating PDFs!"
      );
      return;
    }
    setCurrentFile(null);
    setTextContent("");
    setSelectedText("");
    setSelectedTextStack([]);
    if (pdfInstance) {
      pdfInstance.cleanup();
      pdfInstance.destroy();
    }
  };

  const handleUpgrade = async () => {
    try {
      // TODO: Implement payment processing
      setUser((prev) => ({
        ...prev,
        role: "premium",
        clarificationsLimit: Infinity,
      }));
      toast.success(
        "Welcome to Premium! Enjoy unlimited PDF creation and advanced features."
      );
    } catch (error) {
      toast.error("Upgrade failed. Please try again.");
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handle right panel resizing
  const handleRightMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsRightResizing(true);
  }, []);

  const handleRightMouseMove = useCallback(
    (e) => {
      if (!isRightResizing) return;
      const windowWidth = window.innerWidth;
      const newWidth = ((windowWidth - e.clientX) / windowWidth) * 100;
      // Limit the resize between 20% and 50%
      if (newWidth >= 20 && newWidth <= 50) {
        setRightPanelWidth(newWidth);
      }
    },
    [isRightResizing]
  );

  const handleRightMouseUp = useCallback(() => {
    setIsRightResizing(false);
  }, []);

  useEffect(() => {
    if (isRightResizing) {
      window.addEventListener("mousemove", handleRightMouseMove);
      window.addEventListener("mouseup", handleRightMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleRightMouseMove);
      window.removeEventListener("mouseup", handleRightMouseUp);
    };
  }, [isRightResizing, handleRightMouseMove, handleRightMouseUp]);

  // if (!user) {
  //   return <AuthLayout onLogin={handleLogin} onGuestMode={handleGuestMode} />;
  // }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Toaster position="top-right" />
      <Header
        user={user}
        onLogout={handleLogout}
        onUpgrade={handleUpgrade}
        onFileUpload={handleFileUpload}
        showAIPanel={showAIPanel}
        onToggleAIPanel={() => setShowAIPanel(!showAIPanel)}
      />

      <main className="flex-1 flex overflow-hidden">
    

        <div
          className={`w-1 cursor-col-resize bg-transparent hover:bg-blue-500 active:bg-blue-600 transition-colors
            ${isResizing ? "bg-blue-600" : ""}`}
          onMouseDown={handleMouseDown}
        >
        </div>

        <div className="flex-1 flex">
          {/* Main content area */}
          <div className="flex-1 bg-white overflow-hidden">
            {children}
          </div>

          {/* AI Panel - Persistent across all pages (like Cursor IDE) */}
          {showAIPanel && (
            <>
              <div
                className={`w-1 cursor-col-resize bg-transparent hover:bg-blue-500 active:bg-blue-600 transition-colors
                  ${isRightResizing ? "bg-blue-600" : ""}`}
                onMouseDown={handleRightMouseDown}
              >
              </div>
              <div
                className="bg-white overflow-hidden border-l border-gray-200"
                style={{ width: `${rightPanelWidth}%`, minWidth: '300px' }}
              >
                <AIInsightsPanel
                  selectedText={selectedText}
                  insights={insights}
                  onClarify={handleClarification}
                  onUpgrade={handleUpgrade}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
