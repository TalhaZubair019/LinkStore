const express = require("express");
const Stripe = require("stripe");
const { transporter } = require("../../lib/mailer");
const { requireVendor } = require("../../middleware/vendor");
const { VendorModel } = require("../../lib/models");
const { connectDB } = require("../../lib/db");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/create-commission-checkout", requireVendor, async (req, res) => {
  try {
    const vendorId = req.user.id;
    await connectDB();
    const vendor = await VendorModel.findOne({ id: vendorId }).lean();

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const amount = vendor.vendorProfile.outstandingCommission || 0;
    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "No outstanding commission to pay." });
    }

    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ).replace(/\/$/, "");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Plateform Commission Payment",
              description: `Settlement for outstanding COD commission balance for ${vendor.vendorProfile.storeName}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        type: "commission_payment",
        vendorId: vendorId,
      },
      success_url: `${appUrl}/vendor/dashboard?tab=commission&stripe=success`,
      cancel_url: `${appUrl}/vendor/dashboard?tab=commission&stripe=cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Commission checkout error:", error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
});

router.post("/notify-admin", requireVendor, async (req, res) => {
  try {
    const { amount, method, reference } = req.body;
    const vendorId = req.user.id;

    await connectDB();
    const vendor = await VendorModel.findOne({ id: vendorId }).lean();
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const adminEmail = process.env.EMAIL_USER;
    const paymentHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #6366f1;">Commission Payment Notification</h2>
        <p>A vendor has notified you that they have initiated a commission payment.</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Store Name:</strong> ${vendor.vendorProfile.storeName}</p>
          <p><strong>Vendor Email:</strong> ${vendor.email}</p>
          <p><strong>Amount:</strong> $${amount}</p>
          <p><strong>Method:</strong> ${method || "Not specified"}</p>
          <p><strong>Reference/Notes:</strong> ${reference || "No reference provided"}</p>
        </div>
        <p>Please verify this payment and clear the vendor's debt from the Admin Dashboard.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">LinkStore Billing System</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"LinkStore Billing" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `💰 Commission Payment Alert: ${vendor.vendorProfile.storeName}`,
      html: paymentHtml,
    });

    return res.json({
      message:
        "Admin has been notified of your payment. It will be verified shortly.",
    });
  } catch (error) {
    console.error("Payment notification error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
