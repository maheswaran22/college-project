import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './BookRoom.css';

// Sidebar Component
const Sidebar = ({ activeSection, onProfileClick }) => (
  <aside className="sidebar">
    <div className="sidebar-header">
      <h2>Hostel Portal</h2>
    </div>
    <nav className="sidebar-menu">
      <div className={`menu-item ${activeSection === 'profile' ? 'active' : ''}`} onClick={onProfileClick}>
        <i className="menu-icon fas fa-user"></i> <span>Profile</span>
      </div>
    </nav>
  </aside>
);

// Payments Component
const Payments = ({ openPaymentModal }) => (
  <div className="payments">
    <h2>Payments</h2>
    <div className="payment-item">
      <h3>Room A-101</h3>
      <p>Single Bed</p>
      <p>Price: ₹5000/month</p>
      <button onClick={() => openPaymentModal('A-101', '1', '5000')}>Book Now</button>
    </div>
  </div>
);

// PaymentModal Component
const PaymentModal = ({ show, onClose, paymentInfo, onPaymentComplete }) => {
  if (!show) return null;
  return (
    <div className="payment-modal">
      <h2>Payment Details</h2>
      <p>Room: {paymentInfo.roomNumber}</p>
      <p>Bed: {paymentInfo.bedNumber}</p>
      <p>Amount: ₹{paymentInfo.price}</p>
      <button onClick={onPaymentComplete}>Complete Payment</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

// ProfilePanel Component
const ProfilePanel = ({ studentData, handleAllocateRoom, handleComplaintSubmit }) => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [complaint, setComplaint] = useState("");
  
  const handleFileChange = async (e) => {
    if (e.target.files.length > 0) {
      const formData = new FormData();
      formData.append('receipt', e.target.files[0]);
      formData.append('studentName', studentData?.name || '');
      formData.append('email', studentData?.email || '');
      formData.append('roomNumber', studentData?.roomNumber || '');
  
      try {
        const response = await fetch('http://localhost:5000/api/students/upload-receipt', {
          method: 'POST',
          body: formData
        });
  
        const data = await response.json();
        if (data.success) {
          setFileUploaded(true);
          alert('Receipt uploaded successfully!');
        } else {
          alert('Failed to upload receipt');
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert('Failed to upload receipt');
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-avatar"><i className="fas fa-user-graduate"></i></div>
        <h3>{studentData?.name || "Student Name"}</h3>
        {/* <div><label>Student ID:</label><span>{studentData?.studentId || "ID"}</span></div> */}
        <div><label>Course:</label><span>{studentData?.department || "Department"}</span></div>
        <div><label>Year:</label><span>{studentData?.year || "Year"}</span></div>
        {/* <div><label>Age:</label><span>{studentData?.age || "Age"}</span></div> */}
        <div>
          <label>Room Number:</label>
          <span>{studentData?.roomNumber || "Not Assigned"}</span>
          {!studentData?.roomNumber && studentData?.email && (
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleAllocateRoom(studentData.email)}
            >
              Allocate
            </button>
          )}
        </div>
        <div><label>Room Type:</label><span>{studentData?.roomType || "Non-AC"}</span></div>
        <div><label>Fee Status:</label><span>{studentData?.feeStatus || "Paid"}</span></div>
        <div className={`upload-box ${fileUploaded ? 'uploaded' : ''}`} onClick={() => document.getElementById('fileInput').click()}>
          <div className="upload-content">
            <i className="fas fa-cloud-upload-alt"></i>
            <span>{fileUploaded ? 'Uploaded' : 'Click to Upload Receipt'}</span>
            <i className="fas fa-chevron-right arrow-icon"></i>
          </div>
          <input type="file" id="fileInput" hidden onChange={handleFileChange} />
        </div>

        <hr style={{ margin: "20px 0" }} />
        <h4 style={{ marginBottom: "10px" }}>📝 Register a Complaint</h4>
        <textarea
          placeholder="Enter your complaint here..."
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          style={{ width: "100%", height: "100px", marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
        ></textarea>
        <button
          onClick={() => handleComplaintSubmit(studentData?.email, complaint)}
          style={{ padding: "8px 16px", backgroundColor: "#1a237e", color: "white", border: "none", borderRadius: "5px" }}
        >
          Send Complaint
        </button>
      </div> {/* This is the end of .profile-content */}
    </div>
  );
};

// Main App Component
const App = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("studentEmail");
    if (!email) return;

    fetch(`http://localhost:5000/api/students/${email}`)
      .then((res) => res.json())
      .then((data) => setStudentData(data))
      .catch((err) => console.error("Failed to load student data:", err));
  }, []);

  const handleAllocateRoom = async (email) => {
    try {
      const res = await fetch(`http://localhost:5000/api/students/allocate/${email}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.roomNumber) {
        setStudentData((prev) => ({ ...prev, roomNumber: data.roomNumber }));
        alert(`✅ Room allocated: ${data.roomNumber}`);
      } else {
        alert("❌ Room allocation failed");
      }
    } catch (err) {
      console.error("Room allocation error:", err);
      alert("❌ Something went wrong");
    }
  };

  const handleComplaintSubmit = async (email, complaint) => {
    try {
      const res = await fetch(`http://localhost:5000/api/students/complaint/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ complaint })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Complaint submitted successfully');
      } else {
        alert('❌ Failed to submit complaint');
      }
    } catch (err) {
      console.error('Complaint submission error:', err);
      alert('❌ Something went wrong');
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeSection={activeSection} onProfileClick={() => setActiveSection('profile')} />
      <main className="main-content">
        <ProfilePanel 
          studentData={studentData} 
          handleAllocateRoom={handleAllocateRoom}
          handleComplaintSubmit={handleComplaintSubmit}
        />
      </main>
    </div>
  );
};

export default App;
