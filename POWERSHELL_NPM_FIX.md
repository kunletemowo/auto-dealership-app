# Fix npm in PowerShell

You're using PowerShell, so the syntax is different from Command Prompt.

## Quick Fix for Current Session (PowerShell)

In PowerShell, use this command to add Node.js to PATH for the current session:

```powershell
$env:PATH += ";C:\Program Files\nodejs"
```

Then verify it works:

```powershell
npm --version
node --version
```

If you see version numbers, you're good to go! Then run:

```powershell
npm install
```

## Note: This Only Works for Current Session

This PATH change only lasts for the current PowerShell session. When you close and reopen the terminal, you'll need to either:

1. **Close and reopen your terminal/editor** (recommended - this should pick up the PATH automatically)
2. Run the PATH command again in a new session
3. Add it permanently to system PATH (see below)

## Permanent Fix: Add to System PATH

If you want npm to work automatically in all new terminals:

1. Press `Win + X` and select **"System"**
2. Click **"Advanced system settings"** (on the right side)
3. Click **"Environment Variables"** button
4. Under **"System variables"** (bottom section), find **"Path"** and click **"Edit"**
5. Click **"New"**
6. Add: `C:\Program Files\nodejs`
7. Click **"OK"** on all dialogs
8. **Close and reopen your terminal/editor**

## Best Solution: Restart Terminal/Editor

The easiest solution is to:
1. Close your current terminal
2. Close your code editor completely
3. Reopen your code editor
4. Open a new terminal

This should automatically pick up Node.js from the system PATH.
