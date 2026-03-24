const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = process.env.EMAIL_USER;
const JWT_SECRET = process.env.JWT_SECRET;

const { connectDB } = require("../lib/db");
const { UserModel, AdminModel, VendorModel } = require("../lib/models");

function extractToken(req) {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  const cookieHeader = req.headers["cookie"] || "";
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? match[1] : null;
}

async function findUserAcrossCollections(id) {
  await connectDB();
  // Search all 3 collections in parallel
  const [user, admin, vendor] = await Promise.all([
    UserModel.findOne({ id }).lean(),
    AdminModel.findOne({ id }).lean(),
    VendorModel.findOne({ id }).lean(),
  ]);

  if (admin)
    return {
      ...admin,
      isAdmin: true,
      adminRole: admin.adminRole || "admin",
      collection: "admins",
    };
  if (vendor) return { ...vendor, isVendor: true, collection: "vendors" };
  if (user) return { ...user, collection: "users" };
  return null;
}

async function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userExists = await findUserAcrossCollections(decoded.id);
    if (!userExists) {
      return res.status(401).json({
        message: "Account not found or deleted",
        isDeleted: true,
      });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    const isAdmin = req.user.isAdmin === true || req.user.email === ADMIN_EMAIL;
    if (!isAdmin) return res.status(403).json({ message: "Forbidden" });
    next();
  });
}

function requireSuperAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.email !== ADMIN_EMAIL) {
      return res
        .status(403)
        .json({ message: "Only the super admin can perform this action" });
    }
    next();
  });
}

module.exports = {
  extractToken,
  requireAuth,
  requireAdmin,
  requireSuperAdmin,
  findUserAcrossCollections,
  JWT_SECRET,
  ADMIN_EMAIL,
};
