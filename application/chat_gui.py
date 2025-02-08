'''
Description: This file is responsible for building the chat application.

The main function creates a Tkinter window and initializes the ChatApp class.
The ChatApp class creates a GUI window with a logo, chat area, and entry field.
It loads the OpenAI API key from the .env file and initializes the SUSTAIN class.
The send_message method processes user input, sends a request to the OpenAI API,
and displays the response in the chat area.

The chat_gui class contains the following methods:
1. __init__(self, root): Initializes the chat application with a logo, chat area, and entry field.
2. send_message(self, event): Processes user input, sends a request to the OpenAI API, and displays the response.
3. display_message(self, message): Displays a message in the chat area.
4. display_settings_message(self, message): Displays a settings message in the chat area.

'''

import os
import tkinter as tk
from tkinter import scrolledtext, PhotoImage
from dotenv import load_dotenv
from sustain import SUSTAIN
from PIL import Image, ImageTk

# Load environment variables from .env file
load_dotenv()

# Create a chat application using Tkinter
class ChatApp:
    def __init__(self, root):
        self.root = root
        self.root.title("SUSTAIN Chat")

        # Load and display the SUSTAIN logo
        script_dir = os.path.dirname(__file__)
        original_logo = Image.open("sustain_logo.png")
        
        # Resize SUSTAIN logo while maintaining aspect ratio
        max_size = (100, 100)
        original_logo.thumbnail(max_size, Image.LANCZOS)
        self.logo = ImageTk.PhotoImage(original_logo)
        
        # Display SUSTAIN logo in the chat window
        self.logo_label = tk.Label(root, image=self.logo)
        self.logo_label.pack(pady=10)
        
        # Create a chat area and entry field
        self.chat_area = scrolledtext.ScrolledText(root, wrap=tk.WORD, state='disabled', height=20)
        self.chat_area.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)
        self.entry = tk.Entry(root)
        self.entry.pack(padx=10, pady=10, fill=tk.X, expand=True)
        self.entry.bind("<Return>", self.send_message)
        
        # Initialize the SUSTAIN API
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("API key not found. Please set the OPENAI_API_KEY environment variable.")
        self.sustain = SUSTAIN(api_key=self.api_key)
        self.display_settings_message("Welcome to SUSTAIN Chat! Ask me: \"What is SUSTAIN?\" to learn more.")
        
        # Initialize token savings
        self.total_percentage_saved = 0
        self.message_count = 0
        
        # Add a label to display token percentage saved
        self.token_savings_label = tk.Label(root, text="Average token savings: 0.00%. Thank you for going green!", fg="green")
        self.token_savings_label.pack(pady=5)

    # Process user input, send request to OpenAI API, and display response
    def send_message(self, event):
        user_input = self.entry.get()
        if user_input:
            self.display_message("You: " + user_input)
            
            # Check for specific input "What is SUSTAIN?"
            if user_input.strip().lower() == "what is sustain?":
                response = ("I am SUSTAIN, an environmentally-friendly, token-optimized AI wrapper designed to reduce compute costs "
                            "and increase productivity. I filter out irrelevant words and phrases from prompts and limit responses to "
                            "essential outputs, minimizing the number of tokens used.")
                percentage_saved = 0  # No token savings calculation for predefined response
            else:
                response, percentage_saved = self.sustain.get_response(user_input)
            
            self.display_message("\nSUSTAIN: " + response)
            self.display_settings_message(f"With SUSTAIN, you saved {percentage_saved:.2f}% more tokens compared to traditional AI!")
            self.entry.delete(0, tk.END)
            
            # Update token savings
            self.message_count += 1
            self.total_percentage_saved += percentage_saved
            average_savings = self.total_percentage_saved / self.message_count
            self.token_savings_label.config(text=f"Average token savings: {average_savings:.2f}%. Thank you for going green!")

    # Display a message in the chat area
    def display_message(self, message):
        self.chat_area.config(state='normal')
        self.chat_area.insert(tk.END, message + "\n")
        self.chat_area.config(state='disabled')
        self.chat_area.yview(tk.END)

    # Display a settings message in the chat area
    def display_settings_message(self, message):
        self.chat_area.config(state='normal')
        self.chat_area.insert(tk.END, message + "\n", "grey")
        self.chat_area.tag_config("grey", foreground="grey")
        self.chat_area.config(state='disabled')
        self.chat_area.yview(tk.END)

# Run the chat application
if __name__ == "__main__":
    root = tk.Tk()
    app = ChatApp(root)
    root.mainloop()