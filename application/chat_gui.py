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
    def __init__(self, root, track_token_length):
        self.track_token_length = track_token_length
        self.root = root
        self.root.title("SUSTAIN Chat")
        self.root.geometry("800x800")
        self.message_history = []

        # Initialize token savings
        self.total_percentage_saved = 0
        self.message_count = 0

        # Create a top frame for the logo and info button
        self.top_frame = tk.Frame(root)
        self.top_frame.pack(fill=tk.X, pady=10)

        # Load and display the SUSTAIN logo
        original_logo = Image.open("sustain_logo.png")
        max_size = (200, 200)
        original_logo.thumbnail(max_size, Image.LANCZOS)
        self.logo = ImageTk.PhotoImage(original_logo)

        # Logo label
        self.logo_label = tk.Label(self.top_frame, image=self.logo)
        self.logo_label.pack(side=tk.LEFT, padx=10)

        # Info button at the top-right corner
        self.info_button = tk.Button(self.top_frame, text="?", command=self.show_info, font=("Courier", 14), width=3, bg="#d9d9d9")
        self.info_button.pack(side=tk.RIGHT, padx=20)

        # Create a chat area and entry field
        self.chat_area = scrolledtext.ScrolledText(root, wrap=tk.WORD, state='disabled', height=25, font=("Courier", 16))
        self.chat_area.pack(padx=20, pady=10, fill=tk.BOTH, expand=True)

        self.entry = tk.Entry(root, font=("Courier", 16))
        self.entry.pack(padx=20, pady=10, fill=tk.X, expand=True)
        self.entry.bind("<Return>", self.send_message)

        # Initialize the SUSTAIN API
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("API key not found. Please set the OPENAI_API_KEY environment variable.")
        self.sustain = SUSTAIN(api_key=self.api_key)
        self.display_settings_message("Welcome to SUSTAIN Chat! Ask me: \"What is SUSTAIN?\" to learn more.")

        # Add a label to display token percentage saved
        self.token_savings_label = tk.Label(root, text="Average token savings: 0.00%. Thank you for going green!", fg="green", font=("Courier", 16))
        self.token_savings_label.pack(pady=10)

        # Button for CO2 savings
        self.co2_button = tk.Button(root, text="Calculate CO2 Savings", command=self.calculate_co2_savings, font=("Courier", 16))
        self.co2_button.pack(pady=10)

    def send_message(self, event):
        user_input = self.entry.get()
        if user_input:
            self.message_history.append(user_input)
            self.display_message("You: " + user_input)

            if user_input.strip().lower() == "what is sustain?":
                response = (
                    "I am SUSTAIN, an environmentally-friendly, token-optimized AI wrapper designed to reduce compute costs "
                    "and increase productivity. I filter out irrelevant words and phrases from prompts and limit responses to "
                    "essential outputs, minimizing the number of tokens used."
                )
                percentage_saved = 0
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

            self.track_token_length(user_input)

    def display_message(self, message):
        self.chat_area.config(state='normal')
        self.chat_area.insert(tk.END, message + "\n")
        self.chat_area.config(state='disabled')
        self.chat_area.yview(tk.END)

    def display_settings_message(self, message):
        self.chat_area.config(state='normal')
        self.chat_area.insert(tk.END, message + "\n", "grey")
        self.chat_area.tag_config("grey", foreground="grey")
        self.chat_area.config(state='disabled')
        self.chat_area.yview(tk.END)

    def save_chat(self):
        chat_history = self.chat_area.get("1.0", tk.END).strip()
        if chat_history:
            file_path = filedialog.asksaveasfilename(defaultextension=".txt", filetypes=[("Text files", "*.txt"), ("All files", "*.*")])
            if file_path:
                with open(file_path, "w") as file:
                    file.write(chat_history)
                self.display_settings_message(f"Chat history saved to {file_path}")

    def calculate_co2_savings(self):
        kwh_per_token_saved = 0.0001
        co2_per_kwh_saved = 0.7

        total_tokens_saved = sum(self.sustain.count_tokens(msg) * (self.total_percentage_saved / 100) for msg in self.message_history)

        total_kwh_saved = total_tokens_saved * kwh_per_token_saved * 365
        total_co2_saved = (total_kwh_saved * co2_per_kwh_saved) / 1_000

        message = (
            f"If you continue using SUSTAIN at this pace for a year, you will have saved approximately {total_kwh_saved:.4f} "
            f"kWh of power, reducing {total_co2_saved:.4f} metric tons of CO2 emissions! Thank you for making a difference!"
        )
        self.display_settings_message(message)

    def show_info(self):
        info_window = tk.Toplevel(self.root)
        info_window.title("Information")
        info_window.geometry("600x400")

        # Scrollable text widget
        info_text = (
            "Welcome to SUSTAIN Chat!\n"
            "How to use:\n"
            "  1. Type your message in the text box at the bottom of the window.\n"
            "  2. Press Enter to send your message to SUSTAIN.\n"
            "  3. SUSTAIN will respond with an optimized message.\n\n"

            "FAQs:\n"
            "What is a token?\n"
            "  A token is a unit of text that the AI processes. Tokens can be as short as one character or as long as one word.\n\n"

            "Ethics Policy:\n"
            "  We follow OpenAI's ethics policy, ensuring that our AI is used responsibly and ethically. "
            "We prioritize user privacy and data security.\n\n"

            "What we cut out and why:\n"
            "  We remove unnecessary words and phrases to optimize the text and reduce the number of tokens used. "
            "This helps in reducing compute costs and environmental impact."
        )

        # Add scrollable text box
        text_widget = tk.Text(info_window, wrap=tk.WORD, font=("Courier", 12), padx=15, pady=10, bg="#f4f4f4", relief=tk.FLAT)
        text_widget.insert(tk.END, info_text)
        text_widget.config(state='disabled')  # Make text read-only

        # Scrollbar configuration
        scrollbar = tk.Scrollbar(info_window, command=text_widget.yview)
        text_widget['yscrollcommand'] = scrollbar.set

        # Packing widgets
        text_widget.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

# Run the chat application
if __name__ == "__main__":
    root = tk.Tk()
    
    def dummy_track_token_length(user_input):
        pass
    
    app = ChatApp(root, dummy_track_token_length)
    root.mainloop()