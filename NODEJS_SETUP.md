# Node.js and npm Setup Guide

If you're getting the error "npm is not recognized", it means Node.js (which includes npm) is either not installed or not in your system PATH.

## Solution 1: Install Node.js (If Not Installed)

### Step 1: Download Node.js

1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version
   - This is the recommended version for most users
   - It will say something like "Recommended For Most Users"
   - Current LTS version is typically v20.x or v22.x

### Step 2: Install Node.js

1. Run the downloaded installer (`.msi` file for Windows)
2. Follow the installation wizard:
   - Click "Next" through the setup
   - **Important**: Check the box that says "Add to PATH" (it's usually checked by default)
   - Accept the license agreement
   - Click "Install"
3. Complete the installation

### Step 3: Verify Installation

**Close and reopen your terminal/PowerShell**, then run:

```powershell
node --version
npm --version
```

You should see version numbers. If you do, Node.js is installed correctly!

## Solution 2: Node.js is Installed But Not in PATH

If Node.js is installed but npm still isn't recognized, you may need to:

### Option A: Restart Your Terminal/Editor

1. **Close your current terminal/PowerShell window**
2. **Close your code editor (Cursor/VS Code)**
3. **Reopen everything**
4. Try `npm --version` again

### Option B: Add Node.js to PATH Manually

1. **Find where Node.js is installed:**
   - Usually: `C:\Program Files\nodejs\`
   - Or: `C:\Program Files (x86)\nodejs\`
   - Or check: `C:\Users\YourUsername\AppData\Roaming\npm`

2. **Add to PATH:**
   - Press `Win + X` and select "System"
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find "Path" and click "Edit"
   - Click "New" and add: `C:\Program Files\nodejs\`
   - Click "OK" on all dialogs
   - **Restart your terminal/editor**

## Solution 3: Use Node Version Manager (Advanced)

If you want to manage multiple Node.js versions:

1. Install **nvm-windows**: [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
2. After installation, open a new terminal and run:
   ```powershell
   nvm install lts
   nvm use lts
   ```

## Quick Check: Is Node.js Already Installed?

Run these commands in PowerShell to check:

```powershell
# Check if node exists
Get-Command node -ErrorAction SilentlyContinue

# Check common installation locations
Test-Path "C:\Program Files\nodejs\node.exe"
Test-Path "C:\Program Files (x86)\nodejs\node.exe"

# Check if it's in your user directory
Test-Path "$env:APPDATA\npm\npm.cmd"
```

## After Installing Node.js

Once Node.js is installed:

1. **Close and reopen your terminal/editor**
2. **Navigate to your project directory:**
   ```powershell
   cd C:\Users\kunle\vibe-code-projects-2026\auto-dealership-app
   ```
3. **Install dependencies:**
   ```powershell
   npm install
   ```

## Verify Everything Works

After installation, verify with:

```powershell
node --version    # Should show v20.x.x or similar
npm --version     # Should show 10.x.x or similar
```

## Next Steps

Once npm is working:

1. Run `npm install` in your project directory
2. Create your `.env.local` file with Supabase credentials
3. Run `npm run dev` to start the development server

## Still Having Issues?

If you're still having problems:

1. Make sure you **restarted your terminal/editor** after installing Node.js
2. Check that Node.js installer completed successfully
3. Try running PowerShell as Administrator
4. Verify Node.js is installed: Check `C:\Program Files\nodejs\` exists

## Alternative: Using Package Managers

If you have other package managers installed:

- **Chocolatey**: `choco install nodejs`
- **Scoop**: `scoop install nodejs`
- **Winget**: `winget install OpenJS.NodeJS.LTS`
