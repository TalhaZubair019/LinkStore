const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const { UserModel, ProductModel } = require("../lib/models");
const { connectDB } = require("../lib/db");

async function seed() {
  try {
    await connectDB();
    console.log("Connected to DB for seeding...");

    const sampleVendors = [
      {
        id: "v1",
        name: "Nexus Print Solutions",
        email: "nexus@linkstore.com",
        vendorProfile: {
          storeName: "Nexus Print Solutions",
          storeSlug: "nexus-print",
          storeDescription: "Precision printing for the modern age.",
          logo: "https://api.dicebear.com/7.x/identicon/svg?seed=nexus",
          status: "approved",
          averageRating: 4.8,
          totalReviews: 124
        }
      },
      {
        id: "v2",
        name: "Luxe Canvas Co",
        email: "luxe@linkstore.com",
        vendorProfile: {
          storeName: "Luxe Canvas Co",
          storeSlug: "luxe-canvas",
          storeDescription: "Bringing art to your everyday life.",
          logo: "https://api.dicebear.com/7.x/identicon/svg?seed=luxe",
          status: "approved",
          averageRating: 4.5,
          totalReviews: 89
        }
      },
      {
        id: "v3",
        name: "Vanguard Apparel",
        email: "vanguard@linkstore.com",
        vendorProfile: {
          storeName: "Vanguard Apparel",
          storeSlug: "vanguard-apparel",
          storeDescription: "High-quality custom clothing.",
          logo: "https://api.dicebear.com/7.x/identicon/svg?seed=vanguard",
          status: "approved",
          averageRating: 4.9,
          totalReviews: 256
        }
      },
      {
        id: "v4",
        name: "Elite Packaging",
        email: "elite@linkstore.com",
        vendorProfile: {
          storeName: "Elite Packaging",
          storeSlug: "elite-packaging",
          storeDescription: "Premium packaging for premium brands.",
          logo: "https://api.dicebear.com/7.x/identicon/svg?seed=elite",
          status: "approved",
          averageRating: 4.7,
          totalReviews: 42
        }
      },
      {
        id: "v5",
        name: "Stellar Signage",
        email: "stellar@linkstore.com",
        vendorProfile: {
          storeName: "Stellar Signage",
          storeSlug: "stellar-signage",
          storeDescription: "Signs that shine brighter.",
          logo: "https://api.dicebear.com/7.x/identicon/svg?seed=stellar",
          status: "approved",
          averageRating: 4.6,
          totalReviews: 78
        }
      }
    ];

    for (const vData of sampleVendors) {
      const existing = await UserModel.findOne({ id: vData.id });
      if (!existing) {
        await UserModel.create({
          ...vData,
          isVendor: true,
          password: "hashed_dummy_password", // Never used for login in this context
          isVerified: true
        });
        console.log(`Created vendor: ${vData.name}`);
      } else {
        await UserModel.updateOne({ id: vData.id }, { $set: { isVendor: true, "vendorProfile.status": "approved" } });
        console.log(`Updated existing vendor: ${vData.name}`);
      }
    }

    // Now assign some products to these vendors if they don't have any
    const products = await ProductModel.find({});
    console.log(`Found ${products.length} products to distribute.`);

    if (products.length > 0) {
      for (let i = 0; i < products.length; i++) {
        const vendorIdx = i % sampleVendors.length;
        const vendor = sampleVendors[vendorIdx];
        await ProductModel.updateOne(
          { id: products[i].id },
          {
            $set: {
              vendorId: vendor.id,
              vendorStoreName: vendor.vendorProfile.storeName,
              vendorStoreSlug: vendor.vendorProfile.storeSlug
            }
          }
        );
      }
      console.log("Distributed products among vendors.");
    }

    console.log("✅ Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
