import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import useStore from "../../store/useStore";

// Configure worker
// if (typeof window !== "undefined") {
//   pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// }

const Header = ({ user, onLogout, onUpgrade, onFileUpload, showAIPanel, onToggleAIPanel }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const { user: storeUser, logout } = useStore();

  // Get the current tab from the pathname
  const getCurrentTab = () => {
    const path = pathname.split('/').pop();
    return path || 'viewer'; // Default to viewer if no path
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  // Update active tab when route changes
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    router.push(`/${tab.toLowerCase()}`);
  };

  // const handleFileChange = async (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   try {
  //     // setUploadingFile(type);
  //     const arrayBuffer = await file.arrayBuffer();
  //     const pdf = await pdfjs.getDocument(arrayBuffer).promise;

  //     // First, just upload the file with basic info
  //     const fileUrl = URL.createObjectURL(file);
  //     await onFileUpload({
  //       url: fileUrl,
  //       name: file.name,
  //       type: 'pdf',
  //       numPages: pdf.numPages,
  //       currentPage: 1
  //     });

  //     // Start processing in the background
  //     // processPDF(pdf, fileUrl, file.name, type);
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     toast.error(`Failed to upload file: ${error.message}`);
  //   } finally {
  //     // setUploadingFile(null);
  //   }
  // };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Logo and Tabs */}
        <h1 className="text-xl font-bold text-gray-900">simplim</h1>

        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "viewer"
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
            onClick={() => handleTabClick("viewer")}
          >
            Viewer
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "doceditor"
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
            onClick={() => handleTabClick("doceditor")}
          >
            Doc Editor
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "easychart"
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
            onClick={() => handleTabClick("easychart")}
          >
            EasyChart
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "flowbuilder"
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
            onClick={() => handleTabClick("flowbuilder")}
          >
            FlowBuilder
          </button>

          {/* <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          /> */}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* AI Panel Toggle Button */}
        <button
          onClick={onToggleAIPanel}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          title={showAIPanel ? "Hide AI Panel" : "Show AI Panel"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            {showAIPanel ? (
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            )}
          </svg>
          {showAIPanel ? "Hide AI" : "Show AI"}
        </button>

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 text-sm focus:outline-none"
          >
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {user?.email?.[0]?.toUpperCase() || "G"}
              </div>
              {user?.role === "premium" && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              )}
            </div>
            <span className="hidden sm:inline-block text-gray-700">
              {user?.email || "Guest"}
            </span>
            {user?.role === "premium" && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                Premium
              </span>
            )}
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${
                isDropdownOpen ? "transform rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu">
                {user?.role === "free" ? (
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                    {`${user.clarificationsUsed}/${user.clarificationsLimit} clarifications used`}
                  </div>
                ) : (
                  <div className="px-4 py-2 text-sm text-yellow-600 border-b border-gray-100">
                    Premium Member
                  </div>
                )}
                <a
                  href="#profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Profile
                </a>
                <a
                  href="#settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Settings
                </a>
                {user?.role === "free" && (
                  <button
                    onClick={() => {/* TODO: Implement upgrade */}}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium"
                    role="menuitem"
                  >
                    Upgrade to Premium
                  </button>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  role="menuitem"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
