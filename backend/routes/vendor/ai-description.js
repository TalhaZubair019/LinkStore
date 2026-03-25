const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, category, image } = req.body;
    const missingFields = [];

    if (!title) missingFields.push("title");
    if (!category) missingFields.push("category");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GROQ_API_KEY is not configured." });
    }

    const systemMessageContent =
      "You are a senior e-commerce SEO copywriter. Your goal is to write compelling, user-first product descriptions that align with Google's Helpful Content guidelines. You write naturally, focusing on user search intent, semantic relevance, and driving conversions without sounding spammy or keyword-stuffed.";

    const usermessageContent = [
      {
        type: "text",
        text: `Write a concise, engaging product description (2-3 sentences) for: "${title}" in the category: "${category}".

Please follow these guidelines:
1. Semantic SEO: Naturally incorporate relevant long-tail keywords and LSI (Latent Semantic Indexing) terms related to the product. Prioritize readability over keyword density.
2. Visual Accuracy: If an image is provided, accurately weave the visible colors, textures, patterns, and specific design elements into the copy. Strictly do not hallucinate features.
3. User-Centric Focus: Address the buyer's underlying search intent. Highlight the primary benefit or material quality.
4. Tone: Persuasive, grounded, and realistic. Avoid exaggerated claims.
5. Formatting constraint: Write a single fluid, cohesive paragraph. Do not use bullet points or conversational filler.
6. Output: Return ONLY the raw description text.`,
      },
    ];

    let modelToUse = "llama-3.3-70b-versatile";

    if (image) {
      usermessageContent.push({
        type: "image_url",
        image_url: { url: image },
      });
      modelToUse = "meta-llama/llama-4-scout-17b-16e-instruct";
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            { role: "system", content: systemMessageContent },
            { role: "user", content: usermessageContent },
          ],
          max_tokens: 250,
          temperature: 0.7,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message ?? "Failed to generate description.";
      return res.status(response.status).json({ error: message });
    }

    const description = data?.choices?.[0]?.message?.content?.trim();
    if (!description) {
      return res.status(500).json({ error: "No description returned." });
    }

    return res.json({ description });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return res.status(500).json({ error: "Failed to generate description." });
  }
});

module.exports = router;
