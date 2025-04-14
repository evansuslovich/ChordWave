from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch
import logging 
import re

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Load model and tokenizer
model_path = "/tmp/test-clm"
model = GPT2LMHeadModel.from_pretrained(model_path, use_safetensors=True)
tokenizer = GPT2Tokenizer.from_pretrained(model_path)


# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  # can be DEBUG, INFO, WARNING, ERROR, CRITICAL
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

    

def is_root(token):
    return re.match(r'^[A-G](#|b)?$', token)

def is_chord_type(token):
    return re.match(r'^(maj|min|m|dim|aug|add\d*|sus\d*|7|9|11|13)$', token)

def combine_chord_tokens(options):
    combined = []
    used_indices = set()

    for i, opt in enumerate(options):
        token = opt["token"]
        
        if i in used_indices:
            continue

        # If it's a root note, try to combine with the next token if it's a type
        if is_root(token):
            if i + 1 < len(options) and is_chord_type(options[i + 1]["token"]):
                next_opt = options[i + 1]
                combined.append({
                    "token": token + next_opt["token"],
                    "root": token,
                    "type": next_opt["token"],
                    "score": (opt["score"] + next_opt["score"]) / 2
                })
                used_indices.update([i, i + 1])
            else:
                combined.append({
                    "token": token,
                    "root": token,
                    "type": "",
                    "score": opt["score"]
                })
                used_indices.add(i)
        elif i not in used_indices and not is_chord_type(token):
            # fallback if it's a standalone weird token like "<"
            combined.append({
                "token": token,
                "root": "",
                "type": token,
                "score": opt["score"]
            })
            used_indices.add(i)

    return combined


@app.route('/options', methods=['POST'])
def options():
    data = request.get_json()
    text = data.get("text", "")
    logger.debug(f"Text: {text}")

    if not text:
        return jsonify({"error": "Text is required"}), 400

    inputs = tokenizer(text, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits[0, -1, :]
    top_k = 5
    top_probs = torch.topk(logits, k=top_k)
    logger.debug(top_probs)
    top_indices = top_probs.indices.tolist()
    top_scores = top_probs.values.tolist()

    top_tokens = [tokenizer.decode([idx]) for idx in top_indices]

    options = [
        {"id": idx, "token": token, "score": float(score)}
        for idx, token, score in zip(top_indices, top_tokens, top_scores)
    ]

    # Your existing logic here

    return jsonify({"options": combine_chord_tokens(options)})

if __name__ == "__main__":
    app.run(debug=True)
