import os
from openai import OpenAI
import spacy

class SUSTAIN:
    def __init__(self, api_key):
        self.api_key = api_key
        self.client = OpenAI(api_key=self.api_key)
        self.nlp = spacy.load("en_core_web_sm")  # Load spaCy model

    def get_response(self, user_input):
        # Check for specific queries about SUSTAIN
        if user_input in ["What is SUSTAIN?"]:
            return (
                "I am SUSTAIN, an environmentally-friendly, token-optimized AI wrapper designed to reduce compute costs and increase productivity. "
                "I filter out irrelevant words and phrases from prompts and limit responses to essential outputs, minimizing the number of tokens used.",
                0
            )
        
        optimized_input, tokens_saved = self.optimize_prompt(user_input)
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",  # Use a model you have access to
                messages=[{"role": "user", "content": optimized_input}],
                max_tokens=100  # Increased to allow for more complete responses
            )
            percentage_saved = self.calculate_percentage_saved(len(user_input.split()), tokens_saved)
            return response.choices[0].message.content.strip().split('.')[0], percentage_saved  # Return response and percentage saved
        except OpenAI.error.OpenAIError as e:
            if e.code == 'insufficient_quota':
                return "Error: You have exceeded your API quota. Please check your plan and billing details.", 0
            elif e.code == 'model_not_found':
                return "Error: The specified model does not exist or you do not have access to it.", 0
            else:
                return f"Error: {str(e)}", 0

    def optimize_prompt(self, prompt):
        doc = self.nlp(prompt)
        words_to_remove = ["Hello", "please", "Thank you", "Please", "thank you", "thanks", "Thanks", "Can you", "can you", "could", "would", "kindly", "just", "the", ".", ",", ";", "?"]
        optimized_prompt = ' '.join([token.text for token in doc if token.text.lower() not in words_to_remove])
        
        # Additional optimization techniques
        optimized_prompt = optimized_prompt.replace("I am", "I'm").replace("do not", "don't")
        optimized_prompt += " Respond <30 words"
        
        original_tokens = len(prompt.split())
        optimized_tokens = len(optimized_prompt.split())
        tokens_saved = original_tokens - optimized_tokens
        
        return optimized_prompt, tokens_saved

    def calculate_percentage_saved(self, original_tokens, tokens_saved):
        if original_tokens == 0:
            return 0
        return (tokens_saved / original_tokens) * 100