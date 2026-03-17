const axios = require('axios');

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const transporter = {
  sendMail: async (options) => {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      throw new Error("BREVO_API_KEY is not set in environment variables");
    }

    let senderName = "LinkStore";
    let senderEmail = process.env.ADMIN_EMAIL || "no-reply@linkstore.com";

    if (options.from) {
      const match = options.from.match(/"?([^"<]*)"?\s*<?([^>]*)>?/);
      if (match) {
        senderName = match[1]?.trim() || "LinkStore";
        senderEmail = match[2]?.trim() || senderEmail;
      }
    }

    const toList = Array.isArray(options.to)
      ? options.to.map((email) => ({ email }))
      : [{ email: options.to }];

    const payload = {
      sender: { name: senderName, email: senderEmail },
      to: toList,
      subject: options.subject,
      htmlContent: options.html || options.text || "",
    };

    if (options.replyTo) {
      payload.replyTo = { email: options.replyTo };
    }

    try {
      const response = await axios.post(BREVO_API_URL, payload, {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Email sent via Brevo:", response.data.messageId);
      return response.data;
    } catch (error) {
      const errorData = error.response ? error.response.data : {};
      console.error("Brevo API error:", errorData);
      throw new Error(
        errorData.message || `Brevo API failed with status ${error.response ? error.response.status : 'unknown'}`
      );
    }
  },
};

module.exports = { transporter };
