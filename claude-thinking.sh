#!/bin/bash

# Wrapper script for debugging Claude 3.7 Sonnet with thinking capabilities

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}┌──────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  Claude 3.7 Sonnet with Thinking Debug   │${NC}"
echo -e "${BLUE}└──────────────────────────────────────────┘${NC}"
echo

# Check if .env file exists
if [ ! -f .env ]; then
  echo -e "${RED}Warning: .env file not found!${NC}"
  echo -e "${YELLOW}Creating a sample .env file...${NC}"
  
  cat > .env << EOL
# AI Character Creator Environment Variables
DEFAULT_MODEL=claude-3.7-sonnet
FALLBACK_MODEL=claude-3-sonnet
TEMPERATURE=0.7
MAX_TOKENS=4000

# API Keys (replace with your actual keys)
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key
GOOGLE_API_KEY=your-google-api-key
MISTRAL_API_KEY=your-mistral-api-key
EOL
  
  echo -e "${YELLOW}Sample .env file created. Please edit it to add your API keys before using real API mode.${NC}"
  echo
fi

# Parse command line arguments
USE_REAL_API=0
PROMPT=""

for arg in "$@"; do
  case $arg in
    --real-api)
      USE_REAL_API=1
      shift
      ;;
    *)
      if [ -z "$PROMPT" ]; then
        PROMPT="$arg"
      else
        PROMPT="$PROMPT $arg"
      fi
      ;;
  esac
done

# Default prompt if none provided
if [ -z "$PROMPT" ]; then
  PROMPT="Create a character for a fantasy RPG with unique magical abilities."
fi

# Display mode
if [ $USE_REAL_API -eq 1 ]; then
  echo -e "${RED}⚠️  REAL API MODE - This will use your Anthropic API credits${NC}"
  
  # Warn about API key
  if grep -q "sk-ant-your-anthropic-api-key" .env; then
    echo -e "${RED}Error: Default Anthropic API key detected in .env file.${NC}"
    echo -e "${RED}Please update your .env file with your actual Anthropic API key before using real API mode.${NC}"
    exit 1
  fi
  
  echo
  read -p "Are you sure you want to continue? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Exiting...${NC}"
    exit 0
  fi
  
  echo -e "${YELLOW}Running with real API...${NC}"
  NODE_OPTIONS=--no-warnings node debug-claude-thinking.js --real-api "$PROMPT"
else
  echo -e "${GREEN}Using mock mode - No API calls will be made${NC}"
  NODE_OPTIONS=--no-warnings node debug-claude-thinking.js "$PROMPT"
fi
