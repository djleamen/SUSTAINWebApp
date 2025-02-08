'''
Description: This file is responsible for running the chat application.

'''

import os
import tkinter as tk
from dotenv import load_dotenv
from chat_gui import ChatApp
import spacy

load_dotenv()

# Main function to run the chat application
def main(): 
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
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
    main()