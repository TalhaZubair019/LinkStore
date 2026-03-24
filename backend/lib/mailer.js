const fetch = require("node-fetch");

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const transporter = {
  sendMail: async (options) => {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      throw new Error("BREVO_API_KEY is not set in environment variables");
    }

    let senderName = "LinkStore";
    let senderEmail = process.env.EMAIL_USER;

    if (options.from) {
      const match = options.from.match(/"?([^"<]*)"?\s*<?([^>]*)>?/);
      if (match) {
        senderName = match[1]?.trim() || "LinkStore";
        senderEmail = match[2]?.trim() || process.env.EMAIL_USER;
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

    const fetchFn =
      typeof fetch !== "undefined" ? fetch : require("node-fetch");

    const response = await fetchFn(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Brevo API error:", errorData);
      throw new Error(
        errorData.message || `Brevo API failed with status ${response.status}`,
      );
    }

    const result = await response.json();
    console.log("Email sent via Brevo:", result.messageId);
    return result;
  },
};

module.exports = { transporter };
