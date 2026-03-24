const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadDir = path.join(__dirname, "../../../frontend/public/uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`),
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file received" });
    return res.json({ url: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
