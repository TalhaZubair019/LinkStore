const express = require("express");
const router = express.Router();
const { User } = require("../models");
const { verifyToken } = require("../middleware/auth");

// Update Cart
router.post("/cart", verifyToken, async (req, res) => {
  try {
    const { cart } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = cart;
    await user.save();
    res.json({ message: "Cart synced successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Wishlist
router.post("/wishlist", verifyToken, async (req, res) => {
  try {
    const { wishlist } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = wishlist;
    await user.save();
    res.json({ message: "Wishlist synced successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User Profile with Cart/Wishlist
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp -otpExpiresAt");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
