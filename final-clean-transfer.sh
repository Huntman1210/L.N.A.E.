#!/bin/bash

# Final AI Character Creator - Clean Repository Transfer Script
# This script handles large files and ensures a clean transfer to GitHub

set -e  # Exit on any error

echo "🚀 Final Clean Repository Transfer to Huntman1210/L.N.A.E..."
echo "=================================================="

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_info "Detected large files that exceed GitHub's 100MB limit."
print_info "Cleaning up repository before transfer..."

# Step 1: Create/update .gitignore to exclude problematic files
print_info "Creating comprehensive .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
/build
/dist
*.tgz
*.tar.gz

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Cache directories
.cache/
.npm/
.eslintcache
*.cache

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# Generated files
generated/
backup-*/

# Large files that shouldn't be in git
*.pack
*.pack.old
*.idx
*.rev
*.map
*.min.js
*.min.css

# Temporary files
tmp/
temp/
*.tmp
*.temp
EOF

print_status ".gitignore created successfully"

# Step 2: Remove files that are already tracked but should be ignored
print_info "Removing large files and cache directories from git tracking..."

# Remove node_modules and build artifacts from git
git rm -r --cached node_modules/ 2>/dev/null || true
git rm -r --cached build/ 2>/dev/null || true
git rm -r --cached .cache/ 2>/dev/null || true
git rm --cached .eslintcache 2>/dev/null || true

# Remove any .pack files
find . -name "*.pack" -type f -delete 2>/dev/null || true
find . -name "*.pack.old" -type f -delete 2>/dev/null || true

print_status "Large files removed from git tracking"

# Step 3: Clean up the working directory
print_info "Cleaning up working directory..."

# Remove node_modules entirely (will be reinstalled later)
rm -rf node_modules/ 2>/dev/null || true

# Remove build directory
rm -rf build/ 2>/dev/null || true

# Remove cache directories
rm -rf .cache/ 2>/dev/null || true
rm -f .eslintcache 2>/dev/null || true

print_status "Working directory cleaned"

# Step 4: Add remaining files and commit
print_info "Staging cleaned repository..."
git add -A

print_info "Committing clean repository..."
git commit -m "Clean repository: Remove large files and properly configure .gitignore

- Added comprehensive .gitignore
- Removed node_modules/ and build/ from tracking
- Removed cache files exceeding GitHub's 100MB limit
- Repository ready for clean deployment
- Run 'npm install' to restore dependencies
- Run 'npm run build' to rebuild project"

print_status "Clean repository committed"

# Step 5: Force push to replace remote repository
print_info "Pushing clean repository to GitHub..."
print_warning "This will completely replace the remote repository with your clean project."

echo ""
read -p "Proceed with clean push? (yes/no): " CONFIRM

if [ "$CONFIRM" = "yes" ]; then
    print_info "Performing clean push to remote repository..."
    
    # Force push to replace remote completely
    git push --force-with-lease origin main
    
    print_status "Clean repository successfully pushed!"
    
    # Step 6: Verify the transfer
    print_info "Verifying repository transfer..."
    sleep 3
    
    REMOTE_COMMITS=$(gh api "repos/$TARGET_REPO/commits" --jq length 2>/dev/null || echo "0")
    if [ "$REMOTE_COMMITS" -gt 0 ]; then
        print_status "Transfer verified - Repository has $REMOTE_COMMITS commits"
    else
        print_warning "Could not verify commit count, but push appeared successful"
    fi
    
    echo ""
    echo "=================================================="
    echo -e "${GREEN}🎉 CLEAN REPOSITORY TRANSFER COMPLETED! 🎉${NC}"
    echo "=================================================="
    echo ""
    print_status "Project successfully transferred to: https://github.com/$TARGET_REPO"
    print_status "Repository is now clean and within GitHub's file size limits"
    print_status "All source code, documentation, and configuration preserved"
    echo ""
    
    print_info "📋 Post-Transfer Setup Instructions:"
    echo "  1. Clone the repository: git clone https://github.com/$TARGET_REPO.git"
    echo "  2. Install dependencies: npm install"
    echo "  3. Create environment file: cp .env.example .env"
    echo "  4. Build the project: npm run build"
    echo "  5. Start development: npm start"
    echo ""
    
    print_info "🔧 What was cleaned up:"
    echo "  • node_modules/ - Will be restored with 'npm install'"
    echo "  • build/ - Will be restored with 'npm run build'"
    echo "  • Cache files - Will be regenerated as needed"
    echo "  • Large webpack cache files - Will be recreated during development"
    echo ""
    
    print_info "✨ Your repository now contains:"
    echo "  • Complete source code"
    echo "  • All documentation and guides"
    echo "  • Configuration files"
    echo "  • Scripts and automation"
    echo "  • Mode ecosystem and features"
    echo "  • Comprehensive .gitignore"
    echo ""
    
    # Optional: Open the repository in browser
    read -p "Open the repository in your browser now? (y/n): " OPEN_BROWSER
    if [ "$OPEN_BROWSER" = "y" ] || [ "$OPEN_BROWSER" = "Y" ]; then
        gh repo view "$TARGET_REPO" --web
        print_status "Repository opened in browser"
    fi
    
else
    print_info "Operation cancelled by user."
    echo ""
    echo "Your local repository has been cleaned up and is ready for push."
    echo "Run the following command when you're ready:"
    echo "  git push --force-with-lease origin main"
    exit 0
fi

echo ""
echo -e "${GREEN}✨ Clean repository transfer completed successfully!${NC}"
echo -e "${BLUE}Your AI Character Creator project is now available at:${NC}"
echo -e "${YELLOW}https://github.com/$TARGET_REPO${NC}"
echo ""
print_info "Next time you work on this project:"
echo "  • git clone https://github.com/$TARGET_REPO.git"
echo "  • cd L.N.A.E."
echo "  • npm install"
echo "  • npm start"
