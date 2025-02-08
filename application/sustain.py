''' 
Description: This file is responsible for optimizing user input and interacting with the OpenAI API. 

The SUSTAIN class contains the following methods:
1. __init__(self, api_key): Initializes the SUSTAIN object with the OpenAI API key and loads the spaCy model.
2. get_response(self, user_input): Processes the user input, optimizes the prompt, and sends the request to the OpenAI API for a response.
3. optimize_prompt(self, prompt): Removes irrelevant words and phrases from the prompt and applies additional optimization techniques.
4. calculate_percentage_saved(self, original_tokens, tokens_saved): Calculates the percentage of tokens saved during optimization.

'''
import os
from openai import OpenAI
import spacy

# Create a SUSTAIN class to interact with the OpenAI API
class SUSTAIN:
    def __init__(self, api_key):
        self.api_key = api_key
        self.client = OpenAI(api_key=self.api_key)
        self.nlp = spacy.load("en_core_web_sm")

    # Process user input, optimize the prompt, and send a request to the OpenAI API
    def get_response(self, user_input):
        # Check for specific queries about SUSTAIN
        if user_input in ["What is SUSTAIN?"]:
            return (
                "I am SUSTAIN, an environmentally-friendly, token-optimized AI wrapper designed to reduce compute costs and increase productivity. "
                "I filter out irrelevant words and phrases from prompts and limit responses to essential outputs, minimizing the number of tokens used.",
                0
            )
        
        optimized_input, tokens_saved = self.optimize_prompt(user_input)
        # Send request to OpenAI API
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",  # Use a model you have access to
                messages=[{"role": "user", "content": optimized_input}],
                max_tokens=100 
            )
            response_text = response.choices[0].message.content.strip()
            response_tokens = len(response_text.split())
            percentage_saved = self.calculate_percentage_saved(len(optimized_input.split()), response_tokens)
            return response_text, percentage_saved  # Return response and percentage saved
        except OpenAI.error.OpenAIError as e:
            if e.code == 'insufficient_quota':
                return "Error: The API quota has been exceeded. Please contact SUSTAIN.", 0
            elif e.code == 'model_not_found':
                return "Error: The specified model does not exist or you do not have access to it.", 0
            else:
                return f"Error: {str(e)}", 0

    # Remove irrelevant words and phrases from the prompt
    def optimize_prompt(self, prompt):
        doc = self.nlp(prompt)
        words_to_remove = ["Hello", "please", "Thank you", "Please", "thank you", "thanks", "Thanks", "Can you", "can you", "could you", "Could you", "could", "would", "kindly", "just", "the", ".", ",", ";", "?"]
        optimized_prompt = ' '.join([token.text for token in doc if token.text.lower() not in words_to_remove])
        
        # Additional optimization techniques
        optimized_prompt = optimized_prompt.replace("I am", "I'm").replace("do not", "don't")
        optimized_prompt += " in <30 words"
        
        original_tokens = len(prompt.split())
        optimized_tokens = len(optimized_prompt.split())
        tokens_saved = original_tokens - optimized_tokens
        
        return optimized_prompt, tokens_saved

    # Calculate the percentage of tokens saved during optimization
    def calculate_percentage_saved(self, original_tokens, tokens_saved):
        if original_tokens == 0:
            return 0
        return (tokens_saved / original_tokens) * 100