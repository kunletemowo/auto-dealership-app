# Revert GitHub Pages changes on main branch

Run these steps **on branch** `main`.

## 1. Switch to main and get latest

```bash
git checkout main
git pull origin main
```

## 2. Revert the three GitHub Pages additions

### A. Restore `next.config.ts`

Remove the static-export block so the file looks like this (only the `images` block, no `output` / `GITHUB_ACTIONS`):

- Delete the line: `...(process.env.GITHUB_ACTIONS === "true" ? { output: "export" as const } : {}),`
- Delete the comment above it: `// Static export only when building for GitHub Pages (in GitHub Actions)`

So the start of `nextConfig` should be:

```ts
const nextConfig: NextConfig = {
  images: {
```

### B. Delete the workflow file

```bash
rm .github/workflows/deploy-gh-pages.yml
```

Windows (PowerShell):

```powershell
Remove-Item -Path ".github/workflows/deploy-gh-pages.yml" -Force
```

If the folder is empty you can remove it:

```bash
rm -r .github
```

### C. Delete the setup doc

```bash
rm GITHUB_PAGES_SETUP.md
```

Windows (PowerShell):

```powershell
Remove-Item -Path "GITHUB_PAGES_SETUP.md" -Force
```

## 3. Commit the revert

```bash
git add -A
git status
git commit -m "Revert GitHub Pages setup (static export and workflow)"
git push origin main
```

After this, main will be back to the state before the GitHub Pages instruction.
