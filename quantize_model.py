import onnx
from onnxruntime.quantization import quantize_dynamic, QuantType

def quantize_onnx_model():
    print("Loading original ONNX model...")
    model_path = "public/onnx_model/model.onnx"
    quantized_model_path = "public/onnx_model/model_quantized.onnx"
    
    # Quantize the model
    print("Quantizing model...")
    quantize_dynamic(
        model_path,
        quantized_model_path,
        weight_type=QuantType.QUInt8,
        optimize_model=True
    )
    
    # Print size comparison
    import os
    original_size = os.path.getsize(model_path) / (1024 * 1024)
    quantized_size = os.path.getsize(quantized_model_path) / (1024 * 1024)
    
    print(f"Original model size: {original_size:.2f} MB")
    print(f"Quantized model size: {quantized_size:.2f} MB")
    print(f"Size reduction: {((original_size - quantized_size) / original_size) * 100:.2f}%")

if __name__ == "__main__":
    quantize_onnx_model() 