const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadBaseDir = path.join(__dirname, "../../../frontend/public/uploads");
fs.mkdirSync(uploadBaseDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const folder = req.query.folder || "";
    const targetDir = path.join(uploadBaseDir, folder);
    fs.mkdirSync(targetDir, { recursive: true });
    cb(null, targetDir);
  },
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`),
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file received" });
    const folder = req.query.folder ? `${req.query.folder}/` : "";
    return res.json({ url: `/uploads/${folder}${req.file.filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
