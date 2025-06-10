import React from 'react';
import './PdfSidebar.css';

const PdfSidebar = () => {
  const pdfFiles = [
    { name: 'Hostel Rules & Regulations', url: '/pdfs/hostel-rules.pdf' },
    { name: 'Fee Structure', url: '/pdfs/fee-structure.pdf' },
    { name: 'Mess Menu', url: '/pdfs/mess-menu.pdf' },
    { name: 'Hostel_Vacation_Letter', url: '/pdfs/Hostel_Vacation_Letter.pdf' },
   
  ];

  return (
    <div className="pdf-sidebar">
      <h3>Downloads</h3>
      <div className="pdf-list">
        {pdfFiles.map((file, index) => (
          <a 
            key={index} 
            href={file.url} 
            className="pdf-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-file-pdf-o"></i>
            {file.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default PdfSidebar;