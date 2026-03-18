const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));

app.use(helmet({ crossOriginResourcePolicy: false }));

// Stripe Webhook needs raw body - MUST be before express.json()
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: "Too many requests from this IP, please try again later." },
});
app.use("/api/", apiLimiter);

app.use(express.json());
app.use(cookieParser());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/public", require("./routes/public"));
app.use("/api/public/stores", require("./routes/public/stores"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/stripe", require("./routes/stripe"));
app.use("/api/paypal", require("./routes/paypal"));
app.use("/api/vendor/products", require("./routes/vendor/products"));
app.use("/api/vendor/orders", require("./routes/vendor/orders"));
app.use("/api/vendor/payouts", require("./routes/vendor/payouts"));
app.use("/api/vendor-apply", require("./routes/vendor/apply"));

app.get("/", (req, res) => {
  res.json({ status: "PrintNest backend running" });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`PrintNest backend running on http://localhost:${PORT}`);
  console.log(
    `   /api/auth   /api/public   /api/admin   /api/upload   /api/stripe   /api/paypal`,
  );
});
