from transformers import AutoModelForCausalLM, AutoTokenizer
from transformers.onnx import export
import torch
import os

def convert_to_onnx():
    print("Loading model and tokenizer...")
    model = AutoModelForCausalLM.from_pretrained("philippelaban/keep_it_simple")
    tokenizer = AutoTokenizer.from_pretrained("philippelaban/keep_it_simple")
    
    # Create models directory if it doesn't exist
    os.makedirs("public/models", exist_ok=True)
    
    print("Converting to ONNX format...")
    export(
        model,
        tokenizer,
        "public/models/keep_it_simple.onnx",
        opset=12,
        input_names=["input"],
        output_names=["output"],
    )
    print("Conversion complete! Model saved to public/models/keep_it_simple.onnx")

if __name__ == "__main__":
    convert_to_onnx() 