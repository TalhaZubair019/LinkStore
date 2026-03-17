const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
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
    isAdmin: { type: Boolean, default: false },
    adminRole: { type: String, enum: ["super_admin", "admin", null], default: null },
    promotedBy: { type: String, default: null },
    promotionPending: { type: Boolean, default: false },
    demotionPending: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

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
          fulfilledFromWarehouse: {
            type: [
              {
                warehouse: { type: String },
                qty: { type: Number },
              },
            ],
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
  },
  { timestamps: true },
);

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
  },
  { timestamps: true },
);

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    productId: { type: Number, required: true },
    userId: { type: String },
    userName: { type: String },
    userImage: { type: String },
    rating: { type: Number, required: true },
    comment: { type: String },
    date: { type: String },
    isEdited: { type: Boolean, default: false },
    previousReview: { type: Object, default: null },
  },
  { timestamps: true },
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, default: null },
  },
  { timestamps: true },
);

const warehouseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true },
);

const UserModel = mongoose.models?.User || mongoose.model("User", userSchema);
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
  OrderModel,
  ProductModel,
  ReviewModel,
  CategoryModel,
  WarehouseModel,
};
