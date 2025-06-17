#!/bin/bash

echo "🎨 AI Character Creator - Local GPU Image Generation Setup"
echo "========================================================"

# Check if GPU is available
if command -v nvidia-smi &> /dev/null; then
    echo "✅ NVIDIA GPU detected:"
    nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits
else
    echo "⚠️  NVIDIA GPU not detected. You can still use CPU-based generation."
fi

echo ""
echo "This script will help you set up local GPU image generation options:"
echo ""
echo "1. 🖥️  Automatic1111 Stable Diffusion WebUI (Recommended)"
echo "2. 🎛️  ComfyUI (Advanced node-based interface)"
echo "3. 🔧 Stable Diffusion API Server"
echo ""

read -p "Which option would you like to set up? (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "🖥️ Setting up Automatic1111 Stable Diffusion WebUI..."
        echo ""
        echo "Installation steps:"
        echo "1. Clone the repository:"
        echo "   git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git"
        echo "   cd stable-diffusion-webui"
        echo ""
        echo "2. Download a model (e.g., Stable Diffusion 1.5):"
        echo "   wget -O models/Stable-diffusion/v1-5-pruned-emaonly.safetensors \\"
        echo "   https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.safetensors"
        echo ""
        echo "3. Start with API enabled:"
        echo "   ./webui.sh --api --listen"
        echo ""
        echo "4. The WebUI will be available at: http://localhost:7860"
        echo "   API endpoint: http://localhost:7860/sdapi/v1/"
        ;;
    2)
        echo ""
        echo "🎛️ Setting up ComfyUI..."
        echo ""
        echo "Installation steps:"
        echo "1. Clone the repository:"
        echo "   git clone https://github.com/comfyanonymous/ComfyUI.git"
        echo "   cd ComfyUI"
        echo ""
        echo "2. Install dependencies:"
        echo "   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118"
        echo "   pip install -r requirements.txt"
        echo ""
        echo "3. Download models:"
        echo "   cd models/checkpoints"
        echo "   wget https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors"
        echo ""
        echo "4. Start ComfyUI:"
        echo "   python main.py --listen"
        echo ""
        echo "5. ComfyUI will be available at: http://localhost:8188"
        ;;
    3)
        echo ""
        echo "🔧 Setting up Stable Diffusion API Server..."
        echo ""
        echo "Installation steps:"
        echo "1. Install the Stability AI Python client:"
        echo "   pip install stability-sdk"
        echo ""
        echo "2. Or use the DiffusionBee API (macOS):"
        echo "   Download from: https://diffusionbee.com/"
        echo ""
        echo "3. Configure the API endpoint in .env:"
        echo "   STABLE_DIFFUSION_URL=http://localhost:7861"
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📝 Configuration Notes:"
echo "• Make sure to update the .env file with the correct URLs"
echo "• Default ports: Automatic1111 (7860), ComfyUI (8188), SD API (7861)"
echo "• The AI Character Creator will automatically detect available services"
echo "• If no local services are running, it will fallback to OpenAI DALL-E"
echo ""
echo "🚀 Once your local GPU server is running, start the AI Character Creator:"
echo "   npm run dev"
echo ""
echo "Then navigate to the Image Generator tab and select your local GPU provider!"