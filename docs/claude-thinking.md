# Claude 3.7 Sonnet with Thinking Capabilities

This feature adds advanced thinking capabilities to the Claude 3.7 Sonnet model in your AI Character Creator project. Similar to how GitHub Copilot explains code, Claude 3.7 Sonnet can now show its thinking process when generating responses.

## Features

- **Step-by-step reasoning**: See how Claude approaches problems
- **Thinking visualization**: Access the model's internal reasoning
- **Enhanced creativity**: More thoughtful character creation
- **GitHub Copilot integration**: Similar usage patterns to Copilot

## Usage

### Basic Usage

```javascript
const orchestrator = new MultiModelOrchestrator();
await orchestrator.initialize();

const result = await orchestrator.generateResponseWithThinking(
  "Create a fantasy character with unique abilities", 
  "claude-3.7-sonnet"
);

console.log("Thinking Process:", result.thinking);
console.log("Response:", result.response);
```

### Command Line Tool

We've included a command-line debugging tool that lets you test the thinking capabilities:

```bash
# Run in mock mode (no API calls)
./claude-thinking.sh "Create a magical staff with time powers"

# Run with real API (requires API key)
./claude-thinking.sh --real-api "Create a magical staff with time powers"
```

## Debugging

If you encounter issues with the thinking capabilities:

1. **Mock Mode**: Use mock mode for testing functionality without API calls

   ```bash
   node debug-claude-thinking.js
   ```

2. **API Issues**: Check your Anthropic API key in the `.env` file

   ```plaintext
   ANTHROPIC_API_KEY=your-actual-key
   ```

3. **Testing**: Run the test suite to verify functionality

   ```bash
   node ./automation/models/test-claude-thinking.js
   ```

## Configuration

The thinking capabilities can be configured in `automation/config/usage-limits.js`:

```javascript
'claude-3.7-sonnet': {
  thinking: {
    enabled: true,
    showThinking: true,
    stepByStepReasoning: true,
    maxThinkingTokens: 4000,
    thinkingTimeout: 30000 // 30 seconds
  }
}
```

## GitHub Copilot Integration

The thinking capabilities are designed to complement GitHub Copilot:

- **Similar Usage Patterns**: Same rate limits and quotas as Copilot
- **Explanation Style**: Similar to how Copilot explains code
- **Integration**: Works alongside Copilot for a unified AI experience

## Example Thinking Output

```text
🧠 THINKING PROCESS:
Step 1: Analyze the request for a fantasy character
Step 2: Consider the game context and balance requirements
Step 3: Generate unique magical abilities that aren't overpowered
Step 4: Create a compelling backstory that explains these powers
Step 5: Design physical appearance that reflects the character's abilities
Step 6: Consider character development arc and roleplay opportunities
```

---

*This feature was added to align AI model usage with GitHub Copilot patterns.*
