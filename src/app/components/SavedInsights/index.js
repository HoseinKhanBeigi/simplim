import React from 'react';

const SavedInsights = ({ savedItems, onDelete }) => {
  if (!savedItems || savedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <p className="text-lg font-medium mb-2">No Saved Items</p>
        <p className="text-sm">Your saved clarifications will appear here</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Saved Clarifications</h2>
      <div className="space-y-6">
        {savedItems.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</span>
              <button
                onClick={() => onDelete(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="mb-3 p-3 bg-gray-50 rounded border border-gray-100">
              <p className="text-gray-700 text-sm">{item.selectedText}</p>
            </div>
            <div className="text-gray-600">
              <p className="text-sm leading-relaxed">{item.explanation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedInsights; 