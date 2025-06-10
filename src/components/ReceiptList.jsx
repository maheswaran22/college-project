import React, { useState, useEffect } from 'react';
import './styles.css';

const ReceiptList = () => {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students/receipts/all');
      const data = await response.json();
      setReceipts(data);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/students/receipts/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          setReceipts(receipts.filter(receipt => receipt._id !== id));
          alert('Receipt deleted successfully');
        } else {
          alert('Failed to delete receipt');
        }
      } catch (error) {
        console.error('Error deleting receipt:', error);
        alert('Error deleting receipt');
      }
    }
  };

  return (
    <div className="receipts-section">
      <h2>Student Receipts</h2>
      <div className="receipts-table-container">
        <table className="receipts-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Email</th>
              <th>Room Number</th>
              <th>Upload Date</th>
              <th>Receipt</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {receipts.length > 0 ? (
              receipts.map((receipt) => (
                <tr key={receipt._id}>
                  <td>{receipt.studentName}</td>
                  <td>{receipt.email}</td>
                  <td>{receipt.roomNumber}</td>
                  <td>{new Date(receipt.uploadedAt).toLocaleDateString()}</td>
                  <td>
                    <a 
                      href={`http://localhost:5000/uploads/receipts/${receipt.receiptUrl.split('/').pop()}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="view-receipt-btn"
                    >
                      View Receipt
                    </a>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(receipt._id)}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">No receipts found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiptList;