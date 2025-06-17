#!/bin/bash

# GitHub Copilot Setup Script for VS Code
# This script helps set up and configure GitHub Copilot with your AI Character Creator

echo "🚀 Setting up GitHub Copilot integration..."
echo "================================================"

# Check if VS Code is installed
if ! command -v code &> /dev/null; then
    echo "❌ VS Code is not installed or not in PATH"
    echo "Please install VS Code first: https://code.visualstudio.com/"
    exit 1
fi

echo "✅ VS Code detected"

# Install GitHub Copilot extensions
echo "📦 Installing GitHub Copilot extensions..."

# Install main Copilot extension
code --install-extension GitHub.copilot --force
if [ $? -eq 0 ]; then
    echo "✅ GitHub Copilot extension installed"
else
    echo "⚠️  GitHub Copilot extension may already be installed"
fi

# Install Copilot Chat extension
code --install-extension GitHub.copilot-chat --force
if [ $? -eq 0 ]; then
    echo "✅ GitHub Copilot Chat extension installed"
else
    echo "⚠️  GitHub Copilot Chat extension may already be installed"
fi

# Create VS Code settings for optimal Copilot experience
echo "⚙️  Configuring VS Code settings..."

# Create or update VS Code user settings
VSCODE_SETTINGS_DIR="$HOME/.config/Code/User"
VSCODE_SETTINGS_FILE="$VSCODE_SETTINGS_DIR/settings.json"

# Create directory if it doesn't exist
mkdir -p "$VSCODE_SETTINGS_DIR"

# Backup existing settings
if [ -f "$VSCODE_SETTINGS_FILE" ]; then
    cp "$VSCODE_SETTINGS_FILE" "$VSCODE_SETTINGS_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    echo "📋 Backed up existing settings"
fi

# Create optimized settings for Copilot
cat > "$VSCODE_SETTINGS_FILE" << 'EOF'
{
    "github.copilot.enable": {
        "*": true,
        "plaintext": true,
        "markdown": true,
        "scminput": false
    },
    "github.copilot.inlineSuggest.enable": true,
    "github.copilot.chat.enabled": true,
    "editor.inlineSuggest.enabled": true,
    "editor.inlineSuggest.showToolbar": "onHover",
    "editor.suggest.insertMode": "insert",
    "editor.acceptSuggestionOnCommitCharacter": true,
    "editor.acceptSuggestionOnEnter": "on",
    "editor.tabCompletion": "on",
    "extensions.ignoreRecommendations": false,
    "workbench.startupEditor": "welcomePage",
    "terminal.integrated.enableMultiLinePasteWarning": false,
    "diffEditor.ignoreTrimWhitespace": false,
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000
}
EOF

echo "✅ VS Code settings configured for optimal Copilot experience"

# Create workspace settings for the AI Character Creator project
WORKSPACE_SETTINGS_DIR=".vscode"
WORKSPACE_SETTINGS_FILE="$WORKSPACE_SETTINGS_DIR/settings.json"

mkdir -p "$WORKSPACE_SETTINGS_DIR"

cat > "$WORKSPACE_SETTINGS_FILE" << 'EOF'
{
    "github.copilot.enable": {
        "javascript": true,
        "json": true,
        "markdown": true
    },
    "github.copilot.chat.enabled": true,
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll": true
    },
    "javascript.preferences.includePackageJsonAutoImports": "on",
    "typescript.preferences.includePackageJsonAutoImports": "on"
}
EOF

echo "✅ Workspace settings configured"

# Create keybindings for Copilot
KEYBINDINGS_FILE="$VSCODE_SETTINGS_DIR/keybindings.json"

cat > "$KEYBINDINGS_FILE" << 'EOF'
[
    {
        "key": "ctrl+shift+i",
        "command": "workbench.panel.chat.view.copilot.focus",
        "when": "!inChat"
    },
    {
        "key": "ctrl+alt+i",
        "command": "github.copilot.generate"
    },
    {
        "key": "tab",
        "command": "editor.action.inlineSuggest.commit",
        "when": "inlineSuggestionVisible && !editorTabMovesFocus"
    },
    {
        "key": "escape",
        "command": "editor.action.inlineSuggest.hide",
        "when": "inlineSuggestionVisible"
    }
]
EOF

echo "✅ Copilot keybindings configured"

echo ""
echo "🎉 GitHub Copilot setup complete!"
echo "================================================"
echo ""
echo "📋 Next Steps:"
echo "1. Restart VS Code to activate all extensions"
echo "2. Sign in to GitHub when prompted"
echo "3. Verify your Copilot subscription at: https://github.com/settings/copilot"
echo "4. Open any .js file to test Copilot suggestions"
echo ""
echo "🔧 Useful Commands:"
echo "- Ctrl+Shift+I: Open Copilot Chat"
echo "- Ctrl+Alt+I: Generate code with Copilot"
echo "- Tab: Accept Copilot suggestion"
echo "- Escape: Dismiss Copilot suggestion"
echo ""
echo "🚀 Your AI Character Creator is now optimized for GitHub Copilot!"
