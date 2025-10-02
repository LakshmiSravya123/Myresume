#!/bin/bash

# Git Commit Helper Script
# This script helps organize and commit all portfolio updates

echo "🚀 Portfolio Updates - Organized Git Commits"
echo "=============================================="
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

echo "📋 Changes Summary:"
git status --short
echo ""

# Function to commit with a message
commit_changes() {
    local files="$1"
    local message="$2"
    
    echo "📝 Committing: $message"
    git add $files
    git commit -m "$message"
    echo "✅ Done"
    echo ""
}

# Commit 1: Update LinkedIn URL across all components
echo "1️⃣  LinkedIn URL Update"
commit_changes "client/src/components/Navigation.tsx client/src/components/HeroSection.tsx client/src/components/ContactSection.tsx" "Update LinkedIn URL to linkedin.com/in/lakshmisravyavedantham"

# Commit 2: Update resume file
echo "2️⃣  Resume Update"
commit_changes "attached_assets/resume.pdf" "Update resume to October 2025 version"

# Commit 3: Update About Me section
echo "3️⃣  About Me Section Update"
commit_changes "client/src/components/AboutSection.tsx" "Update About Me section based on October 2025 resume"

# Commit 4: Update portfolio data for AI chatbot
echo "4️⃣  Portfolio Data Update"
commit_changes "server/services/portfolioData.ts" "Update portfolio data with latest experience, projects, and skills"

# Commit 5: Update OpenAI fallback responses
echo "5️⃣  AI Responses Update"
commit_changes "server/services/openai.ts" "Update AI chatbot fallback responses with current information"

# Commit 6: Add git helper script
echo "6️⃣  Git Helper Script"
commit_changes "git-commit-helper.sh" "Add git commit helper script for organized commits"

echo ""
echo "🎉 All commits completed successfully!"
echo ""
echo "📤 To push to GitHub, run:"
echo "   git push origin main"
echo ""
echo "   (or replace 'main' with your branch name)"
