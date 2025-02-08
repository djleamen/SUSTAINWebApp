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
from tkinter import scrolledtext, PhotoImage, filedialog
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
        self.root.geometry("800x600")  # Increase window size

        # Create a menu bar
        self.menu_bar = tk.Menu(self.root)
        self.root.config(menu=self.menu_bar)

        # Add a File menu with a Save option
        self.file_menu = tk.Menu(self.menu_bar, tearoff=0)
        self.menu_bar.add_cascade(label="File", menu=self.file_menu)
        self.file_menu.add_command(label="Save Chat", command=self.save_chat)
        
        # Add a Clear Chat option to the File menu
        self.file_menu.add_command(label="Clear Chat", command=self.clear_chat)

        # Load and display the SUSTAIN logo
        script_dir = os.path.dirname(__file__)
        original_logo = Image.open("sustain_logo.png")
        
        # Resize SUSTAIN logo while maintaining aspect ratio
        max_size = (200, 200)  # Increase logo size
        original_logo.thumbnail(max_size, Image.LANCZOS)
        self.logo = ImageTk.PhotoImage(original_logo)
        
        # Display SUSTAIN logo in the chat window
        self.logo_label = tk.Label(root, image=self.logo)
        self.logo_label.pack(pady=20)  # Increase padding
        
        # Create a chat area and entry field
        self.chat_area = scrolledtext.ScrolledText(root, wrap=tk.WORD, state='disabled', height=25, font=("Courier", 16))  # Change font to Courier and increase font size
        self.chat_area.pack(padx=20, pady=20, fill=tk.BOTH, expand=True)
        self.entry = tk.Entry(root, font=("Courier", 16))  # Change font to Courier and increase font size
        self.entry.pack(padx=20, pady=20, fill=tk.X, expand=True)
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
        self.token_savings_label = tk.Label(root, text="Average token savings: 0.00%. Thank you for going green!", fg="green", font=("Courier", 16))  # Change font to Courier and increase font size
        self.token_savings_label.pack(pady=10)

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
            self.display_settings_message(f"With SUSTAIN, you saved {percentage_saved:.2f}% more tokens compared to traditional AI!\n")
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

    # Save the chat history to a text file
    def save_chat(self):
        chat_history = self.chat_area.get("1.0", tk.END).strip()
        if chat_history:
            # Ask the user where to save the file
            file_path = filedialog.asksaveasfilename(defaultextension=".txt", 
                                                     filetypes=[("Text files", "*.txt"), ("All files", "*.*")])
            if file_path:
                with open(file_path, "w") as file:
                    file.write(chat_history)
                self.display_settings_message(f"Chat history saved to {file_path}")

    # Clear the chat history
    def clear_chat(self):
        self.chat_area.config(state='normal')
        self.chat_area.delete("1.0", tk.END)
        self.chat_area.config(state='disabled')
        self.display_settings_message("Chat history cleared.")

# Run the chat application
if __name__ == "__main__":
    root = tk.Tk()
    app = ChatApp(root)
    root.mainloop()