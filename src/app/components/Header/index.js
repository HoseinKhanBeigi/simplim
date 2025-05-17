import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import useStore from "../../store/useStore";

// Configure worker
// if (typeof window !== "undefined") {
//   pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// }

const Header = ({ activeTab, onTabChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const { user, logout } = useStore();
 

  const handleFileClick = () => {
    fileInputRef.current?.click();
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
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo and Tabs */}
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold text-gray-900">simplim</h1>

            <div className="flex items-center space-x-2">
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "viewer"
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
                onClick={() => onTabChange("viewer")}
              >
                Viewer
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "EasyChart"
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
                onClick={() => onTabChange("EasyChart")}
              >
                EasyChart
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "FlowBuilder"
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
                onClick={() => onTabChange("FlowBuilder")}
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
      </div>
    </header>
  );
};

export default Header;
