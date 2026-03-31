const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { connectDB } = require("../../lib/db");
const { UserModel, AdminModel, VendorModel } = require("../../lib/models");
const {
  requireAuth,
  JWT_SECRET,
  ADMIN_EMAIL,
  findUserAcrossCollections,
} = require("../../middleware/auth");

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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await connectDB();

    const [adminUser, regularUser, vendorUser] = await Promise.all([
      AdminModel.findOne({ email }).lean(),
      UserModel.findOne({ email }).lean(),
      VendorModel.findOne({ email }).lean(),
    ]);
    const user = adminUser || vendorUser || regularUser;

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message:
          "Your email is not verified. Please verify your email to log in.",
        notVerified: true,
      });
    }

    const isAdmin = !!adminUser || user.email === ADMIN_EMAIL;
    const isVendor = !!vendorUser;
    const adminRole = adminUser
      ? user.email === ADMIN_EMAIL
        ? "super_admin"
        : "admin"
      : null;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin,
        isVendor,
        adminRole,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
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
      user: { ...userWithoutPassword, isAdmin, isVendor, adminRole },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await connectDB();
    const existing = await UserModel.findOne({ email }).lean();
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await UserModel.create({
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      cart: [],
      wishlist: [],
      savedCards: [],
      isVerified: false,
      otp,
      otpExpiresAt: new Date(Date.now() + 1 * 60 * 1000),
    });

    try {
      const { transporter } = require("../../lib/mailer");
      await transporter.sendMail({
        from: `"LinkStore" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your email - LinkStore",
        html: `
          <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px; background: #ffffff;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #7c3aed; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.025em;">LinkStore</h1>
            </div>
            <div style="text-align: center;">
              <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin-bottom: 12px;">Welcome to LinkStore!</h2>
              <p style="color: #64748b; line-height: 1.6; margin-bottom: 32px;">Hello ${name}, thank you for joining us. Please use the verification code below to complete your registration:</p>
              
              <div style="background: #f8fafc; padding: 24px; border-radius: 20px; border: 1px dashed #cbd5e1; margin-bottom: 32px; display: inline-block;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #7c3aed; font-family: monospace;">${otp}</span>
              </div>
              
              <p style="color: #94a3b8; font-size: 14px; margin-bottom: 32px;">This code will expire in 1 minute for your security.</p>
            </div>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} LinkStore Marketplace. All rights reserved.</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Error sending signup OTP:", mailError);
    }

    return res.status(201).json({
      message:
        "User created. Please check your email for the verification code.",
      email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    await connectDB();
    const user = await findUserAcrossCollections(req.user.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const { password, ...userWithoutPassword } = user;
    const isAdmin = user.collection === "admins" || user.email === ADMIN_EMAIL;
    const isVendor = user.collection === "vendors";
    const adminRole = isAdmin
      ? user.email === ADMIN_EMAIL
        ? "super_admin"
        : "admin"
      : null;
    return res.json({
      user: { ...userWithoutPassword, isAdmin, isVendor, adminRole },
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

router.put("/me", requireAuth, async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "province",
      "postcode",
      "country",
      "countryCode",
      "stateCode",
      "savedCards",
      "cart",
      "wishlist",
      "avatar",
      "promotionPending",
      "demotionPending",
      "vendorApprovalPending",
      "suspensionPending",
      "unsuspensionPending",
    ];
    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    }

    await connectDB();
    if (updateData.email) {
      const existing = await Promise.all([
        UserModel.findOne({ email: updateData.email, id: { $ne: req.user.id } }),
        AdminModel.findOne({ email: updateData.email, id: { $ne: req.user.id } }),
        VendorModel.findOne({ email: updateData.email, id: { $ne: req.user.id } }),
      ]);
      if (existing.some((e) => e !== null)) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const [u, a, v] = await Promise.all([
      UserModel.findOneAndUpdate({ id: req.user.id }, updateData, {
        returnDocument: "after",
      }).lean(),
      AdminModel.findOneAndUpdate({ id: req.user.id }, updateData, {
        returnDocument: "after",
      }).lean(),
      VendorModel.findOneAndUpdate({ id: req.user.id }, updateData, {
        returnDocument: "after",
      }).lean(),
    ]);
    const updated = u || a || v;
    if (updated) return res.json({ message: "User updated successfully" });
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user" });
  }
});

router.all("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  if (req.method === "GET") {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    return res.redirect(`${frontendUrl}/login`);
  }
  return res.json({ message: "Logged out successfully" });
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    await connectDB();
    const [adminUser, regularUser, vendorUser] = await Promise.all([
      AdminModel.findOne({ email }).lean(),
      UserModel.findOne({ email }).lean(),
      VendorModel.findOne({ email }).lean(),
    ]);
    const user = adminUser || vendorUser || regularUser;

    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this email address." });
    }
    const resetToken = jwt.sign({ id: user.id, purpose: "reset" }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const frontendUrl =
      process.env.FRONTEND_URL || req.headers.origin || "http://localhost:3000";
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const { transporter } = require("../../lib/mailer");
    await transporter.sendMail({
      from: `"LinkStore Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request - LinkStore",
      html: `
        <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #7c3aed; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.025em;">LinkStore</h1>
          </div>
          <h2 style="color: #1e293b; font-size: 22px; font-weight: 700; margin-bottom: 16px;">Reset Your Password</h2>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">Hello ${user.name || "there"},</p>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 32px;">We received a request to reset your password. Click the button below to choose a new secure password:</p>
          
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${resetLink}" style="background-color: #7c3aed; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 16px; font-weight: 700; display: inline-block; box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.25);">Reset Password</a>
          </div>
          
          <p style="color: #94a3b8; font-size: 14px; margin-bottom: 32px;">For your security, this link will expire in 15 minutes. If you did not request this reset, you can safely ignore this email.</p>
          
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} LinkStore Marketplace. All rights reserved.</p>
        </div>
      `,
    });
    return res.json({
      message: "Reset link sent successfully. Please check your email.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res
        .status(400)
        .json({ message: "Token and password are required" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.purpose !== "reset") throw new Error("Invalid token purpose");

      await connectDB();
      const [adminUser, regularUser, vendorUser] = await Promise.all([
        AdminModel.findOne({ id: decoded.id }),
        UserModel.findOne({ id: decoded.id }),
        VendorModel.findOne({ id: decoded.id }),
      ]);
      const user = adminUser || vendorUser || regularUser;
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!isPasswordStrong(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.",
        });
      }

      user.password = await bcrypt.hash(password, 10);
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

router.post("/change-password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await connectDB();
    const [adminUser, regularUser, vendorUser] = await Promise.all([
      AdminModel.findOne({ id: req.user.id }),
      UserModel.findOne({ id: req.user.id }),
      VendorModel.findOne({ id: req.user.id }),
    ]);
    const user = adminUser || vendorUser || regularUser;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect current password" });
      }
    }

    if (!isPasswordStrong(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    await connectDB();
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "Account is already verified" });
    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid verification code" });
    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      return res.status(400).json({
        message: "Verification code has expired. Please request a new one.",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: false,
        isVendor: false,
        adminRole: null,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
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
      user: { ...userObj, isAdmin: false, isVendor: false },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    await connectDB();
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "Account already verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);
    await user.save();

    const { transporter } = require("../../lib/mailer");
    await transporter.sendMail({
      from: `"LinkStore" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your new verification code - LinkStore",
      html: `
        <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #7c3aed; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.025em;">LinkStore</h1>
          </div>
          <div style="text-align: center;">
            <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin-bottom: 12px;">New Verification Code</h2>
            <p style="color: #64748b; line-height: 1.6; margin-bottom: 32px;">Hello ${user.name}, your new verification code is ready. Please use it to verify your account promptly:</p>
            
            <div style="background: #f8fafc; padding: 24px; border-radius: 20px; border: 1px dashed #cbd5e1; margin-bottom: 32px; display: inline-block;">
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #7c3aed; font-family: monospace;">${otp}</span>
            </div>
            
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 32px;">This code will expire in 1 minute for your security.</p>
          </div>
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} LinkStore Marketplace. All rights reserved.</p>
        </div>
      `,
    });

    return res.json({ message: "Verification code resent successfully." });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
 
 router.post("/google", async (req, res) => {
   try {
     const { idToken, accessToken } = req.body;
     let email, name, googleId;

     if (idToken) {
       const ticket = await client.verifyIdToken({
         idToken,
         audience: process.env.GOOGLE_CLIENT_ID,
       });
       const payload = ticket.getPayload();
       email = payload.email;
       name = payload.name;
       googleId = payload.sub;
     } else if (accessToken) {
       const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
         headers: { Authorization: `Bearer ${accessToken}` },
       });
       if (!response.ok) throw new Error("Failed to fetch user info from Google");
       const payload = await response.json();
       email = payload.email;
       name = payload.name;
       googleId = payload.sub;
     } else {
       return res.status(400).json({ message: "No token provided" });
     }
 
     await connectDB();
 
     const [adminUser, regularUser, vendorUser] = await Promise.all([
       AdminModel.findOne({ email }).lean(),
       UserModel.findOne({ email }).lean(),
       VendorModel.findOne({ email }).lean(),
     ]);
 
     let user = adminUser || vendorUser || regularUser;
     let isNewUser = false;
 
     if (!user) {
       const dummyPassword = await bcrypt.hash(
         Math.random().toString(36).slice(-10),
         10,
       );
       user = await UserModel.create({
         id: Date.now().toString(),
         name,
         email,
         password: dummyPassword,
         cart: [],
         wishlist: [],
         savedCards: [],
         isVerified: true,
       });
       user = user.toObject();
       isNewUser = true;
     }
 
     const isAdmin = !!adminUser || user.email === ADMIN_EMAIL;
     const isVendor = !!vendorUser;
     const adminRole = adminUser
       ? user.email === ADMIN_EMAIL
         ? "super_admin"
         : "admin"
       : null;
 
     const token = jwt.sign(
       {
         id: user.id,
         email: user.email,
         name: user.name,
         isAdmin,
         isVendor,
         adminRole,
       },
       JWT_SECRET,
       { expiresIn: "7d" },
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
       user: { ...userWithoutPassword, isAdmin, isVendor, adminRole },
       isNewUser,
     });
   } catch (error) {
     console.error("Google auth error:", error);
     return res.status(500).json({ message: "Google authentication failed" });
   }
 });
 
 router.post("/github", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "No code provided" });
    }

    
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    const access_token = tokenData.access_token;

    if (!access_token) {
      return res.status(400).json({ message: "Failed to obtain GitHub access token" });
    }

    
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "User-Agent": "LinkStore-App",
      },
    });
    const githubUser = await userResponse.json();

    
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "User-Agent": "LinkStore-App",
      },
    });
    const emails = await emailsResponse.json();
    const primaryEmailObj = emails.find((email) => email.primary && email.verified);
    const email = primaryEmailObj ? primaryEmailObj.email : githubUser.email;

    if (!email) {
      return res.status(400).json({ message: "Could not retrieve verified email from GitHub" });
    }

    await connectDB();

    const [adminUser, regularUser, vendorUser] = await Promise.all([
      AdminModel.findOne({ email }).lean(),
      UserModel.findOne({ email }).lean(),
      VendorModel.findOne({ email }).lean(),
    ]);

    let user = adminUser || vendorUser || regularUser;
    let isNewUser = false;

    if (!user) {
      const dummyPassword = await bcrypt.hash(
        Math.random().toString(36).slice(-10),
        10,
      );
      user = await UserModel.create({
        id: Date.now().toString(),
        name: githubUser.name || githubUser.login,
        email,
        password: dummyPassword,
        cart: [],
        wishlist: [],
        savedCards: [],
        isVerified: true,
      });
      user = user.toObject();
      isNewUser = true;
    }

    const isAdmin = !!adminUser || user.email === ADMIN_EMAIL;
    const isVendor = !!vendorUser;
    const adminRole = adminUser
      ? user.email === ADMIN_EMAIL
        ? "super_admin"
        : "admin"
      : null;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin,
        isVendor,
        adminRole,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
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
      user: { ...userWithoutPassword, isAdmin, isVendor, adminRole },
      isNewUser,
    });
  } catch (error) {
    console.error("GitHub auth error:", error);
    return res.status(500).json({ message: "GitHub authentication failed" });
  }
});

module.exports = router;
