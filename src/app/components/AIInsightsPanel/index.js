import React, { useState, useEffect, useRef } from 'react';
import SavedInsights from '../SavedInsights';

const InsightCard = ({ insight }) => (
  <div
    style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}
  >
    <div style={{ marginBottom: '8px', color: '#1a365d', fontWeight: 500 }}>
      {insight.title}
    </div>
    <div style={{ color: '#4a5568' }}>
      {insight.content}
    </div>
    {insight.source && (
      <div style={{ 
        marginTop: '8px', 
        fontSize: '0.875rem', 
        color: '#718096',
        fontStyle: 'italic'
      }}>
        Source: {insight.source}
      </div>
    )}
  </div>
);

const AIInsightsPanel = ({ selectedText, insights, onClarify }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'saved'
  const [savedItems, setSavedItems] = useState([]);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [isDiagramLoading, setIsDiagramLoading] = useState(false);
  const [editableText, setEditableText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isClarifying, setIsClarifying] = useState(false);

  // Load saved items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedInsights');
    if (saved) {
      setSavedItems(JSON.parse(saved));
    }
  }, []);

  // Save items to localStorage when updated
  useEffect(() => {
    localStorage.setItem('savedInsights', JSON.stringify(savedItems));
  }, [savedItems]);

  // Handle window close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (savedItems.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [savedItems]);

  // Update editableText when selectedText changes
  useEffect(() => {
    if (selectedText) {
      if (isEditing) {
        // In editing mode, append the new selection
        setEditableText(prevText => {
          return prevText ? prevText + '\n' + selectedText : selectedText;
        });
      } else {
        // Not in editing mode, just show the current selection
        setEditableText(selectedText);
      }
    }
  }, [selectedText, isEditing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Reset all states
      setIsProcessing(false);
      setIsExpanded(false);
      setIsPlaying(false);
      setActiveTab('current');
      setShowExitPrompt(false);
      setShowDiagram(false);
      setIsDiagramLoading(false);
      setEditableText("");
      setIsEditing(false);
      setIsClarifying(false);
      
      // Clean up localStorage if needed
      if (savedItems.length === 0) {
        localStorage.removeItem('savedInsights');
      }
    };
  }, [savedItems]);

  // Initialize editor content when entering edit mode
  const handleEditPDF = () => {
    setIsEditing(true);
  };

  // Handle text selection from PDF
  const handleTextSelection = (text) => {
    if (!text) return;
    if (isEditing) {
      setEditableText(prevText => {
        return prevText ? prevText + '\n' + text : text;
      });
    }
  };

  const handleSaveInsight = () => {
    if (!selectedText || !insights[0]) return;
    
    const newItem = {
      selectedText,
      explanation: insights[0].content,
      timestamp: new Date().toISOString(),
    };
    
    setSavedItems(prev => [newItem, ...prev]);
  };

  const handleDeleteSaved = (index) => {
    setSavedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSimplifyFurther = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
    }, 1500);
  };

  const handleExpandDetails = () => {
    setIsExpanded(!isExpanded);
  };

  const handleTextToSpeech = () => {
    if (!selectedText) return;
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
    } else {
      const utterance = new SpeechSynthesisUtterance(selectedText);
      window.speechSynthesis.speak(utterance);
    }
    setIsPlaying(!isPlaying);
  };

  const handleShowDiagram = () => {
    setIsDiagramLoading(true);
    setShowDiagram(true);
    // Simulate API call to generate diagram
    setTimeout(() => {
      setIsDiagramLoading(false);
    }, 1500);
  };

  const handleClarify = async () => {
    setIsClarifying(true);
    try {
      await onClarify(editableText);
      setEditableText(editableText);
      setIsEditing(false);
    } catch (err) {
      console.error('Error clarifying text:', err);
    } finally {
      setIsClarifying(false);
    }
  };

  return (
    <div className="h-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === 'current'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('current')}
        >
          Current Selection
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === 'saved'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('saved')}
        >
          Saved ({savedItems.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'current' ? (
          <div className="p-6">
            {selectedText ? (
              <>
                {/* Selected Text Box */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Selected Text</h3>
                    <button
                      onClick={handleSaveInsight}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      title="Save this clarification"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-[300px] overflow-y-scroll">
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editableText}
                          onChange={(e) => setEditableText(e.target.value)}
                          className="w-full min-h-[200px] p-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                          placeholder="Edit your selected text here..."
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleClarify}
                            disabled={isClarifying || !editableText.trim()}
                            className={`
                              flex items-center px-3 py-1.5 rounded-lg text-sm font-medium
                              ${isClarifying || !editableText.trim()
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                              }
                            `}
                          >
                            {isClarifying ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                Clarifying...
                              </>
                            ) : (
                              'Re-Clarify'
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setEditableText(selectedText || "");
                            }}
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{selectedText || editableText}</p>
                        <button
                          onClick={handleEditPDF}
                          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity
                            p-1 bg-white border border-gray-200 rounded-md shadow-sm
                            text-gray-600 hover:text-blue-500 hover:border-blue-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Clarification Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Explanation</h3>
                  <div className="relative">
                    {isProcessing ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-base leading-relaxed text-gray-700">
                          {insights && insights[0] ? (
                            isExpanded ? insights[0].content : insights[0].content.split('.').slice(0, 2).join('.') + '.'
                          ) : (
                            'Select text and click clarify to get insights.'
                          )}
                        </p>
                        {insights && insights[0]?.source && (
                          <p className="text-sm text-gray-500">Source: {insights[0].source}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Diagram Section */}
                {showDiagram && (
                  <div className="mb-6 relative">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                      {isDiagramLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          <span className="ml-3 text-sm text-gray-500">Generating diagram...</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Placeholder for the actual diagram */}
                          <div className="bg-white rounded border border-gray-200 p-4 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm text-gray-500">Visual representation of the concept</p>
                          </div>
                          <button
                            onClick={() => setShowDiagram(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleSimplifyFurther}
                    disabled={isProcessing}
                    className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Simplify Further
                  </button>
                  <button
                    onClick={handleExpandDetails}
                    className="flex items-center px-3 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      {isExpanded ? (
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      )}
                    </svg>
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </button>
                  <button
                    onClick={handleShowDiagram}
                    className="flex items-center px-3 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                    title="Show visual representation"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    Show Diagram
                  </button>
                  <button
                    onClick={handleTextToSpeech}
                    className="flex items-center px-3 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      {isPlaying ? (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      )}
                    </svg>
                    {isPlaying ? 'Stop' : 'Listen'}
                  </button>
                </div>
              </>
            ) : (
              // Placeholder when no text is selected
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <p className="text-lg font-medium mb-2">No Text Selected</p>
                <p className="text-sm">Select a paragraph on the left to get started!</p>
              </div>
            )}
          </div>
        ) : (
          <SavedInsights
            savedItems={savedItems}
            onDelete={handleDeleteSaved}
          />
        )}
      </div>

      {/* Exit Prompt Modal */}
      {showExitPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Save Your Clarifications?
            </h3>
            <p className="text-gray-500 mb-6">
              Would you like to save your clarifications before closing?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowExitPrompt(false)}
              >
                No, Discard
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => {
                  // Save logic here
                  setShowExitPrompt(false);
                }}
              >
                Yes, Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsightsPanel; 