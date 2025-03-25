import React, { useState } from "react";
import PDFRenderer from "./PDFRenderer";

const PDFHighlighter = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {file && <PDFRenderer file={file} />}
    </div>
  );
};

export default PDFHighlighter;
