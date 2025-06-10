import React, { useState, useEffect } from 'react';

const Announcements = ({ isAdmin }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/announcements/all');
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.trim()) {
      alert('Please enter an announcement');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/announcements/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: newAnnouncement })
      });
      const data = await response.json();
      if (data.success) {
        fetchAnnouncements();
        setNewAnnouncement('');
        alert('Announcement added successfully');
      } else {
        alert('Failed to add announcement');
      }
    } catch (error) {
      console.error('Error adding announcement:', error);
      alert('Error adding announcement');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/announcements/delete/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          fetchAnnouncements();
          alert('Announcement deleted successfully');
        } else {
          alert('Failed to delete announcement');
        }
      } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('Error deleting announcement');
      }
    }
  };

  return (
    <div className="announcements-section" style={{
      padding: '30px',
      backgroundColor: '#e8f5e9',
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(120deg, #e8f5e9 0%, #b2dfdb 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#004d40',
        fontSize: '2.8rem',
        marginBottom: '35px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.15)',
        fontFamily: '"Segoe UI", Arial, sans-serif',
        letterSpacing: '1px'
      }}>📢 Announcements Board</h2>
      
      {isAdmin && (
        <div style={{
          marginBottom: '30px',
          padding: '25px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <textarea
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            placeholder="Enter new announcement..."
            style={{
              width: '100%',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '12px',
              border: '2px solid #80cbc4',
              minHeight: '120px',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              outline: 'none',
              backgroundColor: 'rgba(255,255,255,0.9)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
            }}
          />
          <button
            onClick={handleAddAnnouncement}
            style={{
              padding: '12px 28px',
              background: 'linear-gradient(45deg, #00695c 30%, #00897b 90%)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Add Announcement
          </button>
        </div>
      )}

      <div style={{
        marginTop: '20px',
        display: 'grid',
        gap: '25px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {announcements.length === 0 ? (
          <p style={{
            textAlign: 'center',
            fontSize: '20px',
            color: '#004d40',
            padding: '40px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            fontStyle: 'italic'
          }}>No announcements available.</p>
        ) : (
          announcements.map((announcement) => (
            <div 
              key={announcement._id}
              style={{
                padding: '25px',
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: '15px',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                backdropFilter: 'blur(10px)',
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: '0 0 15px 0',
                    fontSize: '18px',
                    lineHeight: '1.8',
                    color: '#00695c',
                    fontFamily: '"Segoe UI", Arial, sans-serif',
                    letterSpacing: '0.3px'
                  }}>{announcement.text}</p>
                  <small style={{
                    color: '#004d40',
                    fontSize: '14px',
                    display: 'block',
                    marginTop: '12px',
                    opacity: '0.8'
                  }}>
                    Posted on: {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </small>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement._id)}
                    style={{
                      background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '20px',
                      border: 'none',
                      cursor: 'pointer',
                      marginLeft: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(244,67,54,0.3)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
