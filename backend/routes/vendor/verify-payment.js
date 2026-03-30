const express = require("express");
const Stripe = require("stripe");
const { connectDB } = require("../../lib/db");
const { VendorModel, AdminModel } = require("../../lib/models");
const { requireVendor } = require("../../middleware/vendor");
const { transporter } = require("../../lib/mailer");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/verify-commission-session", requireVendor, async (req, res) => {
  try {
    const { session_id } = req.body;
    if (!session_id) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    await connectDB();

    // 1. Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // 2. Validate session
    if (
      session.metadata.type !== "commission_payment" ||
      session.payment_status !== "paid"
    ) {
      return res.status(400).json({ message: "Invalid or unpaid session" });
    }

    const vendorId = session.metadata.vendorId;

    // 3. Update Vendor Debt
    const vendorBefore = await VendorModel.findOne({ id: vendorId }).lean();
    if (!vendorBefore) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (vendorBefore.vendorProfile.outstandingCommission > 0) {
      const amountCleared = vendorBefore.vendorProfile.outstandingCommission || 0;

      await VendorModel.findOneAndUpdate(
        { id: vendorId },
        {
          $set: {
            "vendorProfile.outstandingCommission": 0,
            "vendorProfile.commissionDeadline": null,
          },
          $inc: { "vendorProfile.totalCommissionPaid": amountCleared },
        }
      );

      // 4. Notify Admin
      const admins = await AdminModel.find({ adminRole: "super_admin" }).lean();
      const adminEmails =
        admins.length > 0 ? admins.map((a) => a.email) : [process.env.EMAIL_USER];

      const paymentHtml = `
        <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #7c3aed; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.025em;">LinkStore</h1>
          </div>
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; padding: 8px 16px; background: #ecfdf5; color: #059669; border-radius: 12px; font-size: 12px; font-weight: 800; text-transform: uppercase;">Payment Verified</div>
          </div>
          <h2 style="color: #1e293b; font-size: 20px; font-weight: 700; margin-bottom: 16px;">Commission Settlement Success</h2>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">A vendor has successfully settled their outstanding commission via Stripe. The account balance has been updated automatically.</p>
          
          <div style="background: #f8fafc; padding: 24px; border-radius: 20px; border: 1px solid #f1f5f9; margin-bottom: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding-bottom: 12px; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase;">Store Name</td>
                <td style="padding-bottom: 12px; color: #1e293b; font-size: 14px; font-weight: 700; text-align: right;">${vendorBefore.vendorProfile.storeName}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 12px; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase;">Amount Settled</td>
                <td style="padding-bottom: 12px; color: #059669; font-size: 18px; font-weight: 900; text-align: right;">$${amountCleared.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase;">Vendor Email</td>
                <td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right;">${vendorBefore.email}</td>
              </tr>
            </table>
          </div>
          
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} LinkStore Billing System.</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"LinkStore" <${process.env.EMAIL_USER}>`,
        to: adminEmails,
        subject: `✅ Commission Settled: ${vendorBefore.vendorProfile.storeName}`,
        html: paymentHtml,
      });
    }

    return res.json({ message: "Payment verified and debt cleared" });
  } catch (error) {
    console.error("Verify commission payment error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
