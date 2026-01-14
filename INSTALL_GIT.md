# Install Git on Windows

You're getting the error `'git' is not recognized` because Git is not installed on your system or not in your PATH. Here's how to fix it:

## Step 1: Install Git for Windows

1. **Download Git for Windows**
   - Go to: https://git-scm.com/download/win
   - The download should start automatically
   - Or click the download button for the latest version

2. **Run the Installer**
   - Double-click the downloaded `.exe` file (e.g., `Git-2.xx.x-64-bit.exe`)
   - Follow the installation wizard:
     - Click "Next" through the setup screens
     - **Important**: On the "Select Components" screen, make sure these are checked:
       - ✅ Git Bash Here
       - ✅ Git GUI Here
       - ✅ Associate .git* configuration files with the default text editor
       - ✅ Associate .sh files to be run with Bash
     - **On the "Choosing the default editor" screen**: Choose your preferred editor (Nano is easiest for beginners, or choose "Use Visual Studio Code as Git's default editor" if you have VS Code/Cursor)
     - **On the "Adjusting your PATH environment" screen**: 
       - **IMPORTANT**: Select "Git from the command line and also from 3rd-party software" (this adds Git to your PATH)
     - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

3. **Restart Your Terminal/Command Prompt**
   - Close all open Command Prompt windows
   - Close Cursor/VS Code if it's open
   - Reopen Command Prompt or Cursor

## Step 2: Verify Installation

Open a new Command Prompt (Win + R, type `cmd`, press Enter) and run:

```cmd
git --version
```

You should see something like: `git version 2.xx.x`

## Step 3: Configure Git (First Time Setup)

Once Git is installed, configure it with your name and email:

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

## Step 4: Push Your Code to GitHub

After Git is installed and configured, navigate to your project and push:

```cmd
cd C:\Users\kunle\vibe-code-projects-2026\auto-dealership-app
git add .
git commit -m "Initial commit: Auto Dealership App"
git remote add origin https://github.com/kunletemowo/auto-dealership-app.git
git push -u origin main
```

## Alternative: If Git is Installed But Not in PATH

If Git is already installed but not in PATH:

1. **Find Git Installation**
   - Usually at: `C:\Program Files\Git\cmd\git.exe`
   - Or: `C:\Program Files (x86)\Git\cmd\git.exe`

2. **Add to PATH Manually**
   - Press `Win + X` and select "System"
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find "Path" and click "Edit"
   - Click "New" and add: `C:\Program Files\Git\cmd`
   - Click "OK" on all dialogs
   - **Restart Command Prompt/Cursor**

3. **Or Use Git Bash Instead**
   - If Git is installed, you can use Git Bash instead of Command Prompt
   - Search for "Git Bash" in Start menu
   - Use the same commands (Git Bash understands both Windows and Unix commands)

## Quick Installation Checklist

- [ ] Download Git from https://git-scm.com/download/win
- [ ] Run installer
- [ ] Select "Git from the command line and also from 3rd-party software" on PATH screen
- [ ] Complete installation
- [ ] Close and reopen Command Prompt/Cursor
- [ ] Verify with `git --version`
- [ ] Configure with `git config --global user.name` and `git config --global user.email`
- [ ] Push your code to GitHub

## Still Having Issues?

If you're still having problems after installation:

1. Make sure you **closed and reopened** Command Prompt/Cursor after installing
2. Verify Git is installed: Check if `C:\Program Files\Git\cmd\git.exe` exists
3. Try using Git Bash instead of Command Prompt
4. Check that you selected the PATH option during installation

Once Git is installed, you'll be able to push your code to GitHub! 🚀
