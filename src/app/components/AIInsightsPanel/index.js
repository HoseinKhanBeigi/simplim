import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import useStore from '../../store/useStore';

const AIInsightsPanel = ({ selectedText, insights, onClarify }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const pathname = usePathname();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  
  // Use unified chat messages and input text from store (persists across pages)
  const { aiMessages, setAIMessages, addAIMessage, aiInputText, setAIInputText } = useStore();
  
  // Use store input text as local state
  const inputText = aiInputText;
  const setInputText = setAIInputText;

  // Get action button text and functionality based on current route
  // Unified AI action that works for all routes
  const handleAIAction = async (text) => {
    try {
      const path = pathname.split('/').pop();
      
      // Use a unified API endpoint that handles all routes
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          context: path, // Pass route context
          conversationHistory: aiMessages.slice(-10) // Last 10 messages for context
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.response || data.message || 'I received your message.';
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('AI action error:', error);
      // Fallback: return a simple response
      return `I understand you said: "${text}". This is a unified chat that works across all pages.`;
    }
  };

  const getActionConfig = () => {
    const path = pathname.split('/').pop();
    switch (path) {
      case 'flowbuilder':
        return {
          buttonText: 'Send',
          placeholder: 'Ask anything or describe what you want...',
          description: 'AI Assistant - Ask questions or get help',
          icon: (
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          ),
          action: handleAIAction
        };
      case 'easychart':
        return {
          buttonText: 'Send',
          placeholder: 'Ask anything or describe what you want...',
          description: 'AI Assistant - Ask questions or get help',
          icon: (
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          action: handleAIAction
        };
      case 'doceditor':
        return {
          buttonText: 'Send',
          placeholder: 'Ask anything or describe what you want...',
          description: 'AI Assistant - Ask questions or get help',
          icon: (
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          ),
          action: handleAIAction
        };
      default:
        return {
          buttonText: 'Send',
          placeholder: 'Ask anything or describe what you want...',
          description: 'AI Assistant - Ask questions or get help',
          icon: (
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          action: handleAIAction
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
  }, [aiMessages]);

  // Update input text when selected text changes
  useEffect(() => {
    if (selectedText) {
      // Always update if input is empty (user cleared it)
      if (!inputText || inputText.trim().length === 0) {
        setInputText(selectedText);
      } 
      // Update if selectedText is longer (new text was added to stack)
      else if (selectedText.length > inputText.length) {
        setInputText(selectedText);
      }
      // Otherwise, let user edit without interference
    }
  }, [selectedText]);

  // Track previous input value to detect manual clearing
  const prevInputTextRef = useRef(inputText);
  
  useEffect(() => {
    // If input becomes empty and it had content before, user manually cleared it
    const wasNotEmpty = prevInputTextRef.current && prevInputTextRef.current.trim().length > 0;
    const isNowEmpty = !inputText || inputText.trim().length === 0;
    
    if (wasNotEmpty && isNowEmpty) {
      // User manually cleared the input - clear the stack
      window.dispatchEvent(new CustomEvent('clearTextStack'));
    }
    
    prevInputTextRef.current = inputText;
  }, [inputText]);

  // Update messages when insights change (if needed)
  useEffect(() => {
    if (insights && insights[0] && insights[0].content) {
      setIsTyping(true);
      setTimeout(() => {
        // Only add if it's a new insight (not already in messages)
        const lastMessage = aiMessages[aiMessages.length - 1];
        if (!lastMessage || lastMessage.content !== insights[0].content) {
          addAIMessage({
            type: 'assistant',
            content: insights[0].content,
            timestamp: new Date().toISOString()
          });
        }
        setIsTyping(false);
      }, 1000);
    }
  }, [insights]);

  const handleAction = async () => {
    if (!inputText.trim()) return;
    
    // Add user message to unified chat
    const userMessage = {
      type: 'user',
      content: inputText,
      timestamp: new Date().toISOString()
    };
    addAIMessage(userMessage);
    
    // Clear input
    const messageText = inputText;
    setInputText('');
    
    setIsProcessing(true);
    try {
      const result = await actionConfig.action(messageText);
      if (result) {
        // Add assistant response to unified chat
        addAIMessage({
          type: 'assistant',
          content: result,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error processing:', error);
      addAIMessage({
        type: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date().toISOString()
      });
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
    <div className="h-full bg-gray-50 flex flex-col ai-insights-panel">
      {/* Chat Messages - Fixed height with independent scrolling */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {aiMessages.length === 0 ? (
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
            {aiMessages.map((message, index) => (
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
              onMouseUp={(e) => {
                // Prevent text selection in textarea from being captured
                e.stopPropagation();
              }}
              onSelect={(e) => {
                // Prevent selection events from bubbling up
                e.stopPropagation();
              }}
              placeholder={actionConfig.placeholder}
              className="w-full min-h-[60px] max-h-[200px] p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 transition-all duration-200 group-hover:border-gray-300"
            />
         
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