const express = require("express");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// @route   POST /api/razorpay/create-order
// @desc    Create a Razorpay order
// @access  Public
router.post("/create-order", async (req, res) => {
  try {
    const { amount, checkoutId } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const receiptId = checkoutId || `checkout_${Date.now()}`;

    const options = {
      amount: parseInt(amount) * 100, // Convert rupees to paise
      currency: "INR",
      receipt: receiptId,
      notes: {
        description: "dipdopdrip Razorpay Order",
      },
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    return res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

// @route   POST /api/razorpay/verify
// @desc    Verify Razorpay payment signature
// @access  Public
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment verification data" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } else {
      return res.status(400).json({ success: false, error: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ error: "Payment verification failed" });
  }
});

module.exports = router;
