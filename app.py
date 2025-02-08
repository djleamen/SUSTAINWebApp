from flask import Flask, render_template, request, jsonify
from sustain import SUSTAIN
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='static')

# Initialize the SUSTAIN API
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("API key not found. Please set the OPENAI_API_KEY environment variable.")
sustain = SUSTAIN(api_key=api_key)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    if user_input:
        response, percentage_saved = sustain.get_response(user_input)
        return jsonify({
            'response': response,
            'percentage_saved': percentage_saved
        })
    return jsonify({'error': 'No input provided'}), 400

if __name__ == '__main__':
    app.run(debug=True)