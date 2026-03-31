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

    
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    
    
    if (
      !["commission_payment", "wallet_topup"].includes(session.metadata.type) ||
      session.payment_status !== "paid"
    ) {
      return res.status(400).json({ message: "Invalid or unpaid session" });
    }

    const vendorId = session.metadata.vendorId;
    const paymentType = session.metadata.type;
    const topupAmount = parseFloat(session.metadata.amount || "0");

    
    const vendorBefore = await VendorModel.findOne({ id: vendorId }).lean();
    if (!vendorBefore) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    let updateFields = {};
    let incFields = {};
    let notificationMsg = "";
    let amountCleared = 0;

    if (paymentType === "commission_payment") {
      amountCleared = vendorBefore.vendorProfile.outstandingCommission || 0;
      updateFields = {
        "vendorProfile.outstandingCommission": 0,
        "vendorProfile.commissionDeadline": null,
      };
      incFields = { "vendorProfile.totalCommissionPaid": amountCleared };
      notificationMsg = "Commission Settlement Success";
    } else if (paymentType === "wallet_topup") {
      
      let currentWallet = (vendorBefore.vendorProfile.walletBalance || 0) + topupAmount;
      let currentDebt = vendorBefore.vendorProfile.outstandingCommission || 0;
      
      if (currentDebt > 0) {
        amountCleared = Math.min(currentWallet, currentDebt);
        currentWallet -= amountCleared;
        currentDebt -= amountCleared;
      }

      updateFields = {
        "vendorProfile.walletBalance": currentWallet,
        "vendorProfile.outstandingCommission": currentDebt,
        "vendorProfile.commissionDeadline": currentDebt > 0 ? vendorBefore.vendorProfile.commissionDeadline : null,
      };
      incFields = { "vendorProfile.totalCommissionPaid": amountCleared };
      notificationMsg = amountCleared > 0 
        ? `Wallet Top-up & Auto-Debt Clearing ($${amountCleared.toFixed(2)})`
        : "Wallet Top-up Success";
    }

    await VendorModel.findOneAndUpdate(
      { id: vendorId },
      {
        $set: updateFields,
        $inc: incFields,
      }
    );

    
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
        <h2 style="color: #1e293b; font-size: 20px; font-weight: 700; margin-bottom: 16px;">${notificationMsg}</h2>
        <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">The transaction has been processed successfully. The vendor account balance and outstanding commission have been updated.</p>
        
        <div style="background: #f8fafc; padding: 24px; border-radius: 20px; border: 1px solid #f1f5f9; margin-bottom: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding-bottom: 12px; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase;">Store Name</td>
              <td style="padding-bottom: 12px; color: #1e293b; font-size: 14px; font-weight: 700; text-align: right;">${vendorBefore.vendorProfile.storeName}</td>
            </tr>
            ${paymentType === 'wallet_topup' ? `
            <tr>
              <td style="padding-bottom: 12px; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase;">Top-up Amount</td>
              <td style="padding-bottom: 12px; color: #7c3aed; font-size: 14px; font-weight: 700; text-align: right;">$${topupAmount.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding-bottom: 12px; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase;">Debt Cleared</td>
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
      subject: `✅ Payment Verified: ${vendorBefore.vendorProfile.storeName}`,
      html: paymentHtml,
    });

    return res.json({ message: "Payment verified and processed successfully" });
  } catch (error) {
    console.error("Verify commission payment error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
