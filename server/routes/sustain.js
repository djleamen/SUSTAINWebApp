const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async (req, res) => {
  const { userInput } = req.body;

  // ✅ Check for "What is SUSTAIN?" predefined response
  if (userInput.trim().toLowerCase() === "what is sustain?") {
    return res.json({
      responseText: "I am SUSTAIN, an environmentally-friendly, token-optimized AI wrapper designed to reduce compute costs and increase productivity. I filter out irrelevant words and phrases from prompts and limit responses to essential outputs, minimizing the number of tokens used.",
      percentageSaved: 0
    });
  }

  try {
    const originalInputLength = userInput.split(/\s+/).length; // Word count of input

    // ✅ Simulating input optimization (removing unnecessary words)
    const optimizedInput = userInput.replace(/\b(the|and|is|to|of|in|that|it|for)\b/gi, '').trim();
    const optimizedInputLength = optimizedInput.split(/\s+/).length;

    // ✅ Query OpenAI for traditional output size reference
    const traditionalResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userInput }],
      max_tokens: 200, // Simulate an unrestricted AI response
    });

    const traditionalOutputText = traditionalResponse.choices[0].message.content.trim();
    const traditionalOutputLength = traditionalOutputText.split(/\s+/).length;

    // ✅ Get SUSTAIN's optimized response (cap output length)
    const sustainResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: optimizedInput + " in <20 words." }],
      max_tokens: 50, // Our output limit
    });

    const sustainOutputText = sustainResponse.choices[0].message.content.trim();
    const sustainOutputLength = sustainOutputText.split(/\s+/).length;

    // ✅ Calculate token savings
    const inputSavings = ((originalInputLength - optimizedInputLength) / originalInputLength) * 100;
    const outputSavings = ((traditionalOutputLength - sustainOutputLength) / traditionalOutputLength) * 100;
    const totalSavings = Number(((inputSavings + outputSavings) / 2).toFixed(2)); // ✅ Ensure it's a number

  res.json({
    responseText: sustainOutputText,
    percentageSaved: totalSavings // ✅ This is now a number, not a string
  });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ responseText: "Error processing request", percentageSaved: 0 });
  }
});

module.exports = router;