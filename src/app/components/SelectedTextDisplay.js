import React from 'react';

const SelectedTextDisplay = ({ selectedText }) => {
  if (!selectedText) return null;

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        backgroundColor: "white",
        width: "100%",
        maxWidth: "800px",
        boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
    >
      <h3 style={{ marginBottom: "10px", color: "#1a365d" }}>Selected Text:</h3>
      <p style={{ margin: 0, color: "#4a5568" }}>{selectedText}</p>
    </div>
  );
};

export default SelectedTextDisplay; 