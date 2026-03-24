const mongoose = require("mongoose");

// ─────────────────────────────────────────────
// Shared auth fields (used in all 3 user types)
// ─────────────────────────────────────────────
const commonAuthFields = {
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: String },
  isVerified: { type: Boolean, default: false },
  otp: { type: String, default: null },
  otpExpiresAt: { type: Date, default: null },
};

// ─────────────────────────────────────────────
// users collection — regular customers
// ─────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    ...commonAuthFields,
    address: { type: String },
    city: { type: String },
    province: { type: String },
    postcode: { type: String },
    country: { type: String },
    countryCode: { type: String },
    stateCode: { type: String },
    cart: { type: Array, default: [] },
    wishlist: { type: Array, default: [] },
    savedCards: { type: Array, default: [] },
    // Vendor application pending flag (set before moving to vendors collection)
    vendorApplicationPending: { type: Boolean, default: false },
    vendorProfile: {
      storeName: { type: String, default: "" },
      storeSlug: { type: String, default: "" },
      storeDescription: { type: String, default: "" },
      status: {
        type: String,
        enum: ["none", "pending", "approved", "suspended", "rejected"],
        default: "none",
      },
    },
  },
  { timestamps: true }
);

// ─────────────────────────────────────────────
// admins collection — admin accounts
// ─────────────────────────────────────────────
const adminSchema = new mongoose.Schema(
  {
    ...commonAuthFields,
    adminRole: {
      type: String,
      enum: ["super_admin", "admin", null],
      default: "admin",
    },
    promotedBy: { type: String, default: null },
    promotionPending: { type: Boolean, default: false },
    demotionPending: { type: Boolean, default: false },
    suspensionPending: { type: Boolean, default: false },
    unsuspensionPending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ─────────────────────────────────────────────
// vendors collection — approved vendor store profiles
// ─────────────────────────────────────────────
const vendorSchema = new mongoose.Schema(
  {
    ...commonAuthFields,
    address: { type: String },
    city: { type: String },
    province: { type: String },
    postcode: { type: String },
    country: { type: String },
    countryCode: { type: String },
    stateCode: { type: String },
    cart: { type: Array, default: [] },
    wishlist: { type: Array, default: [] },
    savedCards: { type: Array, default: [] },
    vendorApprovalPending: { type: Boolean, default: false },
    suspensionPending: { type: Boolean, default: false },
    unsuspensionPending: { type: Boolean, default: false },
    vendorProfile: {
      storeName: { type: String, default: "" },
      storeSlug: { type: String, default: "" },
      storeDescription: { type: String, default: "" },
      logo: { type: String, default: "" },
      banner: { type: String, default: "" },
      status: {
        type: String,
        enum: ["none", "pending", "approved", "suspended", "rejected"],
        default: "approved",
      },
      bankDetails: { type: Object, default: {} },
      stripeAccountId: { type: String, default: null },
      stripeOnboardingComplete: { type: Boolean, default: false },
      averageRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// ─────────────────────────────────────────────
// orders collection
// ─────────────────────────────────────────────
const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, required: true },
    total: { type: Number, required: true },
    items: {
      type: [
        {
          id: { type: Number },
          productId: { type: Number },
          name: { type: String },
          price: { type: Number },
          quantity: { type: Number },
          totalPrice: { type: Number },
          image: { type: String },
          vendorId: { type: String, required: true },
          fulfilledFromWarehouse: {
            type: [{ warehouse: { type: String }, qty: { type: Number } }],
            default: [],
          },
        },
      ],
      required: true,
    },
    customer: { type: Object },
    trackingNumber: { type: String, default: "Pending" },
    trackingUrl: { type: String, default: "" },
    trackingHistory: {
      type: [
        {
          status: { type: String, required: true },
          message: { type: String, required: true },
          timestamp: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    vendorStatuses: {
      type: [
        {
          vendorId: { type: String, required: true },
          status: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// ─────────────────────────────────────────────
// products collection
// ─────────────────────────────────────────────
const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: String, required: true },
    oldPrice: { type: String, default: null },
    image: { type: String, required: true },
    badges: { type: [String], default: [] },
    printText: { type: String, default: "We print with" },
    category: { type: String, default: null },
    sku: { type: String, default: "" },
    stockQuantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    warehouseInventory: {
      type: [
        {
          warehouseName: { type: String, required: true },
          location: { type: String, required: true },
          quantity: { type: Number, required: true, default: 0 },
        },
      ],
      default: [],
    },
    vendorId: { type: String, required: true },
    vendorStoreName: { type: String, required: true },
    vendorStoreSlug: { type: String, required: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ─────────────────────────────────────────────
// reviews collection
// ─────────────────────────────────────────────
const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    productId: { type: Number },
    vendorId: { type: String, default: null },
    targetType: {
      type: String,
      enum: ["product", "vendor"],
      default: "product",
    },
    userId: { type: String },
    userName: { type: String },
    userImage: { type: String },
    rating: { type: Number, required: true },
    comment: { type: String },
    date: { type: String },
    isEdited: { type: Boolean, default: false },
    previousReview: { type: Object, default: null },
  },
  { timestamps: true }
);

// ─────────────────────────────────────────────
// categories collection
// ─────────────────────────────────────────────
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, default: null },
  },
  { timestamps: true }
);

// ─────────────────────────────────────────────
// warehouses collection (now scoped per vendor)
// ─────────────────────────────────────────────
const warehouseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    vendorId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

// ─────────────────────────────────────────────
// Model registrations
// ─────────────────────────────────────────────
const UserModel =
  mongoose.models?.User || mongoose.model("User", userSchema);
const AdminModel =
  mongoose.models?.Admin || mongoose.model("Admin", adminSchema);
const VendorModel =
  mongoose.models?.Vendor || mongoose.model("Vendor", vendorSchema);
const OrderModel =
  mongoose.models?.Order || mongoose.model("Order", orderSchema);
const ProductModel =
  mongoose.models?.Product || mongoose.model("Product", productSchema);
const ReviewModel =
  mongoose.models?.Review || mongoose.model("Review", reviewSchema);
const CategoryModel =
  mongoose.models?.Category || mongoose.model("Category", categorySchema);
const WarehouseModel =
  mongoose.models?.Warehouse || mongoose.model("Warehouse", warehouseSchema);

module.exports = {
  UserModel,
  AdminModel,
  VendorModel,
  OrderModel,
  ProductModel,
  ReviewModel,
  CategoryModel,
  WarehouseModel,
};


