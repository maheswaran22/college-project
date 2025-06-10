import React from 'react';
import PdfSidebar from './PdfSidebar';
import './Home.css';

const Home = () => {
  const images = [
    '/images/hostel1.jpg',
    '/images/hostel2.jpg',
    '/images/hostel3.jpg',
    '/images/hostel4.jpg'
  ];

  return (
    <div className="home-container">
      <PdfSidebar />
      <div className="home-content">
      <div className="welcome-section">
          <h1>Welcome to Our Hostel</h1>
          <p>Experience comfortable and secure accommodation with modern amenities.</p>
        </div>
        <div className="image-slider">
          {images.map((image, index) => (
            <div key={index} className="slide">
              <img src={image} alt={`Hostel View ${index + 1}`} />
            </div>
          ))}
          <div className="slider-dots">
            {images.map((_, index) => (
              <div key={index} className={`dot ${index === 0 ? 'active' : ''}`}></div>
            ))}
          </div>
        </div>
        
        

        
         
          
          
        
      </div>
    </div>
  );
};

export default Home;
