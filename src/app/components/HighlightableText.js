import React, { useState, useEffect } from 'react';

const HighlightableText = ({ onHighlight }) => {
  const [highlights, setHighlights] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      const highlight = {
        text,
        position: {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        },
        id: Date.now()
      };

      setHighlights(prev => [...prev, highlight]);
      setSelectedText(text);
      onHighlight(text);
    }

    setIsSelecting(false);
  };

  const handleMouseDown = () => {
    setIsSelecting(true);
  };

  const removeHighlight = (id) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div 
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      style={{ position: 'relative' }}
    >
      {/* Highlight Overlays */}
      {highlights.map(highlight => (
        <div
          key={highlight.id}
          style={{
            position: 'absolute',
            ...highlight.position,
            backgroundColor: 'rgba(255, 255, 0, 0.3)',
            pointerEvents: 'none',
            zIndex: 1
          }}
          onClick={() => removeHighlight(highlight.id)}
        />
      ))}

      {/* Selection Tooltip */}
      {isSelecting && selectedText && (
        <div
          style={{
            position: 'fixed',
            top: window.event.clientY - 40,
            left: window.event.clientX,
            backgroundColor: 'white',
            padding: '8px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}
        >
          <button onClick={() => onHighlight(selectedText)}>
            Get AI Insights
          </button>
        </div>
      )}
    </div>
  );
};

export default HighlightableText; 