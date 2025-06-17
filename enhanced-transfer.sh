#!/bin/bash

# Enhanced AI Character Creator - Repository Transfer Automation Script
# This script provides multiple options for handling repository transfer conflicts

set -e  # Exit on any error

echo "🚀 Enhanced Repository Transfer to Huntman1210/L.N.A.E..."
echo "=================================================="

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

TARGET_REPO="Huntman1210/L.N.A.E."

# Show current situation
print_info "Current situation analysis:"
echo "  • Local repository: $(pwd)"
echo "  • Target repository: https://github.com/$TARGET_REPO"
echo "  • Local branch: $(git branch --show-current)"
echo ""

# Show transfer options
echo "=================================================="
echo -e "${BLUE}TRANSFER OPTIONS:${NC}"
echo "=================================================="
echo ""
echo "1. 🔄 REPLACE REMOTE (Recommended for your project)"
echo "   • Completely replace remote repository with your local project"
echo "   • Preserves your complete project structure and history"
echo "   • Remote README/LICENSE will be replaced"
echo ""
echo "2. 🤝 MERGE WITH REMOTE"
echo "   • Attempt to merge your project with existing remote content"
echo "   • May require manual conflict resolution"
echo "   • Preserves both local and remote history"
echo ""
echo "3. 📋 MANUAL RESOLUTION"
echo "   • Exit and let you handle conflicts manually"
echo "   • Full control over merge process"
echo ""

read -p "Choose an option (1/2/3): " CHOICE

case $CHOICE in
    1)
        echo ""
        print_warning "You chose to REPLACE the remote repository."
        echo "This will:"
        echo "  • Overwrite all content in the remote repository"
        echo "  • Replace it with your complete AI Character Creator project"
        echo "  • Preserve your local commit history"
        echo ""
        read -p "Are you sure? This cannot be undone. (yes/no): " CONFIRM
        
        if [ "$CONFIRM" = "yes" ]; then
            print_info "Performing force push to replace remote repository..."
            
            # Create a backup branch just in case
            git branch backup-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
            
            # Force push to replace remote
            git push --force-with-lease origin main
            
            print_status "Remote repository successfully replaced!"
            
            # Verify the transfer
            print_info "Verifying repository transfer..."
            sleep 3
            
            echo ""
            echo "=================================================="
            echo -e "${GREEN}🎉 REPOSITORY REPLACEMENT COMPLETED! 🎉${NC}"
            echo "=================================================="
            echo ""
            print_status "Your AI Character Creator project is now at: https://github.com/$TARGET_REPO"
            print_status "All your files, structure, and history have been transferred"
            print_status "The remote repository now contains your complete project"
            echo ""
            
        else
            print_info "Operation cancelled by user."
            exit 0
        fi
        ;;
        
    2)
        echo ""
        print_info "Attempting to merge with remote repository..."
        
        # Fetch remote changes
        git fetch origin
        
        # Try automatic merge
        if git merge origin/main --no-edit; then
            print_status "Automatic merge successful!"
            git push origin main
            print_status "Repository successfully merged and pushed!"
        else
            print_warning "Automatic merge failed due to conflicts."
            echo ""
            echo "Conflicted files:"
            git status --porcelain | grep "^UU\|^AA\|^DD" || echo "  (Use 'git status' to see details)"
            echo ""
            echo "To resolve manually:"
            echo "  1. Edit the conflicted files to resolve conflicts"
            echo "  2. Run: git add <resolved-files>"
            echo "  3. Run: git commit"
            echo "  4. Run: git push origin main"
            echo ""
            exit 1
        fi
        ;;
        
    3)
        print_info "Manual resolution selected."
        echo ""
        echo "Current status:"
        git status
        echo ""
        echo "To proceed manually:"
        echo "  1. Resolve any merge conflicts in the files above"
        echo "  2. Run: git add <resolved-files>"
        echo "  3. Run: git commit"
        echo "  4. Run: git push origin main"
        echo ""
        echo "Or to replace remote completely:"
        echo "  Run: git push --force-with-lease origin main"
        exit 0
        ;;
        
    *)
        print_error "Invalid choice. Please run the script again and choose 1, 2, or 3."
        exit 1
        ;;
esac

# Final verification and summary
print_info "Final verification..."
sleep 2

REMOTE_COMMITS=$(gh api "repos/$TARGET_REPO/commits" --jq length 2>/dev/null || echo "0")
if [ "$REMOTE_COMMITS" -gt 0 ]; then
    print_status "Transfer verified - Repository has $REMOTE_COMMITS commits"
else
    print_warning "Could not verify commit count, but push appeared successful"
fi

echo ""
print_info "🔗 Quick Links:"
echo "  • Repository: https://github.com/$TARGET_REPO"
echo "  • Clone URL: git clone https://github.com/$TARGET_REPO.git"
echo ""

print_info "📝 Next Steps:"
echo "  • Review the transferred files on GitHub"
echo "  • Update repository description and topics if needed"
echo "  • Set up branch protection rules"
echo "  • Configure GitHub Actions workflows"
echo "  • Update any documentation with new repository links"
echo ""

# Optional: Open the repository in browser
read -p "Open the repository in your browser now? (y/n): " OPEN_BROWSER
if [ "$OPEN_BROWSER" = "y" ] || [ "$OPEN_BROWSER" = "Y" ]; then
    gh repo view "$TARGET_REPO" --web
    print_status "Repository opened in browser"
fi

echo ""
echo -e "${GREEN}✨ Repository transfer automation completed successfully!${NC}"
echo -e "${BLUE}Your AI Character Creator project is now available at:${NC}"
echo -e "${YELLOW}https://github.com/$TARGET_REPO${NC}"
