import React from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  const styles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f4f4',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    container: {
      width: '80%',
      maxWidth: '1200px',
      background: 'white',
      padding: '20px',
      margin: '20px 0',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    },
    h1: {
      textAlign: 'center',
      color: '#333'
    },
    contactInfo: {
      margin: '20px 0',
      textAlign: 'center'
    },
    contactItem: {
      margin: '10px 0',
      fontSize: '18px'
    },
    icon: {
      color: '#007bff',
      marginRight: '10px'
    },
    gmap: {
      width: '100%',
      marginTop: '20px'
    },
    iframe: {
      width: '100%',
      height: '450px',
      border: 0
    },
    socialMedia: {
      textAlign: 'center',
      marginTop: '20px'
    },
    socialLink: {
      margin: '0 10px',
      color: '#007bff',
      fontSize: '24px',
      textDecoration: 'none',
      ':hover': {
        color: '#0056b3'
      }
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.h1}>Contact Us</h1>

        <div style={styles.contactInfo}>
          <p style={styles.contactItem}>
            <i className="fas fa-map-marker-alt" style={styles.icon}></i>
            <strong>Address:</strong> Maangarai Pirivu, Reddiar Chattram, Dindigul - 624 622, Tamil Nadu, India.
          </p>
          <p style={styles.contactItem}>
            <i className="fas fa-phone-alt" style={styles.icon}></i>
            <strong>Phone:</strong> +919751461490
          </p>
          <p style={styles.contactItem}>
            <i className="fas fa-envelope" style={styles.icon}></i>
            <strong>Email:</strong> info@college.edu
          </p>
        </div>

        <div style={styles.gmap}>
          <h4 style={styles.h1}>College Hostel Location</h4>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.985517319711!2d77.88204787479967!3d10.42272358970535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9ff4334dac54b%3A0x296ceade9af4b4cd!2sAnna%20University%20Dindigul!5e0!3m2!1sen!2sin!4v1745335808548!5m2!1sen!2sin" 
            style={styles.iframe}
            title="College Location Map"
            allowFullScreen=""
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div style={styles.socialMedia}>
          <h3 style={styles.h1}>Follow Us</h3>
          <a href="https://www.linkedin.com/in/yourprofile" style={styles.socialLink} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://youtu.be/_wWBf-WjA8g?si=sXKEOsy5k2RsFFCy" style={styles.socialLink} target="_blank" rel="noreferrer" aria-label="YouTube">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
