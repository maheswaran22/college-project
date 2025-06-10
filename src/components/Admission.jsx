// import React, { useState, useEffect } from "react";
// import "./admission.css";
// import { 
//   sendEmailVerification, 
//   onAuthStateChanged, 
//   reload, 
//   signInWithEmailAndPassword, 
//   createUserWithEmailAndPassword 
// } from "firebase/auth";
// import { auth } from "../firebase";
// import { addDoc, collection } from "firebase/firestore";
// import { db } from "../firebase";
// import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

// const Admission = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     fatherName: "",
//     motherName: "",
//     email: "",
//     phone: "",
//     gender: "",
//     department: "",
//     year: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [emailSent, setEmailSent] = useState(false);
//   const [emailVerified, setEmailVerified] = useState(false);
//   const [passwordError, setPasswordError] = useState("");

//   const actionCodeSettings = {
//     url: window.location.href,
//     handleCodeInApp: true,
//   };

//   // ➤ Common change handler
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if ((name === "password" || name === "confirmPassword") && formData.confirmPassword) {
//       if ((name === "confirmPassword" && value !== formData.password) ||
//           (name === "password" && value !== formData.confirmPassword)) {
//         setPasswordError("Passwords do not match");
//       } else {
//         setPasswordError("");
//       }
//     }
//   };

//   // ➤ Send Email Verification
//   const handleSendVerification = async () => {
//     const { email, password, confirmPassword } = formData;

//     // Basic validation
//     if (!email || !password || !confirmPassword) {
//       return alert("Please fill in Email, Password, and Confirm Password");
//     }

//     if (password !== confirmPassword) {
//       return alert("❌ Passwords do not match");
//     }

//     try {
//       // 1. Create account
//       const userCred = await createUserWithEmailAndPassword(auth, email, password);

//       // 2. Send verification email
//       await sendEmailVerification(userCred.user);

//       // 3. Set flags and store email for later verification check
//       setEmailSent(true);
//       localStorage.setItem("tempEmail", email);
//       localStorage.setItem("tempPassword", password);

//       alert("✅ Verification email sent. Check your inbox.");
//     } catch (err) {
//       if (err.code === "auth/email-already-in-use") {
//         alert("⚠️ Email already registered. Try logging in.");
//       } else {
//         alert("Error: " + err.message);
//       }
//     }
//   };

//   // ➤ Check Email Verification
//   const handleCheckVerification = async () => {
//     const user = auth.currentUser;
//     if (user) {
//       await reload(user);
//       if (user.emailVerified) {
//         setEmailVerified(true);
//         alert("✅ Email verified successfully!");
//       } else {
//         alert("❌ Email not yet verified. Please check your inbox.");
//       }
//     } else {
//       alert("User not logged in.");
//     }
//   };

//   // ➤ Submit Form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!emailVerified) {
//       return alert("Please verify your email before submitting");
//     }

//     if (passwordError) {
//       return alert("Please fix the password error");
//     }

//     try {
//       await fetch("http://localhost:5000/api/students/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...formData,
//           verified: true,
//         }),
//       });
//       alert("✅ Application submitted successfully!");
//     } catch (err) {
//       alert("Error saving: " + err.message);
//     }
//   };

//   return (
// //     <div className="container">
// //       <h1>Hostel Admission Form</h1>
// //       <form onSubmit={handleSubmit}>
// //         {/* Email Verification */}
// //         <div className="input-name">
// //           <h4>Email</h4>
// //           <input
// //             type="email"
// //             name="email"
// //             className="text-name"
// //             placeholder="Enter email"
// //             value={formData.email}
// //             onChange={handleChange}
// //             required
// //           />
// //           {!emailVerified && (
// //             <button type="button" onClick={handleSendVerification}>
// //               Send Email Verification
// //             </button>
// //           )}
// //         </div>

// //         {emailSent && !emailVerified && (
// //           <>
// //             <p style={{ color: "orange" }}>Check your email & click the verification link.</p>
// //             <button type="button" onClick={handleCheckVerification}>
// //               Check Verification Status
// //             </button>
// //           </>
// //         )}

// //         {emailVerified && (
// //           <div className="verification-status">
// //             <p className="success-message">✓ Email Verified</p>
// //           </div>
// //         )}

// //         {/* Name fields */}
// //         {["name", "fatherName", "motherName"].map((field) => (
// //           <div className="input-name" key={field}>
// //             <h4>Enter your {field}</h4>
// //             <input
// //               type="text"
// //               name={field}
// //               className="text-name"
// //               placeholder={field}
// //               value={formData[field]}
// //               onChange={handleChange}
// //               required
// //             />
// //           </div>
// //         ))}

// //         {/* Phone Number */}
// //         <div className="input-name">
// //           <h4>Phone Number</h4>
// //           <input
// //             type="tel"
// //             name="phone"
// //             className="text-name"
// //             placeholder="Phone Number"
// //             value={formData.phone}
// //             onChange={handleChange}
// //             required
// //           />
// //         </div>

// //         {/* Gender, Department, Year */}
// //         {["gender", "department", "year"].map((field) => (
// //           <div className="input-name" key={field}>
// //             <select
// //               name={field}
// //               value={formData[field]}
// //               onChange={handleChange}
// //               required
// //             >
// //               <option value="">{`Select ${field}`}</option>
// //               {field === "gender" &&
// //                 ["Male", "Female", "Others"].map((g) => (
// //                   <option key={g} value={g}>
// //                     {g}
// //                   </option>
// //                 ))}
// //               {field === "department" &&
// //                 ["CSE", "ECE", "CIVIL", "IT", "MECH", "EEE"].map((d) => (
// //                   <option key={d} value={d}>
// //                     {d}
// //                   </option>
// //                 ))}
// //               {field === "year" &&
// //                 ["1", "2", "3", "4"].map((y) => (
// //                   <option key={y} value={y}>
// //                     {`Year ${y}`}
// //                   </option>
// //                 ))}
// //             </select>
// //           </div>
// //         ))}

// //         {/* Password */}
// //         <div className="input-name">
// //           <h4>Password</h4>
// //           <input
// //             type="password"
// //             name="password"
// //             className="text-name"
// //             placeholder="Enter password"
// //             value={formData.password}
// //             onChange={handleChange}
// //             required
// //           />
// //         </div>

// //         <div className="input-name">
// //           <h4>Confirm Password</h4>
// //           <input
// //             type="password"
// //             name="confirmPassword"
// //             className="text-name"
// //             placeholder="Confirm password"
// //             value={formData.confirmPassword}
// //             onChange={handleChange}
// //             required
// //           />
// //           {passwordError && <p className="error-message">{passwordError}</p>}
// //         </div>

// //         <button type="submit" className="button">
// //           Submit Application
// //         </button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default Admission;

//   <div className="container">
//     <h1>Hostel Admission Form</h1>
//     <form onSubmit={handleSubmit}>
//       {/* Email Verification */}
//       <div className="input-name">
//         <h4>Email</h4>
//         <i className="fas fa-envelope"></i>
//         <input
//           type="email"
//           name="email"
//           className="text-name"
//           placeholder="Enter email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         {!emailVerified && (
//           <button type="button" className="verification-button" onClick={handleSendVerification}>
//             <i className="fas fa-paper-plane"></i> Send Email Verification
//           </button>
//         )}
//       </div>

//       {emailSent && !emailVerified && (
//         <>
//           <p style={{ color: "#f39c12" }}>
//             <i className="fas fa-info-circle"></i> Check your email & click the verification link.
//           </p>
//           <button type="button" className="verification-button" onClick={handleCheckVerification}>
//             <i className="fas fa-sync"></i> Check Verification Status
//           </button>
//         </>
//       )}

//       {/* Name fields with icons */}
//       {[
//         { field: "name", icon: "fas fa-user" },
//         { field: "fatherName", icon: "fas fa-male" },
//         { field: "motherName", icon: "fas fa-female" }
//       ].map(({ field, icon }) => (
//         <div className="input-name" key={field}>
//           <h4>Enter your {field}</h4>
//           <i className={icon}></i>
//           <input
//             type="text"
//             name={field}
//             className="text-name"
//             placeholder={field}
//             value={formData[field]}
//             onChange={handleChange}
//             required
//           />
//         </div>
//       ))}

//       {/* Phone Number */}
//       <div className="input-name">
//         <h4>Phone Number</h4>
//         <i className="fas fa-phone"></i>
//         <input
//           type="tel"
//           name="phone"
//           className="text-name"
//           placeholder="Phone Number"
//           value={formData.phone}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       {/* Gender, Department, Year with icons */}
//       {[
//         { field: "gender", icon: "fas fa-venus-mars" },
//         { field: "department", icon: "fas fa-building" },
//         { field: "year", icon: "fas fa-calendar-alt" }
//       ].map(({ field, icon }) => (
//         <div className="input-name" key={field}>
//           <h4>Select {field}</h4>
//           <i className={icon}></i>
//           <select
//             name={field}
//             value={formData[field]}
//             onChange={handleChange}
//             required
//           >
//             <option value="">{`Select ${field}`}</option>
//             {field === "gender" &&
//               ["Male", "Female", "Others"].map((g) => (
//                 <option key={g} value={g}>
//                   {g}
//                 </option>
//               ))}
//             {field === "department" &&
//               ["CSE", "ECE", "CIVIL", "IT", "MECH", "EEE"].map((d) => (
//                 <option key={d} value={d}>
//                   {d}
//                 </option>
//               ))}
//             {field === "year" &&
//               ["1", "2", "3", "4"].map((y) => (
//                 <option key={y} value={y}>
//                   {`Year ${y}`}
//                 </option>
//               ))}
//           </select>
//         </div>
//       ))}

//       {/* Password fields with icons */}
//       <div className="input-name">
//         <h4>Password</h4>
//         <i className="fas fa-lock"></i>
//         <input
//           type="password"
//           name="password"
//           className="text-name"
//           placeholder="Enter password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div className="input-name">
//         <h4>Confirm Password</h4>
//         <i className="fas fa-lock"></i>
//         <input
//           type="password"
//           name="confirmPassword"
//           className="text-name"
//           placeholder="Confirm password"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           required
//         />
//         {passwordError && (
//           <p className="error-message">
//             <i className="fas fa-exclamation-circle"></i> {passwordError}
//           </p>
//         )}
//       </div>

//       <button type="submit" className="button">
//         <i className="fas fa-paper-plane"></i> Submit Application
//       </button>
//     </form>
//   </div>
// );
// };

// export default Admission;
import React, { useState, useEffect } from "react";
import "./admission.css";
import { 
  sendEmailVerification, 
  onAuthStateChanged, 
  reload, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { auth } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

const Admission = () => {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    email: "",
    phone: "",
    gender: "",
    department: "",
    year: "",
    password: "",
    confirmPassword: "",
  });

  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true,
  };

  // ➤ Common change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if ((name === "password" || name === "confirmPassword") && formData.confirmPassword) {
      if ((name === "confirmPassword" && value !== formData.password) ||
          (name === "password" && value !== formData.confirmPassword)) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  };

  // ➤ Send Email Verification
  const handleSendVerification = async () => {
    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      return alert("Please fill in Email, Password, and Confirm Password");
    }

    if (password !== confirmPassword) {
      return alert("❌ Passwords do not match");
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user);

      setEmailSent(true);
      localStorage.setItem("tempEmail", email);
      localStorage.setItem("tempPassword", password);

      alert("✅ Verification email sent. Check your inbox.");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        alert("⚠ Email already registered. Try logging in.");
      } else {
        alert("Error: " + err.message);
      }
    }
  };

  // ➤ Check Email Verification
  const handleCheckVerification = async () => {
    const user = auth.currentUser;
    if (user) {
      await reload(user);
      if (user.emailVerified) {
        setEmailVerified(true);
        alert("✅ Email verified successfully!");
      } else {
        alert("❌ Email not yet verified. Please check your inbox.");
      }
    } else {
      alert("User not logged in.");
    }
  };

  // ➤ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      return alert("Please verify your email before submitting");
    }

    if (passwordError) {
      return alert("Please fix the password error");
    }

    try {
      await fetch("http://localhost:5000/api/students/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          verified: true,
        }),
      });
      alert("✅ Application submitted successfully!");
    } catch (err) {
      alert("Error saving: " + err.message);
    }
  };

  return (
    <div className="container">
      <h1>Hostel Admission Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Email Verification */}
        <div className="input-name">
          <h4>Email</h4>
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            name="email"
            className="text-name"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {!emailVerified && (
            <button type="button" className="verification-button" onClick={handleSendVerification}>
              <i className="fas fa-paper-plane"></i> Send Email Verification
            </button>
          )}
        </div>

        {emailSent && !emailVerified && (
          <>
            <p style={{ color: "#f39c12" }}>
              <i className="fas fa-info-circle"></i> Check your email & click the verification link.
            </p>
            <button type="button" className="verification-button" onClick={handleCheckVerification}>
              <i className="fas fa-sync"></i> Check Verification Status
            </button>
          </>
        )}

        {/* Name fields with icons */}
        {[
          { field: "name", icon: "fas fa-user" },
          { field: "fatherName", icon: "fas fa-male" },
          { field: "motherName", icon: "fas fa-female" }
        ].map(({ field, icon }) => (
          <div className="input-name" key={field}>
            <h4>Enter your {field}</h4>
            <i className={icon}></i>
            <input
              type="text"
              name={field}
              className="text-name"
              placeholder={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Phone Number */}
        <div className="input-name">
          <h4>Phone Number</h4>
          <i className="fas fa-phone"></i>
          <input
            type="tel"
            name="phone"
            className="text-name"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Gender, Department, Year with icons */}
        {[
          { field: "gender", icon: "fas fa-venus-mars" },
          { field: "department", icon: "fas fa-building" },
          { field: "year", icon: "fas fa-calendar-alt" }
        ].map(({ field, icon }) => (
          <div className="input-name" key={field}>
            <h4>Select {field}</h4>
            <i className={icon}></i>
            <select
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            >
              <option value="">{`Select ${field}`}</option>
              {field === "gender" &&
                ["Male", "Female", "Others"].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              {field === "department" &&
                ["CSE", "ECE", "CIVIL", "IT", "MECH", "EEE"].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              {field === "year" &&
                ["1", "2", "3", "4"].map((y) => (
                  <option key={y} value={y}>
                    {`Year ${y}`}
                  </option>
                ))}
            </select>
          </div>
        ))}

        {/* Password fields with icons */}
        <div className="input-name">
          <h4>Password</h4>
          <i className="fas fa-lock"></i>
          <input
            type="password"
            name="password"
            className="text-name"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-name">
          <h4>Confirm Password</h4>
          <i className="fas fa-lock"></i>
          <input
            type="password"
            name="confirmPassword"
            className="text-name"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {passwordError && (
            <p className="error-message">
              <i className="fas fa-exclamation-circle"></i> {passwordError}
            </p>
          )}
        </div>

        <button type="submit" className="button">
          <i className="fas fa-paper-plane"></i> Submit Application
        </button>
      </form>
    </div>
  );
};

export default Admission;
