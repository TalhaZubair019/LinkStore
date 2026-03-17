const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

function extractToken(req) {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  const cookieHeader = req.headers["cookie"] || "";
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? match[1] : null;
}

const verifyToken = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });
  
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const isVendor = (req, res, next) => {
  if (req.user.role !== "vendor" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Requires Vendor or Admin Role" });
  }
  next();
};

const isAdmin = (req, res, next) => {
  const userIsAdmin = req.user.role === "admin" || req.user.email === ADMIN_EMAIL;
  if (!userIsAdmin) {
    return res.status(403).json({ message: "Forbidden: Requires Admin Role" });
  }
  next();
};

module.exports = { 
  verifyToken, 
  isVendor, 
  isAdmin,
  JWT_SECRET,
  ADMIN_EMAIL
};

