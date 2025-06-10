import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Admission from "./components/Admission";
import Announcements from "./components/Announcements";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Home from "./components/Home";
import AdminDashboard from "./components/AdminDashboard";
import BookRoom from "./components/BookRoom";
import Payment from "./components/Payment";
import PaymentSuccess from "./components/PaymentSuccess";
import ChatbotWidget from "./components/ChatbotWidget";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/admission">Admission</Link>
          <Link to="/announcements">Announcements</Link>
          <Link to="/payment">Payment</Link>
          {isAuthenticated ? (
            <Link to="/" onClick={() => setIsAuthenticated(false)}>Logout</Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
          <Link to="/contact">Contact</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route 
            path="/admin-dashboard" 
            element={
                <AdminDashboard />
            } 
          />
          <Route 
            path="/book-room" 
            element={
              <ProtectedRoute>
                <BookRoom />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <ChatbotWidget />
      </div>
    </Router>
  );
};

export default App;