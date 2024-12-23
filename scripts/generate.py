import sys
from transformers import pipeline

def generate_text(prompt):
    generator = pipeline("text-generation", model="gpt2")
    response = generator(prompt, max_length=100, num_return_sequences=1)
    return response[0]["generated_text"]

if __name__ == "__main__":
    # Get the prompt from command-line arguments
    prompt = sys.argv[1]
    print(generate_text(prompt))
