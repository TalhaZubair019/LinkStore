const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined in .env");

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        family: 4,
      })
      .then((m) => {
        console.log("✅ MongoDB Connected");
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
    
    // Auto-promote EMAIL_USER to super admin
    const adminEmail = process.env.EMAIL_USER;
    if (adminEmail) {
      const { UserModel, AdminModel, VendorModel } = require("./models");
      
      const existingAdmin = await AdminModel.findOne({ email: adminEmail });
      if (existingAdmin) {
        if (existingAdmin.adminRole !== "super_admin" || !existingAdmin.isVerified) {
          await AdminModel.updateOne(
            { _id: existingAdmin._id },
            { $set: { adminRole: "super_admin", isVerified: true } }
          );
        }
      } else {
        const existingUser = await UserModel.findOne({ email: adminEmail });
        const existingVendor = await VendorModel.findOne({ email: adminEmail });
        const target = existingUser || existingVendor;
        
        if (target) {
          await AdminModel.create({
            id: target.id,
            name: target.name,
            email: target.email,
            password: target.password,
            phone: target.phone,
            isVerified: true,
            adminRole: "super_admin",
            promotedBy: "system"
          });
          if (existingUser) await UserModel.deleteOne({ _id: existingUser._id });
          if (existingVendor) await VendorModel.deleteOne({ _id: existingVendor._id });
        }
      }
    }
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

module.exports = { connectDB };
