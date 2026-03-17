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

    const { UserModel } = require("./models");
    await UserModel.updateMany(
      { isAdmin: { $exists: false } },
      { $set: { isAdmin: false } },
    );
    const adminEmail = process.env.EMAIL_USER;
    if (adminEmail) {
      await UserModel.updateOne(
        { email: adminEmail },
        { $set: { isAdmin: true } },
      );
    }
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

module.exports = { connectDB };
