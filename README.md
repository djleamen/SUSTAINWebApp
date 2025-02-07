# 🌱 SUSTAIN: The Environmentally-Friendly AI Wrapper 🌱
![SUSTAIN Logo](https://github.com/user-attachments/assets/bbb7337a-dcd5-4dd6-bded-3a264c41af46)

## Overview
SUSTAIN is an environmentally-friendly, token-optimized AI wrapper designed to reduce compute costs and increase productivity. By filtering out irrelevant words and phrases from prompts and limiting responses to essential outputs, SUSTAIN minimizes the number of tokens sent to and received from the AI, saving energy and boosting performance.

Our mission is to deliver a sustainable, high-efficiency alternative to major large language models (LLMs) while maintaining powerful AI-driven results.

---

## Why SUSTAIN?

### **Environmental Sustainability**
- Traditional AI systems expend significant energy processing large amounts of token data, much of which is redundant or irrelevant (e.g., greetings, fillers, politeness).
- SUSTAIN significantly reduces token usage, minimizing the carbon footprint of AI queries.
- By promoting shorter, optimized inputs and outputs, SUSTAIN contributes to a greener AI ecosystem.

### **Enhanced Productivity**
- Get results faster with condensed, actionable responses.
- Eliminate unnecessary verbose outputs by default, with the option to expand details when needed.
- Integrate seamlessly with task management tools like **Notion**, **Trello**, and **Slack** for productivity-boosting workflows.

---

## Features

### **1. Token Optimization Pipeline**
- Preprocesses user prompts to filter out unnecessary words (e.g., "Hello," "Thank you," etc.) and retain only the core intent.
- Example Conversion:  
  - **User Input:** "Hello, could you brainstorm a list of traits a leader might have? Thank you!"  
  - **Optimized Input:** "list traits - leader"

### **2. Short-Form AI Responses**
- Limits responses to concise, actionable outputs using optimized `max_tokens` settings.
- Example Output:
  - **Input:** "Can you list the traits of a leader?" 
    - Refined input: "list traits - leader" 
  - **Output:** "Integrity, vision, empathy, resilience, communication"

### **3. Caching for Repeated Queries**
- Frequently requested tasks (like summarizations or brainstorming lists) are cached to avoid redundant API calls.
- Improves speed and reduces token waste.

### **4. Customizable Prompt and Response Lengths**
- Allow users to toggle between brief (default) and expanded responses, based on task needs.

### **5. Environmentally-Aware Feedback**
- Track token savings and display eco-friendly metrics to users, e.g., "This request saved 30% of token usage compared to traditional AI!"

---

## Installation
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/SUSTAIN.git
   cd sustain
   ```

2. **Set Up Environment:**
   - Install dependencies using pip:
     ```bash
     pip install -r requirements.txt
     ```

3. **Set Your API Key:**
   - Add your OpenAI API key to an `.env` file or directly to the config.
     ```
     OPENAI_API_KEY=your_openai_api_key
     ```

4. **Run SUSTAIN:**
   ```bash
   python main.py
   ```

---

## Running the Chat GUI

To launch the chat GUI where you can interact with SUSTAIN directly:

1. **Ensure you have installed all dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Add the SUSTAIN logo:**
   - Place the `sustain_logo.png` file in the same directory as `chat_gui.py`.

3. **Run the chat GUI:**
   ```bash
   python chat_gui.py
   ```

This will open a window where you can input your queries and receive responses from SUSTAIN.

---

## Usage Example
```python
from sustain import SUSTAIN

# Initialize SUSTAIN
sustain = SUSTAIN(api_key="your_openai_api_key")

# Provide a verbose user input
response = sustain.get_response("Hello, could you please brainstorm some key traits a leader should have?")

# Output
print(response)  # Returns a token-efficient response: "Integrity, vision, empathy, resilience"
```

---

## Configuration
SUSTAIN offers flexible configurations to suit different workflows:
- **Max Tokens:** Set the maximum response length.
- **Summarization Level:** Control how much context is trimmed from the user input.
- **Caching Duration:** Define how long responses are stored to minimize repeat API calls.

---

## Roadmap
- [ ] Integrate with task management tools (Notion, Trello, Slack)
- [ ] Implement dynamic summarization based on context length
- [ ] Develop a browser extension for on-the-go token optimization
- [ ] Provide additional eco-feedback on overall token savings

---

## Contributing
To contribute:
1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Submit a pull request.

---

## Contact
For questions or suggestions, feel free to reach out to us:
- **Project Team:** sustain-team@example.com

Let’s build a more sustainable AI future together!
