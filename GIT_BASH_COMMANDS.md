# Quick Git Bash Commands for Pushing to GitHub

Git is installed on your system, but it's not in Command Prompt's PATH. **Use Git Bash instead!**

## Step 1: Open Git Bash

1. Press `Win` key (Windows key)
2. Type "Git Bash"
3. Click on "Git Bash" application
4. A terminal window will open

## Step 2: Navigate to Your Project

In Git Bash, run:

```bash
cd /c/Users/kunle/vibe-code-projects-2026/auto-dealership-app
```

**Note**: In Git Bash, Windows paths use forward slashes and start with `/c/` instead of `C:\`

## Step 3: Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and GitHub email!

Verify:
```bash
git config --global user.name
git config --global user.email
```

## Step 4: Push to GitHub

```bash
git add .
git commit -m "Initial commit: Auto Dealership App"
git remote add origin https://github.com/kunletemowo/auto-dealership-app.git
git push -u origin main
```

**Note**: If you get "remote origin already exists", remove it first:
```bash
git remote remove origin
git remote add origin https://github.com/kunletemowo/auto-dealership-app.git
```

## Complete Command Sequence

Copy and paste these commands one by one into Git Bash:

```bash
cd /c/Users/kunle/vibe-code-projects-2026/auto-dealership-app
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git add .
git commit -m "Initial commit: Auto Dealership App"
git remote add origin https://github.com/kunletemowo/auto-dealership-app.git
git push -u origin main
```

## Differences Between Command Prompt and Git Bash

- **Paths**: Git Bash uses `/c/Users/...` instead of `C:\Users\...`
- **Commands**: Git Bash understands both Windows and Unix commands
- **Git**: Already in PATH in Git Bash!

That's it! Your code should now be on GitHub! 🚀
