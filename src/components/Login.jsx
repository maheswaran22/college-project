import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showForgot, setShowForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Handle input changes for email and password
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submit for login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter email and password");
      return;
    }

    if (isAdmin) {
      // Admin login check
      if (
        formData.email === "admin@hostel.com" &&
        formData.password === "admin123"
      ) {
        alert("✅ Admin Login Successful");
        navigate("/admin-dashboard");
      } else {
        alert("❌ Invalid Admin Credentials");
      }
    } else {
      // Student login API call
      try {
        const res = await fetch("http://localhost:5000/api/students/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(`❌ ${data.error}`);
          return;
        }

        localStorage.setItem("studentEmail", formData.email);
        onLoginSuccess();
        navigate("/book-room");
      } catch (err) {
        console.error("Login error:", err);
        alert("❌ Login failed. Try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Toggle buttons to switch login type */}
        <div className="toggle-buttons">
          <button
            className={!isAdmin ? "active" : ""}
            onClick={() => {
              setIsAdmin(false);
              setShowForgot(false);
            }}
          >
            Student
          </button>
          <button
            className={isAdmin ? "active" : ""}
            onClick={() => {
              setIsAdmin(true);
              setShowForgot(false);
            }}
          >
            Admin
          </button>
        </div>

        {/* Dynamic heading */}
        <h2>{isAdmin ? "Admin Login" : "Student Login"}</h2>

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign In</button>
          {!isAdmin && (
            <p onClick={() => setShowForgot(true)} style={{ cursor: "pointer" }}>
              Forgot Password?
            </p>
          )}
        </form>

        {/* Forgot password section (only for students) */}
        {showForgot && (
          <div className="otp-section">
            <h3>🔑 Reset Password</h3>
            {!otpSent ? (
              <>
                <input
                  type="email"
                  placeholder="Enter registered email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <button
                  onClick={async () => {
                    if (!formData.email) {
                      alert("Please enter your registered email");
                      return;
                    }
                    try {
                      const res = await fetch(
                        `http://localhost:5000/api/students/${formData.email}`
                      );
                      const student = await res.json();

                      if (!res.ok || !student?.phone) {
                        alert("❌ Email not found in database");
                        return;
                      }

                      const otp = Math.floor(1000 + Math.random() * 9000).toString();
                      setGeneratedOTP(otp);
                      setOtpSent(true);
                      alert(`🧾 OTP Sent: ${otp} (Testing only)`);
                    } catch (err) {
                      alert("Error sending OTP, try again later");
                    }
                  }}
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  onClick={async () => {
                    if (otpInput !== generatedOTP) {
                      alert("❌ OTP does not match");
                      return;
                    }

                    try {
                      const res = await fetch(
                        `http://localhost:5000/api/students/reset-password`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            email: formData.email,
                            newPassword,
                          }),
                        }
                      );

                      const result = await res.json();
                      if (result.success) {
                        alert("✅ Password reset successfully");
                        setShowForgot(false);
                        setOtpSent(false);
                        setNewPassword("");
                        setOtpInput("");
                      } else {
                        alert("❌ Reset failed");
                      }
                    } catch {
                      alert("❌ Reset failed");
                    }
                  }}
                >
                  Submit New Password
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
