"""
Description: This module contains the SUSTAIN class that interacts with the 
OpenAI API to generate responses to user queries.The SUSTAIN class optimizes 
user input by removing unnecessary phrases and converting words to contractions 
before sending the input to the OpenAI API.

"""

# Import required libraries
import os
import logging
from openai import OpenAI
import spacy
import tiktoken
import re

# Configure logging
logging.basicConfig(filename='sustain.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Create a SUSTAIN class to interact with the OpenAI API
class SUSTAIN:
    def __init__(self, api_key):
        self.api_key = api_key
        self.client = OpenAI(api_key=self.api_key)
        self.nlp = spacy.load("en_core_web_sm")
        self.cache = {}

    # Function to get a response from the OpenAI API
    def get_response(self, user_input):
        # Check cache first
        if user_input in self.cache:
            logging.info(f"Cache hit for input: {user_input}")
            response_text, _ = self.cache[user_input]
            percentage_saved = 100  # Tokens saved is 100% when using cache
            return response_text, percentage_saved

        # Optimize user input
        optimized_input = self.optimize_text(user_input)
        original_tokens = self.count_tokens(user_input)
        optimized_tokens = self.count_tokens(optimized_input)
        tokens_saved = original_tokens - optimized_tokens
        percentage_saved = (tokens_saved / original_tokens) * 100 if original_tokens > 0 else 0

        # Send optimized input to OpenAI API
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": f"{optimized_input} in <20 words."}],
                max_tokens=50
            )
            response_text = response.choices[0].message.content.strip()
            logging.info(f"Response: {response_text}, Tokens saved: {percentage_saved:.2f}%")
            
            # Store response in cache
            self.cache[user_input] = (response_text, percentage_saved)
            
            return response_text, percentage_saved

        # Handle OpenAI API errors
        except OpenAI.error.OpenAIError as e:
            logging.error(f"OpenAIError: {str(e)}")
            if e.code == 'insufficient_quota':
                return "Error: The API quota has been exceeded. Please contact SUSTAIN.", 0
            elif e.code == 'model_not_found':
                return "Error: The specified model does not exist or you do not have access to it.", 0
            else:
                return f"Error: {str(e)}", 0

    # Function to optimize user input
    def trim_response(self, response_text):
        # Enforce 20 words max to keep responses concise
        words = response_text.split()
        if len(words) > 20:
            return ' '.join(words[:20]) + "..."
        return response_text

    # Function to count the number of tokens in a text
    def count_tokens(self, text):
        tokenizer = tiktoken.get_encoding("cl100k_base")
        return len(tokenizer.encode(text))

    # Function to calculate the percentage of tokens saved
    def calculate_percentage_saved(self, original_tokens, response_tokens):
        print(f"Original tokens: {original_tokens}, Response tokens: {response_tokens}")
    
        if original_tokens <= 0 or response_tokens < 0:
            return 0

        tokens_saved = original_tokens - response_tokens

        if tokens_saved < 0:
            return 0

        percentage_saved = (tokens_saved / original_tokens) * 100
        print(f"Tokens saved: {tokens_saved}, Percentage saved: {percentage_saved:.2f}%")
        return min(percentage_saved, 100)
    
    # Function to optimize text by removing unnecessary phrases and converting words to contractions
    def optimize_text(self, text):
        # Read phrases to remove from a text file
        with open('phrases_to_remove.txt', 'r') as file:
            phrases_to_remove = [line.strip() for line in file.readlines()]

        # Remove unnecessary phrases
        for phrase in phrases_to_remove:
            text = text.replace(phrase, "")

        # Convert words to contractions
        text = self.convert_to_contractions(text)

        # Reduce extra spaces and trim
        optimized_text = ' '.join(text.split())
        return optimized_text.strip()

    # Function to convert words to contractions
    def convert_to_contractions(self, text):
        contractions = {
            "do not": "don't",
            "i am": "i'm",
            "you are": "you're",
            "we are": "we're",
            "they are": "they're",
            "is not": "isn't",
            "are not": "aren't",
            "cannot": "can't",
            "could not": "couldn't",
            "would not": "wouldn't",
            "should not": "shouldn't",
            "will not": "won't",
            "have not": "haven't",
            "has not": "hasn't",
            "had not": "hadn't",
            "it is": "it's",
            "that is": "that's",
            "there is": "there's",
            "what is": "what's",
            "who is": "who's",
            "where is": "where's",
            "when is": "when's",
            "why is": "why's",
            "how is": "how's",
        }

        for phrase, contraction in contractions.items():
            text = re.sub(r'\b' + phrase + r'\b', contraction, text, flags=re.IGNORECASE)

        return text

    # Function to deep optimize the response text
    def deep_optimize_response(self, response_text):
        # Phrases to trim redundant details
        phrases_to_remove = [
            "has improved", "better ability to", "compared to", "in terms of", "offers improved",
        "provides", "includes", "while", "and also", "specializes in"
        ]

        for phrase in phrases_to_remove:
            response_text = response_text.replace(phrase, "")

        # Limit lists to 3 items max
        if "1." in response_text:  # If it's a list format, limit it
            items = response_text.split(" ")
            response_text = ' '.join(items[:15])  # Keep up to 15 tokens max for lists

        # Reduce extra spaces
        return ' '.join(response_text.split())
    

    # Function to truncate a list in the response text
    def truncate_list(self, response_text):
        # If the response is a list, strip descriptions and keep 3 items
        items = response_text.split(",")  # Assuming items are comma-separated
        cleaned_items = [item.split(":")[0].strip() for item in items]  # Remove descriptions after ":"
        return ", ".join(cleaned_items[:3])  # Keep only the first 3 items