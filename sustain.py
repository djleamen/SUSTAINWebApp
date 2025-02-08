import os
from openai import OpenAI
import spacy
import tiktoken

class SUSTAIN:
    def __init__(self, api_key):
        self.api_key = api_key
        self.client = OpenAI(api_key=self.api_key)
        self.nlp = spacy.load("en_core_web_sm")

    def get_response(self, user_input):
        # Check for specific question and return predefined response
        if user_input.strip().lower() == "what is sustain?":
            response_text = "SUSTAIN is a chat application that helps you optimize your questions and responses to save time and improve efficiency."
            return response_text, 0.0

        # Optimize the user input and calculate token savings
        optimized_input = self.optimize_text(user_input)
        original_tokens = self.count_tokens(user_input)
        optimized_tokens = self.count_tokens(optimized_input)

        # Calculate token savings based on input optimization (NOT response)
        tokens_saved = original_tokens - optimized_tokens
        percentage_saved = (tokens_saved / original_tokens) * 100 if original_tokens > 0 else 0

        # Ask for a concise response but ignore it for savings calculation
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": f"{optimized_input} in <30 words."}],
                max_tokens=50
            )
            response_text = response.choices[0].message.content.strip()
            return response_text, percentage_saved

        except OpenAI.error.OpenAIError as e:
            if e.code == 'insufficient_quota':
                return "Error: The API quota has been exceeded. Please contact SUSTAIN.", 0
            elif e.code == 'model_not_found':
                return "Error: The specified model does not exist or you do not have access to it.", 0
            else:
                return f"Error: {str(e)}", 0

    def trim_response(self, response_text):
        # Enforce 20 words max to keep responses concise
        words = response_text.split()
        if len(words) > 20:
            return ' '.join(words[:20]) + "..."
        return response_text

    def count_tokens(self, text):
        tokenizer = tiktoken.get_encoding("cl100k_base")
        return len(tokenizer.encode(text))

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
    
    def optimize_text(self, text):
        # Minimal but effective filtering of unnecessary phrases
        phrases_to_remove = [
            "Hello", "please", "Thank you", "thanks", "Can you", "could you", "would you", "just", 
            "kindly", "explain", "to me", "tell me", "about", "differences between", "thank you",
            "the differences", "in order to", "with regard to"
        ]
    
        # Remove unnecessary phrases
        for phrase in phrases_to_remove:
            text = text.replace(phrase, "")

        # Reduce extra spaces and trim
        optimized_text = ' '.join(text.split())
        return optimized_text.strip()
    
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
    

    def truncate_list(self, response_text):
        # If the response is a list, strip descriptions and keep 3 items
        items = response_text.split(",")  # Assuming items are comma-separated
        cleaned_items = [item.split(":")[0].strip() for item in items]  # Remove descriptions after ":"
        return ", ".join(cleaned_items[:3])  # Keep only the first 3 items