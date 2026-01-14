# How to Add Node.js to PATH Permanently in Windows

If you can't find "Environment Variables" in Advanced System Settings, here are multiple ways to access it:

## Method 1: Search for Environment Variables (Easiest)

1. **Press the Windows key** (or click Start)
2. **Type**: `environment variables`
3. **Click** on **"Edit the system environment variables"** or **"Environment Variables"**
4. This will open the System Properties dialog
5. Click the **"Environment Variables"** button at the bottom

## Method 2: Through System Properties

1. **Press `Win + R`** to open Run dialog
2. **Type**: `sysdm.cpl`
3. **Press Enter**
4. Click the **"Advanced"** tab
5. Click the **"Environment Variables"** button at the bottom

## Method 3: Direct Search in Settings (Windows 11)

1. **Press `Win + I`** to open Settings
2. In the search box at the top, type: `environment variables`
3. Click on **"Edit the system environment variables"**
4. Click the **"Environment Variables"** button

## Method 4: Through Control Panel

1. **Press `Win + X`** and select **"System"**
2. Click **"Advanced system settings"** (on the right side, under "Related settings")
3. Click the **"Environment Variables"** button

## Method 5: Command Line (Quick Method)

1. Open PowerShell as Administrator:
   - Press `Win + X`
   - Select **"Windows PowerShell (Admin)"** or **"Terminal (Admin)"**
   - Click "Yes" when asked for permission

2. Run this command:
   ```powershell
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\nodejs", [EnvironmentVariableTarget]::Machine)
   ```

   **Note**: This requires administrator privileges and will add Node.js to the system PATH permanently.

## Once You Have Environment Variables Open

1. Under **"System variables"** (bottom section), find **"Path"** and click **"Edit"**
2. Click **"New"**
3. Add: `C:\Program Files\nodejs`
4. Click **"OK"** on all dialogs
5. **Close and reopen your terminal/editor**

## Verify It Worked

After adding to PATH and restarting your terminal:

```powershell
npm --version
node --version
```

Both should work without any PATH commands!

## Alternative: Use PowerShell Command (If You Have Admin Rights)

If you have administrator access, the quickest way is Method 5 above using PowerShell as Administrator.
