import React from 'react';

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

export default FileUploadButton; 