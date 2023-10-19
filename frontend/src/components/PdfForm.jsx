// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';

const PdfForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      const pdfUrl = URL.createObjectURL(file);
      setPdfUrl(pdfUrl);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleCheckboxChange = (pageNum) => {
    if (selectedPages.includes(pageNum)) {
      setSelectedPages(selectedPages.filter(page => page !== pageNum));
    } else {
      setSelectedPages([...selectedPages, pageNum]);
    }
  };
  
  const handleExtractPages = async () => {
    const formData = new FormData();
    formData.append('pdfFile', selectedFile);
    const response = await axios.post('http://localhost:8080/upload', formData);

    // console.log('Response from upload:', response.data);

    const pdfBytes = await response.data;
    // console.log("pdfBytes",pdfBytes)
    const extractResponse = await axios.post('http://localhost:8080/extractpages', {
      selectedPages,
      pdfBytes
    }, {
      responseType: 'blob'
    });

    const blob = new Blob([extractResponse.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute("download", "extracted.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <br />
      {pdfUrl && (
        <div>
          <embed src={pdfUrl} width="800px" height="600px" />
          <br />
          <h1>Select Pages to Extract:</h1>
          <br />
          {[...Array(10).keys()].map(pageNum => (
            <label key={pageNum + 1}>
              <input
                type="checkbox"
                checked={selectedPages.includes(pageNum + 1)}
                onChange={() => handleCheckboxChange(pageNum + 1)}
              />
              Page {pageNum + 1}
            </label>
          ))}
          <br />
          <button onClick={handleExtractPages}>Extract Pages</button>
        </div>
      )}
    </div>
  );
};

export default PdfForm;
