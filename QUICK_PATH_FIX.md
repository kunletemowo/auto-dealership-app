# Quick Fix: Add Node.js to PATH

## Easiest Method: Search for It

1. **Press Windows key** (or click Start button)
2. **Type exactly**: `environment variables`
3. **Click** on **"Edit the system environment variables"**
4. Click **"Environment Variables"** button
5. Under "System variables", find **"Path"** → Click **"Edit"**
6. Click **"New"** → Type: `C:\Program Files\nodejs`
7. Click **"OK"** on all dialogs
8. **Restart your terminal/editor**

## Or Use Run Dialog

1. Press **`Win + R`**
2. Type: `sysdm.cpl`
3. Press Enter
4. Click **"Advanced"** tab
5. Click **"Environment Variables"** button
6. Follow steps 5-8 above

## PowerShell Admin Method (Fastest if you have admin rights)

1. Press **`Win + X`**
2. Select **"Terminal (Admin)"** or **"PowerShell (Admin)"**
3. Click "Yes" for permission
4. Run:
   ```powershell
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\nodejs", [EnvironmentVariableTarget]::Machine)
   ```
5. Close and reopen your terminal

That's it!
