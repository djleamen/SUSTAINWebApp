const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Load stopwords from "phrases_to_remove.txt"
const phrasesFilePath = path.join(__dirname, '../phrases_to_remove.txt');
let phrasesToRemove = [];

// ✅ Read phrases from file and remove empty lines
fs.readFile(phrasesFilePath, 'utf8', (err, data) => {
  if (!err) {
    phrasesToRemove = data
      .split('\n') // Split lines
      .map(line => line.trim()) // Trim whitespace
      .filter(line => line.length > 0); // ✅ Remove empty lines
  } else {
    console.error("Failed to read phrases_to_remove.txt:", err);
  }
});

// ✅ Helper function to escape special characters in regex
const escapeRegex = (phrase) => phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

router.post('/', async (req, res) => {
  const { userInput } = req.body;

  // ✅ Keep predefined response for "What is SUSTAIN?"
  if (userInput.trim().toLowerCase() === "what is sustain?") {
    return res.json({
      responseText: "I am SUSTAIN, an environmentally-friendly, token-optimized AI wrapper designed to reduce compute costs and increase productivity. I filter out irrelevant words and phrases from prompts and limit responses to essential outputs, minimizing the number of tokens used.",
      percentageSaved: 0
    });
  }

  try {
    const originalInputLength = userInput.split(/\s+/).length;
    let optimizedInput = userInput;

    // ✅ Remove unnecessary words if phrasesToRemove is not empty
    if (phrasesToRemove.length > 0) {
      const safePhrases = phrasesToRemove.map(escapeRegex); // ✅ Escape special characters
      if (safePhrases.length > 0) {
        const regex = new RegExp(`\\b(${safePhrases.join("|")})\\b`, 'gi');
        optimizedInput = optimizedInput.replace(regex, '').trim();
      }
    }

    const optimizedInputLength = optimizedInput.split(/\s+/).length;

    // ✅ Query OpenAI for traditional AI response
    const traditionalResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userInput }],
      max_tokens: 200,
    });

    const traditionalOutputText = traditionalResponse.choices[0].message.content.trim();
    const traditionalOutputLength = traditionalOutputText.split(/\s+/).length;

    // ✅ Query OpenAI for optimized response (SUSTAIN)
    const sustainResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: optimizedInput + " in <20 words." }],
      max_tokens: 50,
    });

    const sustainOutputText = sustainResponse.choices[0].message.content.trim();
    const sustainOutputLength = sustainOutputText.split(/\s+/).length;

    // ✅ Calculate token savings
    const inputSavings = ((originalInputLength - optimizedInputLength) / originalInputLength) * 100;
    const outputSavings = ((traditionalOutputLength - sustainOutputLength) / traditionalOutputLength) * 100;
    const totalSavings = Number(((inputSavings + outputSavings) / 2).toFixed(2));

    res.json({
      responseText: sustainOutputText,
      percentageSaved: totalSavings
    });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ responseText: "Error processing request", percentageSaved: 0 });
  }
});

module.exports = router;