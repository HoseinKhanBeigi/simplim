import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const AIInsightsPanel = ({ selectedText, insights, onClarify }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const pathname = usePathname();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Get action button text and functionality based on current route
  const getActionConfig = () => {
    const path = pathname.split('/').pop();
    switch (path) {
      case 'flowbuilder':
        return {
          buttonText: 'Generate Flow',
          placeholder: 'Describe the flow you want to create...',
          description: 'Create beautiful flow diagrams with AI assistance',
          icon: (
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          )
        };
      case 'easychart':
        return {
          buttonText: 'Create Chart',
          placeholder: 'Describe the data visualization you want...',
          description: 'Transform your data into stunning visualizations',
          icon: (
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )
        };
      case 'doceditor':
        return {
          buttonText: 'Enhance Document',
          placeholder: 'Describe how you want to enhance the document...',
          description: 'Improve your documents with AI-powered suggestions',
          icon: (
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          )
        };
      default:
        return {
          buttonText: 'Simplify Further',
          placeholder: 'Type or select text to simplify...',
          description: 'Get clear and concise explanations of complex text',
          icon: (
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )
        };
    }
  };

  const actionConfig = getActionConfig();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputText]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update input text when selected text changes
  useEffect(() => {
    if (selectedText) {
      setInputText(selectedText);
    }
  }, [selectedText]);

  // Update messages when insights change
  useEffect(() => {
    if (insights && insights[0]) {
      setIsTyping(true);
      setTimeout(() => {
        // setMessages(prev => [...prev, {
        //   type: 'assistant',
        //   content: insights[0].content
        // }]);
        setIsTyping(false);
      }, 1000);
    }
  }, [insights]);

  const handleAction = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    try {
      const result = await actionConfig.action(inputText);
      if (result) {
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: result
        }]);
      }
    } catch (error) {
      console.error('Error processing:', error);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAction();
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Chat Messages - Fixed height with independent scrolling */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 animate-fade-in">
            <div className="w-20 h-20 mb-6 text-blue-500 bg-blue-50 rounded-full flex items-center justify-center">
              {actionConfig.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Welcome to {pathname.split('/').pop()}</h3>
            <p className="text-sm max-w-md text-gray-500 leading-relaxed">
              {actionConfig.description}
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'assistant' ? 'justify-start' : 'justify-end'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'assistant'
                      ? 'bg-white text-gray-800 shadow-sm border border-gray-100'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
        <div className="space-y-3">
          <div className="relative group">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={actionConfig.placeholder}
              className="w-full min-h-[60px] max-h-[200px] p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 transition-all duration-200 group-hover:border-gray-300"
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 flex items-center space-x-2">
              <span className="hidden group-hover:inline transition-opacity duration-200">Press Enter to send</span>
              <span className="text-gray-300">|</span>
              <span>Shift + Enter for new line</span>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAction}
              disabled={isProcessing || !inputText.trim()}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${isProcessing || !inputText.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md active:bg-blue-700 transform hover:-translate-y-0.5'
                }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  {actionConfig.icon}
                  {actionConfig.buttonText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPanel; 