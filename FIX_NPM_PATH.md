# Fix: npm Not Recognized (Node.js is Installed)

Good news! Node.js IS installed on your system at `C:\Program Files\nodejs\`, but your terminal can't find it because it's not in your PATH or your terminal session is old.

## Quick Fix: Close and Reopen Terminal

**The simplest solution:**

1. **Close your current terminal/command prompt window completely**
2. **Close your code editor (Cursor/VS Code) completely**
3. **Reopen your code editor**
4. **Open a NEW terminal window**
5. Try `npm --version` again

This usually fixes it because the PATH environment variable gets updated when Node.js installs, but existing terminal sessions don't see the change.

## Alternative: Use Full Path (Temporary Fix)

If you can't close your terminal right now, you can use the full path:

```cmd
"C:\Program Files\nodejs\npm.cmd" install
```

Or add it to PATH for this session:

```cmd
set PATH=%PATH%;C:\Program Files\nodejs
npm install
```

## Permanent Fix: Add to PATH Manually (If Needed)

If closing/reopening doesn't work:

1. Press `Win + X` and select **"System"**
2. Click **"Advanced system settings"** (on the right)
3. Click **"Environment Variables"** button
4. Under **"System variables"** (bottom section), find **"Path"** and click **"Edit"**
5. Click **"New"**
6. Add: `C:\Program Files\nodejs\`
7. Click **"OK"** on all dialogs
8. **Close and reopen your terminal/editor**

## Verify It's Working

After trying the solutions above, verify:

```cmd
node --version
npm --version
```

Both should show version numbers.

## Then Install Dependencies

Once npm is working:

```cmd
cd C:\Users\kunle\vibe-code-projects-2026\auto-dealership-app
npm install
```
