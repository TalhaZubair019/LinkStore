const express = require("express");
const router = express.Router();
const axios = require("axios");
const { verifyToken } = require("../middleware/auth");

router.post("/generate-description", verifyToken, async (req, res) => {
  try {
    const { title, category, image } = req.body;
    
    if (!title || !category) {
      return res.status(400).json({
        error: "Missing required fields: title and category are needed.",
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GROQ_API_KEY is not configured on the server." });
    }

    const systemMessage = "You are a senior e-commerce SEO copywriter. Write compelling, user-first product descriptions. Focus on user intent, semantic relevance, and driving conversions.";

    const userMessage = [
      {
        type: "text",
        text: `Write a concise, engaging product description (2-3 sentences) for: "${title}" in the category: "${category}". 
        
        Guidelines:
        1. Naturally incorporate search intent.
        2. Highlight primary benefits.
        3. Persuasive and realistic tone.
        4. Return ONLY the raw description text.`,
      },
    ];

    if (image) {
      userMessage.push({
        type: "image_url",
        image_url: { url: image },
      });
    }

    // Determine model based on whether vision is needed
    // Note: GROQ supports llama-3.2-11b-vision-preview for images
    const modelToUse = image ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile";

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: modelToUse,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
        max_tokens: 250,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const description = response.data.choices[0]?.message?.content?.trim();
    if (!description) {
      return res.status(500).json({ error: "No description returned from AI." });
    }

    return res.json({ description });
  } catch (error) {
    console.error("AI Generation Error:", error.response?.data || error.message);
    const errorMessage = error.response?.data?.error?.message || "Failed to generate description.";
    return res.status(error.response?.status || 500).json({ error: errorMessage });
  }
});

module.exports = router;
