"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "../Header";
import AuthLayout from "../AuthLayout";
import LeftPanel from "../LeftPanel";
import AIInsightsPanel from "../AIInsightsPanel";
import FileViewer from "../FileViewer";
import { Toaster, toast } from "react-hot-toast";
import dynamic from "next/dynamic";

// Dynamically import PlaygroundApp with no SSR
const PlaygroundApp = dynamic(() => import("../lexical/App"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center p-4">
      Loading editor...
    </div>
  ),
});

const AppLayout = () => {
  const [user, setUser] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [currentFile, setCurrentFile] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [pdfInstance, setPdfInstance] = useState(null);
  const [insights, setInsights] = useState([
    { content: "Select text to get insights.", source: null },
  ]);
  const [isResizing, setIsResizing] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage
  const [pdfsEdited, setPdfsEdited] = useState(0);
  const MAX_FREE_PDFS = 5;
  const [isEditing, setIsEditing] = useState(false);

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
    [isResizing]
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

      // Only update if there's actual text selected
      if (text.length > 10) {
        setSelectedText(text);
      }
    };

    document.addEventListener("mouseup", handleTextSelection);
    return () => document.removeEventListener("mouseup", handleTextSelection);
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
    setTextContent("");
    if (pdfInstance) {
      pdfInstance.cleanup();
      pdfInstance.destroy();
    }
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

      // Set new file
      setCurrentFile(fileData);
    } catch (error) {
      toast.error("Error uploading file. Please try again.");
      console.error("File upload error:", error);
    }
  };

  const handleLoadSuccess = ({ numPages }) => {
    setTotalPages(numPages);
  };

  const handleDocumentLoadComplete = (pdf) => {
    if (pdfInstance) {
      pdfInstance.cleanup();
      pdfInstance.destroy();
    }
    setPdfInstance(pdf);
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

  if (!user) {
    return <AuthLayout onLogin={handleLogin} onGuestMode={handleGuestMode} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-right" />
      <Header user={user} onLogout={handleLogout} onUpgrade={handleUpgrade} />

      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Panel */}
        <div
          className="border-r border-gray-200 bg-white overflow-hidden"
          style={{ width: `${leftPanelWidth}%` }}
        >
          {isEditing && (
            <div className="border-b border-gray-200 mb-4">
              <PlaygroundApp />
            </div>
          )}
          <LeftPanel
            currentFile={currentFile}
            onFileUpload={handleFileUpload}
            onTextChange={setTextContent}
            textContent={textContent}
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            isEditing={isEditing}
            onEdit={handleEdit}
            userRole={user.role}
            onSavePDF={handleSavePDF}
            onNewPDF={handleNewPDF}
            onUpgrade={handleUpgrade}
          >
            <div className="flex flex-col flex-1">
              <FileViewer
                file={currentFile}
                currentPage={currentPage}
                scale={scale}
                onLoadSuccess={handleLoadSuccess}
                onLoadComplete={handleDocumentLoadComplete}
              />
            </div>
          </LeftPanel>
        </div>

        {/* Resizer */}
        <div
          className={`w-1 cursor-col-resize bg-transparent hover:bg-blue-500 active:bg-blue-600 transition-colors
            ${isResizing ? "bg-blue-600" : ""}`}
          onMouseDown={handleMouseDown}
        />

        {/* Right Panel */}
        <div
          className="bg-white overflow-hidden"
          style={{ width: `${100 - leftPanelWidth}%` }}
        >
          <AIInsightsPanel
            selectedText={selectedText}
            insights={insights}
            isGuest={user.isGuest}
            userRole={user.role}
            clarificationsUsed={user.clarificationsUsed}
            clarificationsLimit={user.clarificationsLimit}
            onClarify={handleClarification}
            onUpgrade={handleUpgrade}
          />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;