const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

//@route Get /api/orders/my-orders
//@desc Get logged in users orders
//@access private
router.get("/my-orders", protect, async(req, res) => {
  try {
    //find orders for the authenticated user
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    }); //sort by most recent orders
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
});

//@route GET /api/orders/:id
//@desc Get order details by id
//@access Private
router.get("/:id", protect , async(req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if(!order) {
      return res.status(404).json({message: "Order not found"});
    }

    //return the full order details
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
});

// DELETE all orders
router.delete("/clear", protect, admin, async (req, res) => {
  try {
    await Order.deleteMany({});
    res.status(200).json({ message: "All orders deleted." });
  } catch (err) {
    console.error("Orders delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;