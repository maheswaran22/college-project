// import React, { useState } from "react";

// const Payment = () => {
//   const [email, setEmail] = useState("");

//   const handlePay = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/payment/create-checkout-session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();
//       console.log("Backend response:", data);

//       if (data.url) {
//         window.location.href = data.url;
//       } else {
//         alert("❌ Stripe session not created");
//       }
//     } catch (err) {
//       console.error("❌ Fetch failed:", err.message);
//       alert("❌ Something went wrong. Check console.");
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h2>Pay ₹50 Hostel Application Fee</h2>
//       <input
//         type="email"
//         placeholder="Enter email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//         style={{ padding: "8px", marginBottom: "10px" }}
//       />
//       <br />
//       <button onClick={handlePay}>Pay Now</button>
//     </div>
//   );
// };

// export default Payment;
import React, { useState } from "react";
import "./Payment.css";

const Payment = () => {
  const [email, setEmail] = useState("");

  const handlePay = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/payment/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log("Backend response:", data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("❌ Stripe session not created");
      }
    } catch (err) {
      console.error("❌ Fetch failed:", err.message);
      alert("❌ Something went wrong. Check console.");
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Pay ₹5000 Hostel  Fee</h2>
        <input
          type="email"
          className="payment-input"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="payment-button" onClick={handlePay}>
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Payment;
