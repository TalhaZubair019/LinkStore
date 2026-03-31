const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config({ path: path.resolve(__dirname, ".env") });

process.on("uncaughtException", (err) => {
  console.error("FATAL: Uncaught Exception:", err);
  setTimeout(() => process.exit(1), 1000);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("FATAL: Unhandled Rejection at:", promise, "reason:", reason);
});

const app = express();
const PORT = process.env.PORT || 5000;

const cron = require("node-cron");
const { VendorModel } = require("./lib/models");
const { transporter } = require("./lib/mailer");
const { connectDB } = require("./lib/db");

cron.schedule("0 0 * * *", async () => {
  console.log("Running Daily COD Commission Billing Cron Job...");
  try {
    await connectDB();
    const vendorsWithDebt = await VendorModel.find({
      "vendorProfile.outstandingCommission": { $gt: 0 },
    }).lean();

    for (const vendor of vendorsWithDebt) {
      try {
        const email = vendor.email;
        const amount = (
          vendor.vendorProfile.outstandingCommission || 0
        ).toFixed(2);

        await transporter.sendMail({
          from: `"LinkStore" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Action Required: Your Daily COD Commission Invoice",
          html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #0f172a;">Daily Commission Invoice</h2>
              <p>Hello <strong>${vendor.vendorProfile.storeName || vendor.name}</strong>,</p>
              <p>This is an automated notification regarding your outstanding Cash on Delivery (COD) commissions for the past 24 hours.</p>
              <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 25px 0; text-align: center;">
                <span style="color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em;">Outstanding Balance</span>
                <h1 style="margin: 10px 0; color: #2563eb; font-size: 36px;">$${amount}</h1>
              </div>
              <p>Please log in to your <strong>Vendor Dashboard</strong> to settle this payment within <strong>48 hours</strong> to avoid temporary suspension of your store.</p>
              <p>Thank you for partnering with LinkStore!</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="font-size: 11px; color: #94a3b8; text-align: center;">This is an automated message from LinkStore. Please do not reply directly to this email.</p>
            </div>
          `,
        });
        console.log(
          `[Cron] Billed vendor ${vendor.id} (${vendor.vendorProfile.storeName}) for $${amount}`,
        );
      } catch (err) {
        console.error(`[Cron] Failed to bill vendor ${vendor.id}:`, err);
      }
    }
  } catch (error) {
    console.error("Cron Job Execution Error:", error);
  }
});

app.use(cors({ origin: true, credentials: true }));

app.use(helmet({ crossOriginResourcePolicy: false }));

app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: "Too many requests from this IP, please try again later." },
});
app.use("/api/", apiLimiter);

app.use(express.json());
app.use(cookieParser());


app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/api", require("./routes"));

app.get("/", (req, res) => {
  res.json({ status: "LinkStore backend running" });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`LinkStore backend running on http://localhost:${PORT}`);
  console.log(
    `   /api/auth   /api/public   /api/admin   /api/upload   /api/stripe`,
  );
});
