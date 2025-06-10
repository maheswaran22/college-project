const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_51RNTp5H9XQWRuRljUtqq1fmBgHW2SkpYc1yrnWkSlpeE4KaplvuWANsmQcU0hjS2bJcswTSpNM9YRY8SCJm7PP6D00657qcuTg"); // Replace with your test secret key
const Transaction = require("../models/transaction");

router.post("/create-checkout-session", async (req, res) => {
  const { email } = req.body;
  console.log("Received email:", email); // For debug

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: { name: "Hostel Application Fee" },
          unit_amount: 5000
        },
        quantity: 1
      }],
      mode: "payment",
      customer_email: email,
      success_url: "http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/payment-cancel"
    });

    console.log("Stripe session URL:", session.url); // ✅ log this
    res.json({ url: session.url });

  } catch (err) {
    console.error("❌ Stripe error:", err.message);
    res.status(400).json({ error: err.message }); // return error so frontend sees it
  }
});

router.get("/verify-session", async (req, res) => {
  const sessionId = req.query.session_id;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // Save txn to MongoDB
  const txn = new Transaction({
    email: session.customer_email,
    amount: session.amount_total / 100,
    currency: session.currency,
    paymentId: session.payment_intent,
    status: session.payment_status,
    created: new Date()
  });

  await txn.save();
  res.json({ success: true, txn });
});

module.exports = router;
