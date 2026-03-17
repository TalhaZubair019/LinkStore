const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiresAt: { type: Date },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  province: { type: String },
  postcode: { type: String },
  country: { type: String },
  cart: { type: Array, default: [] },
  wishlist: { type: Array, default: [] },
}, { timestamps: true });

const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  slug: { type: String, required: true, unique: true },
  logoUrl: { type: String },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stripeAccountId: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  inventoryCount: { type: Number, default: 0 },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  category: { type: String },
  images: [{ type: String }],
  badges: [{ type: String }],
  sku: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

const ReviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userImage: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  isEdited: { type: Boolean, default: false },
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  stripePaymentIntentId: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Store = mongoose.model('Store', StoreSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const Review = mongoose.model('Review', ReviewSchema);

module.exports = { User, Store, Product, Order, Review };

