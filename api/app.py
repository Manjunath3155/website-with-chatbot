import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

app = Flask(__name__)
CORS(app)

model = genai.GenerativeModel('gemini-2.5-flash-preview-04-17')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    response = model.generate_content(user_message)
    return jsonify({'reply': response.text})

if __name__ == '__main__':
    app.run(debug=True)





#GEMINI_API_KEY