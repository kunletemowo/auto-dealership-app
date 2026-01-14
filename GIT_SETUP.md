# Git Configuration Guide

This guide will help you configure Git so you can commit your code to GitHub.

## Step 1: Configure Git User Information

You need to tell Git who you are by setting your name and email. This information will be attached to every commit you make.

### Option A: Using Command Prompt (Recommended)

1. **Open Command Prompt** (not PowerShell):
   - Press `Win + R`
   - Type `cmd` and press Enter
   - Or search for "Command Prompt" in the Start menu

2. **Navigate to your project** (optional, but recommended):
   ```cmd
   cd C:\Users\kunle\vibe-code-projects-2026\auto-dealership-app
   ```

3. **Configure your name** (replace "Your Name" with your actual name):
   ```cmd
   git config --global user.name "Your Name"
   ```

4. **Configure your email** (replace with your GitHub email):
   ```cmd
   git config --global user.email "your.email@example.com"
   ```

   **Important**: Use the email associated with your GitHub account!

5. **Verify the configuration**:
   ```cmd
   git config --global user.name
   git config --global user.email
   ```

### Option B: Using Git Bash (If Installed)

If you have Git for Windows installed, you can use Git Bash:

1. **Open Git Bash** (search for "Git Bash" in Start menu)
2. **Run the same commands** as in Option A
3. Git Bash understands the same commands

### Option C: Using Cursor's Terminal

If Git is available in Cursor's terminal:

1. Open Cursor's integrated terminal (Ctrl + ` or View → Terminal)
2. Make sure you're in Command Prompt mode or Git Bash mode (not PowerShell)
3. Run the same configuration commands

## Step 2: Verify Git is Configured

After configuring, verify with:
```cmd
git config --global --list
```

You should see `user.name` and `user.email` in the list.

## Step 3: Commit Your Code

Once Git is configured, you can commit your code:

1. **Stage your changes**:
   ```cmd
   git add .
   ```

2. **Commit with a message**:
   ```cmd
   git commit -m "Update featured listings to fetch real data from database"
   ```

3. **Push to GitHub** (if you have a remote repository set up):
   ```cmd
   git push
   ```

## Troubleshooting

### Git command not found
- Make sure Git is installed: Download from [https://git-scm.com/download/win](https://git-scm.com/download/win)
- After installation, close and reopen your terminal/editor

### Email doesn't match GitHub account
- Use the email associated with your GitHub account
- Or add this email to your GitHub account's email settings

### Need to change the configuration later
- Just run the `git config --global user.name` and `git config --global user.email` commands again with new values

## Next Steps After Configuration

1. Configure Git (Steps 1-2 above)
2. Commit your changes:
   ```cmd
   git add .
   git commit -m "Your commit message"
   ```
3. Push to GitHub (if repository is set up):
   ```cmd
   git push
   ```

If you haven't set up a GitHub repository yet, you'll need to:
1. Create a repository on GitHub
2. Add it as a remote:
   ```cmd
   git remote add origin https://github.com/yourusername/your-repo-name.git
   ```
3. Push your code:
   ```cmd
   git push -u origin main
   ```
   (Use `master` instead of `main` if your default branch is `master`)
