# Ollama Setup for Local AI Processing

This portfolio website now uses Ollama for local AI processing instead of requiring OpenAI API keys.

## Quick Setup

### 1. Install Ollama
```bash
# On macOS
brew install ollama

# On Linux
curl -fsSL https://ollama.com/install.sh | sh

# On Windows
# Download from https://ollama.com/download/windows
```

### 2. Start Ollama Service
```bash
ollama serve
```

### 3. Pull a Small Language Model
```bash
# Recommended: Lightweight model (1.7GB)
ollama pull llama3.2:1b

# Alternative: Balanced model (2.0GB)
ollama pull llama3.2:3b

# For better quality (4.7GB)
ollama pull llama3.1:8b
```

### 4. Update the Model in Code (Optional)
If you want to use a different model, edit `server/services/ollama.ts`:
```typescript
// Change this line to your preferred model
model: 'llama3.2:1b', // or 'llama3.2:3b' or 'llama3.1:8b'
```

## How It Works

The portfolio website will:
1. **First try Ollama**: Connect to local Ollama API on port 11434
2. **Fallback gracefully**: If Ollama is not running, use intelligent fallback responses based on your portfolio data
3. **No external dependencies**: Everything works offline once set up

## Benefits

✅ **No API keys required** - Completely local processing
✅ **Privacy-focused** - Your data never leaves your machine  
✅ **Cost-free** - No usage charges or rate limits
✅ **Reliable fallback** - Works even without AI when Ollama is offline
✅ **Fast responses** - Local processing is typically faster than API calls

## Testing

1. Start your portfolio website
2. Click the chat button
3. Ask questions like:
   - "Tell me about Lakshmi's work experience"
   - "What are her key technical skills?"
   - "Describe her most impactful projects"

The AI will provide detailed, personalized responses about your professional background using the resume data built into the portfolio.

## Troubleshooting

**Chat responses seem generic?**
- Make sure Ollama is running: `ollama serve`
- Check if model is installed: `ollama list`
- Try pulling the model again: `ollama pull llama3.2:3b`

**Port conflicts?**
- Ollama uses port 11434 by default
- Check if anything is blocking this port

**Model not found errors?**
- Update the model name in `ollama.ts` to match what you have installed
- Run `ollama list` to see available models