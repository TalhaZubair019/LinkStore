const nodemailer = require("nodemailer");

/**
 * Initialize Nodemailer with Gmail SMTP.
 * Note: Requires a "Gmail App Password" (set in EMAIL_PASS).
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Maintains compatibility with existing code structure
// Example call: await transporter.sendMail(options)
module.exports = { transporter };
