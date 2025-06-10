import React, { useState, useEffect } from 'react';
import './styles.css';
import ReceiptList from './ReceiptList';
import Announcements from './Announcements';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [complaints, setComplaints] = useState([]);
  const [blockADetails, setBlockADetails] = useState({
    totalRooms: 20,
    occupied: 0,
    available: 20
  });

  const [blockBDetails, setBlockBDetails] = useState({
    totalRooms: 20,
    occupied: 0,
    available: 20
  });

  const [currentResidents, setCurrentResidents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Add new function to handle student deletion
  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/students/delete/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          setCurrentResidents(prev => prev.filter(resident => resident._id !== id));
          alert('Student deleted successfully');
        } else {
          alert('Failed to delete student');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student');
      }
    }
  };

  // Add new function to handle vacating student
  const handleVacateStudent = async (id) => {
    if (window.confirm('Are you sure you want to mark this student as vacated?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/students/vacate/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            vacatedAt: new Date().toISOString()
          })
        });
        const data = await response.json();
        if (data.success) {
          setCurrentResidents(prev => prev.map(resident => 
            resident._id === id ? { ...resident, vacated: true, vacatedAt: new Date().toISOString() } : resident
          ));
          alert('Student marked as vacated successfully');
        } else {
          alert('Failed to vacate student');
        }
      } catch (error) {
        console.error('Error vacating student:', error);
        alert('Error vacating student');
      }
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/students/residents/all")
      .then((res) => res.json())
      .then((data) => {
        setCurrentResidents(data);
        const blockAStudents = data.filter(
          (resident) => resident.roomNumber && resident.roomNumber.startsWith("A-")
        );
        const blockBStudents = data.filter(
          (resident) => resident.roomNumber && resident.roomNumber.startsWith("B-")
        );

        setBlockADetails({
          totalRooms: 20,
          occupied: blockAStudents.length,
          available: 20 - blockAStudents.length,
        });

        setBlockBDetails({
          totalRooms: 20,
          occupied: blockBStudents.length,
          available: 20 - blockBStudents.length,
        });
      })
      .catch((err) => console.error("Failed to fetch residents:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/students/complaints/all")
      .then(res => res.json())
      .then(data => setComplaints(data))
      .catch(err => console.error("Complaint load failed", err));
  }, []);

  const handleResolveComplaint = async (email) => {
    try {
      const res = await fetch(`http://localhost:5000/api/students/resolve-complaint/${email}`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Complaint resolved!");
        setComplaints((prev) =>
          prev.map((s) =>
            s.email === email ? { ...s, complaint: "" } : s
          )
        );
      } else {
        alert("❌ " + (data.error || "Something went wrong"));
      }
    } catch (err) {
      console.error("Resolve error:", err);
      alert("❌ Error resolving complaint");
    }
  };

  const renderComplaints = () => (
    <div className="complaints-section">
      <h2 style={{ marginTop: "40px", color: "#1a237e" }}>📩 Registered Complaints</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Room No</th>
            <th>Complaint</th>
          </tr>
        </thead>
        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan="4">No complaints submitted yet.</td>
            </tr>
          ) : (
            complaints.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.roomNumber || "Not Assigned"}</td>
                <td>
                  {c.complaint ? (
                    <>
                      {c.complaint}
                      <br />
                      <button
                        onClick={() => handleResolveComplaint(c.email)}
                        style={{ marginTop: "5px", padding: "4px 8px", background: "#4caf50", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Mark as Resolved
                      </button>
                    </>
                  ) : (
                    "None"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const filteredResidents = currentResidents.filter(resident =>
    resident.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="logo">
          <img src="/logo.png" alt="UCE-DINDIGUL" />
          <h2>UCE-DINDIGUL</h2>
        </div>
        
        <div className="stats-container">
          <div className="stat-item">
            <h3>Total Rooms</h3>
            <span>{blockADetails.totalRooms + blockBDetails.totalRooms}</span>
          </div>
          <div className="stat-item">
            <h3>Occupied</h3>
            <span>{blockADetails.occupied + blockBDetails.occupied}</span>
          </div>
          <div className="stat-item">
            <h3>Available</h3>
            <span>{blockADetails.available + blockBDetails.available}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'home' ? 'active' : ''} 
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button 
            className={activeTab === 'complaints' ? 'active' : ''} 
            onClick={() => setActiveTab('complaints')}
          >
            Complaints
          </button>
          <button 
            className={activeTab === 'receipts' ? 'active' : ''} 
            onClick={() => setActiveTab('receipts')}
          >
            Receipts
          </button>
          <button 
            className={activeTab === 'announcements' ? 'active' : ''} 
            onClick={() => setActiveTab('announcements')}
          >
            Announcements
          </button>
        </nav>

        <button className="sign-out-btn">SIGN OUT</button>
      </div>

      <main className="main-content">
        {activeTab === 'home' ? (
          <>
            <h1>Admin Dashboard</h1>
            <div className="hostel-overview">
              <h2>Hostel Rooms Overview</h2>
              
              <div className="blocks-container">
                <div className="block-card">
                  <h3>Block A (Boys)</h3>
                  <div className="block-stats">
                    <p>Total Rooms: {blockADetails.totalRooms}</p>
                    <p>Occupied: {blockADetails.occupied}</p>
                    <p>Available: {blockADetails.available}</p>
                  </div>
                </div>

                <div className="block-card">
                  <h3>Block B (Girls)</h3>
                  <div className="block-stats">
                    <p>Total Rooms: {blockBDetails.totalRooms}</p>
                    <p>Occupied: {blockBDetails.occupied}</p>
                    <p>Available: {blockBDetails.available}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="residents-section">
              <h2>Current Residents</h2>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Search by student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    width: '300px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '14px'
                  }}
                />
              </div>
              <table className="residents-table">
                <thead>
                  <tr>
                    <th>Room No</th>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Contact</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResidents.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="no-data">
                        {searchQuery ? 'No matching students found.' : 'No residents currently registered. The hostel rooms are available for booking.'}
                      </td>
                    </tr>
                  ) : (
                    filteredResidents.map(resident => (
                      <tr key={resident._id}>
                        <td>{resident.roomNumber}</td>
                        <td>{resident.name}</td>
                        <td>{resident.department}</td>
                        <td>{resident.year}</td>
                        <td>{resident.phone}</td>
                        <td>
                          {resident.createdAt ? 
                            new Date(resident.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 
                            new Date(resident.updatedAt || resident.date || Date.now()).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          }
                        </td>
                        <td>
                          {resident.vacated ? (
                            <>
                              Vacated on {new Date(resident.vacatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </>
                          ) : 'Active'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {!resident.vacated && (
                              <button
                                onClick={() => handleVacateStudent(resident._id)}
                                style={{
                                  background: "#ff9800",
                                  color: "white",
                                  padding: "4px 10px",
                                  borderRadius: "4px",
                                  border: "none",
                                  cursor: "pointer"
                                }}
                              >
                                Vacate
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteStudent(resident._id)}
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
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : activeTab === 'complaints' ? (
          renderComplaints()
        ) : activeTab === 'receipts' ? (
          <ReceiptList />
        ) : activeTab === 'announcements' ? (
          <Announcements isAdmin={true} />
        ) : null}
      </main>

      {/* Receipt Modal */}
      {modalOpen && selectedReceipt && (
        <div className="receipt-modal">
          <div className="modal-content">
            <h3>🧾 Receipt Preview</h3>
            <img
              src={selectedReceipt}
              style={{ 
                width: "100%", 
                maxHeight: "400px", 
                objectFit: "contain",
                border: "1px solid #ccc" 
              }}
              alt="Receipt Preview"
            />
            <div style={{ marginTop: "10px" }}>
              <a
                href={selectedReceipt}
                download
                style={{
                  marginRight: "10px",
                  background: "#4caf50",
                  color: "#fff",
                  padding: "6px 12px",
                  textDecoration: "none",
                  borderRadius: "4px"
                }}
              >
                ⬇ Download
              </a>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: "#f44336",
                  color: "#fff",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                ✖ Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Remove the ReceiptList component from here */}
    </div>
  );
};

export default AdminDashboard;
