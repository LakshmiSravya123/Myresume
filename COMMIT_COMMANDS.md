# Git Commit Commands

Run these commands in your terminal to commit all changes to GitHub:

## Automated Option (Recommended)
Run the helper script to commit all changes automatically:
```bash
./git-commit-helper.sh
```

## Manual Option
Copy and paste these commands one by one:

### 1. Update LinkedIn URL
```bash
git add client/src/components/Navigation.tsx client/src/components/HeroSection.tsx client/src/components/ContactSection.tsx
git commit -m "Update LinkedIn URL to linkedin.com/in/lakshmisravyavedantham"
```

### 2. Update Resume
```bash
git add attached_assets/resume.pdf
git commit -m "Update resume to October 2025 version"
```

### 3. Update About Me Section
```bash
git add client/src/components/AboutSection.tsx
git commit -m "Update About Me section based on October 2025 resume"
```

### 4. Update Portfolio Data
```bash
git add server/services/portfolioData.ts
git commit -m "Update portfolio data with latest experience, projects, and skills"
```

### 5. Update AI Chatbot Responses
```bash
git add server/services/openai.ts
git commit -m "Update AI chatbot fallback responses with current information"
```

### 6. Add Helper Scripts
```bash
git add git-commit-helper.sh COMMIT_COMMANDS.md
git commit -m "Add git commit helper tools for organized commits"
```

## Push to GitHub
After all commits are done, push to your repository:
```bash
git push origin main
```

*Note: Replace `main` with your branch name if different*

---

## Quick All-in-One (If you prefer a single commit)
```bash
git add client/src/components/Navigation.tsx client/src/components/HeroSection.tsx client/src/components/ContactSection.tsx client/src/components/AboutSection.tsx server/services/portfolioData.ts server/services/openai.ts attached_assets/resume.pdf git-commit-helper.sh COMMIT_COMMANDS.md

git commit -m "Update portfolio with October 2025 resume information

- Update LinkedIn URL to linkedin.com/in/lakshmisravyavedantham
- Upload new October 2025 resume
- Update About Me section with professional experience
- Update portfolio data for AI chatbot with latest projects and skills
- Update AI fallback responses with current information
- Add git helper tools for organized commits"

git push origin main
```
