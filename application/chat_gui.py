import os
import tkinter as tk
from tkinter import scrolledtext, PhotoImage
from dotenv import load_dotenv
from sustain import SUSTAIN
from PIL import Image, ImageTk  # Add this import

# Load environment variables from .env file
load_dotenv()

class ChatApp:
    def __init__(self, root):
        self.root = root
        self.root.title("SUSTAIN Chat")
        
        # Resize SUSTAIN logo while maintaining aspect ratio
        original_logo = Image.open("sustain_logo.png")
        max_size = (100, 100)
        original_logo.thumbnail(max_size, Image.LANCZOS)  # Maintain aspect ratio
        self.logo = ImageTk.PhotoImage(original_logo)
        
        self.logo_label = tk.Label(root, image=self.logo)
        self.logo_label.pack(pady=10)
        
        self.chat_area = scrolledtext.ScrolledText(root, wrap=tk.WORD, state='disabled', height=20)
        self.chat_area.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)
        
        self.entry = tk.Entry(root)
        self.entry.pack(padx=10, pady=10, fill=tk.X, expand=True)
        self.entry.bind("<Return>", self.send_message)
        
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("API key not found. Please set the OPENAI_API_KEY environment variable.")
        
        self.sustain = SUSTAIN(api_key=self.api_key)
        
    def send_message(self, event):
        user_input = self.entry.get()
        if user_input:
            self.display_message("You: " + user_input)
            response, percentage_saved = self.sustain.get_response(user_input)
            self.display_message("\nSUSTAIN: " + response)
            self.display_token_saving_message(f"With SUSTAIN, you saved {percentage_saved:.2f}% more tokens compared to traditional AI!")
            self.entry.delete(0, tk.END)

    def display_message(self, message):
        self.chat_area.config(state='normal')
        self.chat_area.insert(tk.END, message + "\n")
        self.chat_area.config(state='disabled')
        self.chat_area.yview(tk.END)

    def display_token_saving_message(self, message):
        self.chat_area.config(state='normal')
        self.chat_area.insert(tk.END, message + "\n", "grey")
        self.chat_area.tag_config("grey", foreground="grey")
        self.chat_area.config(state='disabled')
        self.chat_area.yview(tk.END)

if __name__ == "__main__":
    root = tk.Tk()
    app = ChatApp(root)
    root.mainloop()