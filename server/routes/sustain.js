/*
Description: This file contains the Express.js route for the SUSTAIN API. 
It receives user input, optimizes it, and sends it to the OpenAI API for completion. 
The response is then returned to the user along with the percentage of tokens saved.
*/

// Required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load phrases to remove from file
const phrasesFilePath = path.join(__dirname, '../phrases_to_remove.txt');
let phrasesToRemove = [];

// Read stopwords from file at startup
fs.readFile(phrasesFilePath, 'utf8', (err, data) => {
  if (!err) {
    phrasesToRemove = data
      .split('\n')
      .map(line => line.trim()) // Trim whitespace
      .filter(line => line.length > 0); // Remove empty lines
  } else {
    console.error("Failed to read phrases_to_remove.txt:", err);
  }
});

// Constants for CO₂ calculation (Matches Python version)
const ENERGY_PER_TOKEN = 0.000002; // kWh per token
const CO2_PER_KWH = 0.4; // kg CO₂ per kWh

// Store accumulated token savings
let totalTokensSaved = 0;

// Function to escape special characters in a string for regex
const escapeRegex = (phrase) => phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

// Function to apply contractions and replacements
const applyContractions = (text) => {
  const contractions = {
    "I am": "I'm",
    "can not": "can't",
    "and": "&",
    "will not": "won't",
    "do not": "don't",
    "does not": "doesn't",
    "is not": "isn't",
    "are not": "aren't",
    "was not": "wasn't",
    "were not": "weren't",
    "have not": "haven't",
    "has not": "hasn't",
    "had not": "hadn't",
    "would not": "wouldn't",
    "should not": "shouldn't",
    "could not": "couldn't",
    "it is": "it's",
    "that is": "that's",
    "what is": "what's",
    "where is": "where's",
    "who is": "who's",
    "how is": "how's",
    "let us": "let's",
    "you are": "you're",
    "we are": "we're",
    "they are": "they're",
    "cannot": "can't",
  };

  let contractedText = text;
  for (const [key, value] of Object.entries(contractions)) {
    const regex = new RegExp(`\\b${escapeRegex(key)}\\b`, 'gi');
    contractedText = contractedText.replace(regex, value);
  }

  return contractedText;
};

const isMathOptimization = (input) => {
  const mathRegex = /^(\d+)\s*([\+\-\*\/])\s*(\d+)$/;
  const match = input.match(mathRegex);
  if (match) {
    const num1 = parseFloat(match[1]);
    const operator = match[2];
    const num2 = parseFloat(match[3]);
    let result;

    switch (operator) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
      case '/':
        result = num1 / num2;
        break;
      default:
        return null;
    }

    return result;
  }
  return null;
};

// Model energy consumption mapping
const MODEL_ENERGY_CONSUMPTION = {
  'gpt-3.5-turbo': 0.000002,
  'gpt-4o': 0.000003,
};

// Route to handle POST requests
router.post('/', async (req, res) => {
  const { userInput, model } = req.body;

  // Predefined response for "What is SUSTAIN?"
  if (userInput.trim().toLowerCase() === "what is sustain?") {
    return res.json({
      responseText: "I am SUSTAIN, an environmentally-friendly, token-optimized AI wrapper designed to reduce compute costs and increase productivity. I filter out irrelevant words and phrases from prompts and limit responses to essential outputs, minimizing the number of tokens used.",
      percentageSaved: 0
    });
  }

  // Check for math optimization
  const mathResult = isMathOptimization(userInput.trim());
  if (mathResult !== null) {
    return res.json({
      responseText: `Math detected! Result: ${mathResult}`,
      percentageSaved: 100 // Assuming 100% token savings for math optimizations
    });
  }

  try {
    const originalInputLength = userInput.split(/\s+/).length;
    let optimizedInput = userInput;

    // Apply contractions and replacements
    optimizedInput = applyContractions(optimizedInput);

    // Remove stopwords if `phrasesToRemove` is not empty
    if (phrasesToRemove.length > 0) {
      const safePhrases = phrasesToRemove.map(escapeRegex);
      if (safePhrases.length > 0) {
        const regex = new RegExp(`\\b(${safePhrases.join("|")})\\b`, 'gi');
        optimizedInput = optimizedInput.replace(regex, '').trim();
      }
    }

    const optimizedInputLength = optimizedInput.split(/\s+/).length;

    // Estimate token savings
    const inputSavings = ((originalInputLength - optimizedInputLength) / originalInputLength) * 100;
    const totalSavings = Number(inputSavings.toFixed(2));

    // Determine energy consumption per token for the selected model
    const energyPerToken = MODEL_ENERGY_CONSUMPTION[model] || MODEL_ENERGY_CONSUMPTION['gpt-3.5-turbo'];

    // Send only optimized input to OpenAI
    const sustainResponse = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo',
      messages: [{ 
        role: "system",
        content: "You are SUSTAIN, a token-optimized AI wrapper. STRICTLY FOLLOW THESE RULES: \
        1. You CANNOT schedule appointments, manage calendars, send emails, or interact with external services. \
        2. If asked to perform an action, RESPOND: 'I cannot perform that action, but I can provide guidance.' \
        3. Do NOT claim to automate anything. You ONLY summarize and optimize text."
      },
      { role: "user", content: optimizedInput + " in <20 words." }],
      max_tokens: 50,
    });

    const sustainOutputText = sustainResponse.choices[0].message.content.trim();

    // Update total tokens saved (Input + Output savings)
    const tokensSaved = originalInputLength - optimizedInputLength + sustainResponse.usage.total_tokens;
    totalTokensSaved += tokensSaved;

    // Calculate energy and CO₂ savings
    const energyUsed = tokensSaved * energyPerToken;
    const co2Emissions = energyUsed * CO2_PER_KWH;

    // Send optimized response
    res.json({
      responseText: sustainOutputText,
      percentageSaved: totalSavings,
      energyUsed: energyUsed.toFixed(4),
      co2Emissions: co2Emissions.toFixed(4)
    });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ responseText: "Error processing request", percentageSaved: 0 });
  }
});

// Route to handle GET requests
router.get('/', (req, res) => {
  res.json({ message: "SUSTAIN API is running!" });
});

// Route to calculate CO₂ savings
router.get('/co2-savings', (req, res) => {
  // Prevent displaying CO₂ savings if no tokens were saved
  if (totalTokensSaved === 0) {
    return res.json({ totalKwhSaved: 0, totalCo2Saved: 0 });
  }

  const energySaved = totalTokensSaved * ENERGY_PER_TOKEN;
  const co2Saved = (energySaved * CO2_PER_KWH).toFixed(4);

  res.json({
    totalKwhSaved: energySaved.toFixed(4),
    totalCo2Saved: co2Saved
  });
});

module.exports = router;