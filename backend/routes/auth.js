const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { verifyToken, JWT_SECRET, ADMIN_EMAIL } = require("../middleware/auth");
const { transporter } = require("../lib/mailer");

const router = express.Router();

const isPasswordStrong = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength && hasUpperCase && hasNumber && hasSpecialChar
  );
};

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Your email is not verified. Please verify your email to log in.",
        notVerified: true,
      });
    }

    const isAdmin = user.email === ADMIN_EMAIL || user.role === "admin";
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role, isAdmin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 3600 * 1000,
      sameSite: "lax",
    });

    const { password: _, ...userWithoutPassword } = user;
    return res.json({
      token,
      user: { ...userWithoutPassword, isAdmin },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and contain uppercase, number, and special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    try {
      await transporter.sendMail({
        from: `"LinkStore" <${process.env.ADMIN_EMAIL}>`,
        to: email,
        subject: "Verify your email - LinkStore",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #f97316; text-align: center;">Welcome to LinkStore!</h2>
            <p>Hello ${name},</p>
            <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #f97316; background: #F3F4F6; padding: 10px 20px; border-radius: 8px;">${otp}</span>
            </div>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666; text-align: center;">Best regards,<br />The LinkStore Team</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Error sending signup OTP:", mailError);
    }

    return res.status(201).json({
      message: "User created. Please check your email for the verification code.",
      email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account is already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      return res.status(400).json({
        message: "Verification code has expired. Please request a new one.",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const isAdmin = user.email === ADMIN_EMAIL || user.role === "admin";
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role, isAdmin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 3600 * 1000,
      sameSite: "lax",
    });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.otp;

    return res.json({
      message: "Email verified successfully. You are now logged in.",
      token,
      user: { ...userObj, isAdmin },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "Account already verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    try {
      await transporter.sendMail({
        from: `"LinkStore" <${process.env.ADMIN_EMAIL}>`,
        to: email,
        subject: "Your new verification code - LinkStore",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #f97316; text-align: center;">New Verification Code</h2>
            <p>Hello ${user.name},</p>
            <p>You requested a new verification code. Please use the code below to verify your email:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #f97316; background: #F3F4F6; padding: 10px 20px; border-radius: 8px;">${otp}</span>
            </div>
            <p>This code will expire in 5 minutes.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666; text-align: center;">Best regards,<br />The LinkStore Team</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Error resending OTP:", mailError);
    }

    return res.json({ message: "Verification code resent successfully." });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    const resetToken = jwt.sign({ id: user._id, purpose: "reset" }, JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    try {
      await transporter.sendMail({
        from: `"LinkStore Support" <${process.env.ADMIN_EMAIL}>`,
        to: email,
        subject: "Password Reset Request - LinkStore",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #f97316;">Password Reset</h2>
            <p>Hello ${user.name},</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p>This link will expire in 15 minutes.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666;">Best regards,<br />The LinkStore Team</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Error sending reset email:", mailError);
    }

    return res.json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.purpose !== "reset") throw new Error("Invalid token purpose");

      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!isPasswordStrong(password)) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long and contain uppercase, number, and special character.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();

      return res.json({ message: "Password has been reset successfully." });
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired reset link" });
    }
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  return res.json({ message: "Logged out successfully" });
});

// Get current user
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const { password, otp, ...userWithoutPassword } = user;
    const isAdmin = user.email === ADMIN_EMAIL || user.role === "admin";
    return res.json({ user: { ...userWithoutPassword, isAdmin } });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
