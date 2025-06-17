#!/bin/bash

# AI Character Creator - Repository Transfer Automation Script
# This script automates the process of transferring the project to Huntman1210/L.N.A.E. repository

set -e  # Exit on any error

echo "🚀 Starting automated repository transfer to Huntman1210/L.N.A.E..."
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

# Step 1: Check if we're in the right directory
print_info "Checking current directory..."
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    print_error "This doesn't appear to be the AI Character Creator project directory"
    exit 1
fi
print_status "In correct project directory"

# Step 2: Check Git status
print_info "Checking Git repository status..."
if [ ! -d ".git" ]; then
    print_error "No Git repository found. Initializing..."
    git init
    git add .
    git commit -m "Initial commit"
fi
print_status "Git repository confirmed"

# Step 3: Check GitHub CLI authentication
print_info "Checking GitHub CLI authentication..."
if ! gh auth status >/dev/null 2>&1; then
    print_warning "GitHub CLI not authenticated. Please authenticate first:"
    echo "Run: gh auth login"
    echo "Then run this script again."
    exit 1
fi
print_status "GitHub CLI authenticated"

# Step 4: Get current user
GITHUB_USER=$(gh api user --jq .login)
print_info "GitHub user: $GITHUB_USER"

# Step 5: Check if target repository exists
TARGET_REPO="Huntman1210/L.N.A.E."
print_info "Checking if repository $TARGET_REPO exists..."

if gh repo view "$TARGET_REPO" >/dev/null 2>&1; then
    print_status "Repository $TARGET_REPO exists"
    REPO_EXISTS=true
else
    print_warning "Repository $TARGET_REPO does not exist"
    REPO_EXISTS=false
fi

# Step 6: Create repository if it doesn't exist
if [ "$REPO_EXISTS" = false ]; then
    print_info "Creating repository $TARGET_REPO..."
    read -p "Do you want to create the repository as public or private? (public/private): " VISIBILITY
    
    if [ "$VISIBILITY" = "public" ]; then
        gh repo create "$TARGET_REPO" --public --description "L.N.A.E - AI Character Creator Project"
    else
        gh repo create "$TARGET_REPO" --private --description "L.N.A.E - AI Character Creator Project"
    fi
    print_status "Repository created successfully"
fi

# Step 7: Commit any uncommitted changes
print_info "Committing any uncommitted changes..."
if ! git diff --quiet || ! git diff --cached --quiet; then
    git add -A
    git commit -m "Pre-transfer commit: $(date '+%Y-%m-%d %H:%M:%S')" || true
    print_status "Changes committed"
else
    print_status "No uncommitted changes found"
fi

# Step 8: Configure remote
print_info "Configuring remote repository..."
REMOTE_URL="https://github.com/$TARGET_REPO"

if git remote get-url origin >/dev/null 2>&1; then
    print_info "Updating existing origin remote..."
    git remote set-url origin "$REMOTE_URL"
else
    print_info "Adding new origin remote..."
    git remote add origin "$REMOTE_URL"
fi
print_status "Remote configured: $REMOTE_URL"

# Step 9: Get default branch of remote repository
print_info "Checking remote repository default branch..."
DEFAULT_BRANCH=$(gh repo view "$TARGET_REPO" --json defaultBranchRef --jq .defaultBranchRef.name)
CURRENT_BRANCH=$(git branch --show-current)

print_info "Remote default branch: $DEFAULT_BRANCH"
print_info "Current local branch: $CURRENT_BRANCH"

# Step 10: Handle branch alignment
if [ "$CURRENT_BRANCH" != "$DEFAULT_BRANCH" ]; then
    print_info "Aligning local branch with remote default branch..."
    
    # Check if we have commits
    if git rev-parse --verify HEAD >/dev/null 2>&1; then
        # We have commits, rename the branch
        git branch -m "$CURRENT_BRANCH" "$DEFAULT_BRANCH"
        print_status "Renamed local branch from '$CURRENT_BRANCH' to '$DEFAULT_BRANCH'"
    else
        # No commits yet, just checkout to the default branch
        git checkout -b "$DEFAULT_BRANCH"
        print_status "Created and switched to '$DEFAULT_BRANCH' branch"
    fi
fi

# Step 11: Check if remote has content
print_info "Checking remote repository content..."
REMOTE_EMPTY=true
if gh api "repos/$TARGET_REPO/contents" >/dev/null 2>&1; then
    REMOTE_EMPTY=false
    print_warning "Remote repository has existing content"
else
    print_status "Remote repository is empty"
fi

# Step 12: Push to remote repository
print_info "Pushing to remote repository..."

if [ "$REMOTE_EMPTY" = true ]; then
    # Remote is empty, direct push
    print_info "Performing initial push to empty repository..."
    git push -u origin "$DEFAULT_BRANCH"
    print_status "Initial push completed successfully"
else
    # Remote has content, need to handle conflicts
    print_warning "Remote repository has content. Attempting to merge..."
    
    # Try to pull and merge
    print_info "Fetching remote changes..."
    git fetch origin
    
    # Check if there are conflicts
    if git merge origin/$DEFAULT_BRANCH --no-edit >/dev/null 2>&1; then
        print_status "Automatic merge successful"
        git push origin "$DEFAULT_BRANCH"
        print_status "Push completed successfully"
    else
        print_warning "Merge conflicts detected. Manual resolution required."
        echo ""
        echo "Please resolve the merge conflicts manually:"
        echo "1. Run: git status"
        echo "2. Edit conflicted files"
        echo "3. Run: git add <resolved-files>"
        echo "4. Run: git commit"
        echo "5. Run: git push origin $DEFAULT_BRANCH"
        echo ""
        echo "Or, if you want to overwrite the remote repository:"
        echo "Run: git push --force-with-lease origin $DEFAULT_BRANCH"
        exit 1
    fi
fi

# Step 13: Verify the transfer
print_info "Verifying repository transfer..."
sleep 2  # Give GitHub a moment to process

REMOTE_COMMITS=$(gh api "repos/$TARGET_REPO/commits" --jq length)
if [ "$REMOTE_COMMITS" -gt 0 ]; then
    print_status "Repository transfer verified - $REMOTE_COMMITS commits found"
else
    print_error "Repository transfer verification failed"
    exit 1
fi

# Step 14: Display summary
echo ""
echo "=================================================="
echo -e "${GREEN}🎉 REPOSITORY TRANSFER COMPLETED SUCCESSFULLY! 🎉${NC}"
echo "=================================================="
echo ""
print_status "Project successfully transferred to: https://github.com/$TARGET_REPO"
print_status "Local repository configured with remote origin"
print_status "All files and commit history preserved"
echo ""
print_info "Next steps:"
echo "  • Visit your repository: https://github.com/$TARGET_REPO"
echo "  • Update README.md if needed"
echo "  • Configure branch protection rules if desired"
echo "  • Set up GitHub Actions/workflows if needed"
echo ""
print_info "Your local repository is now connected to the remote repository."
print_info "You can continue working and use 'git push' to sync changes."
echo ""

# Optional: Open the repository in browser
read -p "Would you like to open the repository in your browser? (y/n): " OPEN_BROWSER
if [ "$OPEN_BROWSER" = "y" ] || [ "$OPEN_BROWSER" = "Y" ]; then
    gh repo view "$TARGET_REPO" --web
fi

echo -e "${GREEN}✨ Transfer automation completed!${NC}"
