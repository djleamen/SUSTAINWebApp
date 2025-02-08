'''
Description: This file is responsible for running the chat application.

'''

import os
import logging
import tkinter as tk
from dotenv import load_dotenv
from chat_gui import ChatApp
import spacy

# Configure logging
logging.basicConfig(filename='sustain.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

load_dotenv()

# Main function to run the chat application
def main(): 
    logging.info("Starting SUSTAIN Chat Application")
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logging.error("API key not found. Please set the OPENAI_API_KEY environment variable.")
        raise ValueError("API key not found. Please set the OPENAI_API_KEY environment variable.")
    
    # Check if spaCy model is installed, if not, download it
    try:
        spacy.load("en_core_web_sm")
    except OSError:
        from spacy.cli import download
        download("en_core_web_sm")
    
    root = tk.Tk()
    app = ChatApp(root)
    root.mainloop()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        logging.error(f"Unhandled exception: {str(e)}")