# Push Project to GitHub - Step by Step Guide

This guide will help you push your project to GitHub at: https://github.com/kunletemowo/auto-dealership-app.git

## Prerequisites

Your repository is already initialized (I can see the `.git` directory), but you need to:
1. Configure Git with your name and email
2. Complete any pending commit
3. Add the GitHub remote
4. Push your code

## Step 1: Open Command Prompt (Not PowerShell)

Since Git isn't in PowerShell's PATH:
1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to your project:
   ```cmd
   cd C:\Users\kunle\vibe-code-projects-2026\auto-dealership-app
   ```

## Step 2: Configure Git (First Time Only)

Run these commands to configure Git with your identity:

```cmd
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Important**: Use the email associated with your GitHub account!

Verify configuration:
```cmd
git config --global user.name
git config --global user.email
```

## Step 3: Check Git Status

Check what files need to be committed:

```cmd
git status
```

## Step 4: Stage All Changes

Add all files to staging:

```cmd
git add .
```

This includes the new `GIT_SETUP.md` file and any other changes.

## Step 5: Commit Your Changes

Commit with a descriptive message:

```cmd
git commit -m "Initial commit: Auto Dealership App with featured listings, favorites, and listing management"
```

If there's already a commit in progress (you have a COMMIT_EDITMSG file), you might need to:
- If the commit editor is open, save and close it (if using vim: press `Esc`, type `:wq`, press Enter)
- Or complete the commit with the command above

## Step 6: Add GitHub Remote

Add your GitHub repository as the remote origin:

```cmd
git remote add origin https://github.com/kunletemowo/auto-dealership-app.git
```

If you get an error saying "remote origin already exists", check the current remote:
```cmd
git remote -v
```

If it's pointing to a different URL, remove it first:
```cmd
git remote remove origin
git remote add origin https://github.com/kunletemowo/auto-dealership-app.git
```

## Step 7: Push to GitHub

Push your code to GitHub:

```cmd
git push -u origin main
```

**Note**: If your default branch is `master` instead of `main`, use:
```cmd
git push -u origin master
```

## Step 8: Verify

1. Go to https://github.com/kunletemowo/auto-dealership-app
2. Refresh the page
3. You should see all your files!

## Troubleshooting

### "Repository not found" error
- Make sure you're logged into GitHub
- Verify the repository URL is correct
- Check that you have push access to the repository

### "Authentication failed" error
- GitHub requires authentication for HTTPS
- You may need to use a Personal Access Token instead of password
- Or switch to SSH authentication

### "Branch 'main' has no upstream branch"
- Use: `git push -u origin main` (the `-u` flag sets upstream)

### "Permission denied" error
- Make sure you have write access to the repository
- Check your GitHub authentication settings

### Still having issues?
- Check if Git is installed: `git --version` in Command Prompt
- If Git isn't installed, download from: https://git-scm.com/download/win

## Quick Command Reference

Here's a quick reference of all commands in order:

```cmd
cd C:\Users\kunle\vibe-code-projects-2026\auto-dealership-app
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git status
git add .
git commit -m "Initial commit: Auto Dealership App"
git remote add origin https://github.com/kunletemowo/auto-dealership-app.git
git push -u origin main
```

Good luck! 🚀
