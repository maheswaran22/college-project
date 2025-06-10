import React, { useEffect, useState } from "react";

const PaymentSuccess = () => {
  const [txn, setTxn] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session_id = params.get("session_id");

    const fetchTxn = async () => {
      const res = await fetch(`http://localhost:5000/api/payment/verify-session?session_id=${session_id}`);
      const data = await res.json();
      setTxn(data.txn);
    };

    if (session_id) fetchTxn();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>✅ Payment Successful</h2>
      {txn ? (
        <div>
          <p><strong>Transaction ID:</strong> {txn.paymentId}</p>
          <p><strong>Email:</strong> {txn.email}</p>
          <p><strong>Amount:</strong> ₹{txn.amount}</p>
          <p><strong>Status:</strong> {txn.status}</p>
        </div>
      ) : (
        <p>Loading transaction details...</p>
      )}
    </div>
  );
};

export default PaymentSuccess;
