/**
 * sustain.js
 * 
 * This module defines the /sustain route for the SUSTAIN web application.
 * It handles user input optimization to reduce token usage and CO₂ emissions.
 * The route processes POST requests with user input, applies text optimizations,
 * interacts with the OpenAI API, and returns optimized responses along with
 * statistics on token savings and environmental impact.
 * 
 * Author: SUSTAIN Development Team
 * Last Modified: Jan 2026
 */

const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const router = express.Router();
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load phrases to remove from file
const phrasesFilePath = path.join(__dirname, '../phrases_to_remove.txt');
let phrasesToRemove = [];

fs.readFile(phrasesFilePath, 'utf8', (err, data) => {
  /**
   * Reads phrases from phrases_to_remove.txt and stores them in an array.
   * 
   * @param {Error} err - Error object if reading fails.
   * @param {string} data - File content as a string.
   */
  if (err) {
    console.error("Failed to read phrases_to_remove.txt:", err);
  } else {
    phrasesToRemove = data
      .split('\n')
      .map(line => line.trim()) // Trim whitespace
      .filter(line => line.length > 0); // Remove empty lines
  }
});

// Constants for CO₂ calculation
const ENERGY_PER_TOKEN = 0.000002; // kWh per token
const CO2_PER_KWH = 0.4; // kg CO₂ per kWh

// Store accumulated token savings
let totalTokensSaved = 0;

// Function to escape special characters in a string for regex
const escapeRegex = (phrase) => phrase.replaceAll(/[-/\\^$*+?.()|[\]{}]/g, String.raw`\$&`);

const applyContractions = (text) => {
  /**
   * Applies common English contractions to the input text to reduce token count.
   * 
   * @param {string} text - The input text to apply contractions to.
   * @returns {string} - The text with contractions applied.
   */
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
  /**
   * Checks if the input is a simple math expression and computes the result.
   * 
   * @param {string} input - The user input to check.
   * @returns {number|null} - The computed result or null if not a math expression.
   */
  const mathRegex = /^(\d+)\s*([+\-*/])\s*(\d+)$/;
  const match = input.match(mathRegex);
  if (match) {
    const num1 = Number.parseFloat(match[1]);
    const operator = match[2];
    const num2 = Number.parseFloat(match[3]);
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

router.post('/', async (req, res) => {
  /**
   * POST /sustain
   * Receives user input, optimizes it, and returns the optimized response along with token savings.
   * 
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  try {
    const { userInput, model } = req.body;

    // Input validation
    if (!userInput || typeof userInput !== 'string') {
      return res.status(400).json({ 
        error: "Invalid input: userInput is required and must be a string",
        percentageSaved: 0 
      });
    }

    // Sanitize input to prevent injection attacks
    const sanitizedInput = userInput.trim().substring(0, 1000);

    // Validate model if provided
    const allowedModels = ['gpt-3.5-turbo', 'gpt-4o'];
    const selectedModel = model && allowedModels.includes(model) ? model : 'gpt-3.5-turbo';

    // Predefined response for "What is SUSTAIN?"
    if (sanitizedInput.toLowerCase() === "what is sustain?") {
      return res.json({
        responseText: "I am SUSTAIN, an environmentally-friendly, token-optimized AI wrapper designed to reduce compute costs and increase productivity. I filter out irrelevant words and phrases from prompts and limit responses to essential outputs, minimizing the number of tokens used.",
        percentageSaved: 0
      });
    }

    // Check for math optimization
    const mathResult = isMathOptimization(sanitizedInput);
    if (mathResult !== null) {
      return res.json({
        responseText: `Math detected! Result: ${mathResult}`,
        percentageSaved: 100 // Assuming 100% token savings for math optimizations
      });
    }
    const originalInputLength = sanitizedInput.split(/\s+/).length;
    let optimizedInput = sanitizedInput;

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
    const energyPerToken = MODEL_ENERGY_CONSUMPTION[selectedModel] || MODEL_ENERGY_CONSUMPTION['gpt-3.5-turbo'];

    // Send only optimized input to OpenAI
    const sustainResponse = await openai.chat.completions.create({
      model: selectedModel,
      messages: [{ 
        role: "system",
        content: "You are SUSTAIN, a token-optimized AI wrapper. STRICTLY FOLLOW THESE RULES: " +
        "1. You CANNOT schedule appointments, manage calendars, send emails, or interact with external services. " +
        "2. If asked to perform an action, RESPOND: 'I cannot perform that action, but I can provide guidance.' " +
        "3. Do NOT claim to automate anything. You ONLY summarize and optimize text."
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
    
    // Return appropriate error response based on error type
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: "API quota exceeded", 
        percentageSaved: 0 
      });
    } else if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({ 
        error: "Rate limit exceeded", 
        percentageSaved: 0 
      });
    } else {
      return res.status(500).json({ 
        error: "Error processing request", 
        percentageSaved: 0 
      });
    }
  }
});

router.get('/', (req, res) => {
  /**
   * GET /sustain
   * Simple route to check if the SUSTAIN API is running.
   * 
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  res.json({ message: "SUSTAIN API is running!" });
});

router.get('/co2-savings', (req, res) => {
  /**
   * GET /sustain/co2-savings
   * Returns the total CO₂ savings based on accumulated token savings.
   * 
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
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
