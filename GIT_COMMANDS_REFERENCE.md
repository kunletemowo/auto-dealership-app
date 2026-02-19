# Git Commands Reference Guide

A comprehensive breakdown of Git commands for the auto-dealership-app project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Viewing Status and History](#viewing-status-and-history)
3. [Staging Changes](#staging-changes)
4. [Committing Changes](#committing-changes)
5. [Pushing and Pulling](#pushing-and-pulling)
6. [Branch Management](#branch-management)
7. [Undoing Changes](#undoing-changes)
8. [Viewing and Searching History](#viewing-and-searching-history)
9. [Stashing Changes](#stashing-changes)
10. [Remote Repository Management](#remote-repository-management)
11. [File Operations](#file-operations)
12. [Merge and Rebase](#merge-and-rebase)
13. [Tagging](#tagging)
14. [Common Workflows](#common-workflows)
15. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Check Git Version
```bash
git --version
```

### Configure Git (First Time Setup)
```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"

# Verify configuration
git config --global user.name
git config --global user.email

# View all configuration
git config --global --list
```

### Initialize a Repository
```bash
# Initialize a new Git repository (usually already done)
git init

# Clone an existing repository
git clone https://github.com/kunletemowo/auto-dealership-app.git
```

---

## Viewing Status and History

### Check Repository Status
```bash
# Show working directory status
git status

# Short status format
git status -s

# Show status with branch information
git status -sb
```

### View Commit History
```bash
# View commit history
git log

# One-line format
git log --oneline

# Graph view with branches
git log --oneline --graph --all

# Last N commits
git log -n 5

# Show changes in commits
git log -p

# Show stats (files changed, insertions, deletions)
git log --stat

# Custom format
git log --pretty=format:"%h - %an, %ar : %s"
```

### View File Differences
```bash
# Show unstaged changes
git diff

# Show staged changes
git diff --staged
# or
git diff --cached

# Show changes for a specific file
git diff src/app/page.tsx

# Show differences between commits
git diff HEAD~1 HEAD

# Show differences for a specific file between commits
git diff HEAD~1 HEAD -- src/app/page.tsx
```

---

## Staging Changes

### Stage Files
```bash
# Stage all changes
git add .

# Stage a specific file
git add src/app/page.tsx

# Stage multiple files
git add src/app/page.tsx src/components/Header.tsx

# Stage all files in a directory
git add src/components/

# Stage all modified files (not new files)
git add -u

# Stage interactively (choose hunks)
git add -p

# Stage all files matching a pattern
git add "*.tsx"
```

### Unstage Files
```bash
# Unstage all files
git reset HEAD

# Unstage a specific file
git reset HEAD src/app/page.tsx

# Unstage using restore (Git 2.23+)
git restore --staged src/app/page.tsx
```

---

## Committing Changes

### Create a Commit
```bash
# Commit staged changes with a message
git commit -m "Add new feature"

# Commit with a multi-line message
git commit -m "Add new feature" -m "Detailed description of changes"

# Stage all changes and commit in one command
git commit -am "Update component"

# Amend the last commit (change message or add files)
git commit --amend -m "New commit message"

# Amend without changing the message
git commit --amend --no-edit
```

### Good Commit Message Examples
```bash
# Feature addition
git commit -m "Add province dropdown to car search form"

# Bug fix
git commit -m "Fix authentication redirect error"

# Refactoring
git commit -m "Refactor car listing form validation"

# Documentation
git commit -m "Update README with setup instructions"

# Style/formatting
git commit -m "Format code with Prettier"
```

---

## Pushing and Pulling

### Push to Remote
```bash
# Push current branch to remote
git push

# Push to specific remote and branch
git push origin main

# Push and set upstream (first time)
git push -u origin main

# Push all branches
git push --all

# Force push (use with caution!)
git push --force
# or
git push -f
```

### Pull from Remote
```bash
# Pull latest changes from remote
git pull

# Pull from specific remote and branch
git pull origin main

# Pull with rebase (cleaner history)
git pull --rebase

# Fetch without merging
git fetch

# Fetch from specific remote
git fetch origin
```

### Check Remote Status
```bash
# See commits not yet pushed
git log origin/main..HEAD

# See commits on remote not yet pulled
git log HEAD..origin/main

# See all differences
git log HEAD...origin/main
```

---

## Branch Management

### List Branches
```bash
# List local branches
git branch

# List all branches (local and remote)
git branch -a

# List remote branches
git branch -r

# Show current branch with last commit
git branch -v
```

### Create and Switch Branches
```bash
# Create a new branch
git branch feature/new-feature

# Switch to a branch
git checkout feature/new-feature

# Create and switch in one command
git checkout -b feature/new-feature

# Using switch command (Git 2.23+)
git switch feature/new-feature

# Create and switch using switch
git switch -c feature/new-feature
```

### Delete Branches
```bash
# Delete a local branch
git branch -d feature/old-feature

# Force delete (even if not merged)
git branch -D feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature
```

### Rename Branches
```bash
# Rename current branch
git branch -m new-branch-name

# Rename a different branch
git branch -m old-name new-name
```

---

## Undoing Changes

### Undo Working Directory Changes
```bash
# Discard changes to a file (uncommitted)
git restore src/app/page.tsx

# Discard all uncommitted changes
git restore .

# Discard changes using checkout (older method)
git checkout -- src/app/page.tsx
```

### Undo Staged Changes
```bash
# Unstage a file (keep changes)
git restore --staged src/app/page.tsx

# Unstage all files
git restore --staged .
```

### Undo Commits
```bash
# Undo last commit (keep changes staged)
git reset --soft HEAD~1

# Undo last commit (keep changes unstaged)
git reset --mixed HEAD~1
# or
git reset HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo last N commits
git reset HEAD~3

# Reset to a specific commit
git reset --hard <commit-hash>
```

### Revert a Commit (Safe for Shared Branches)
```bash
# Create a new commit that undoes a previous commit
git revert <commit-hash>

# Revert the last commit
git revert HEAD

# Revert without committing (review first)
git revert --no-commit HEAD
```

---

## Viewing and Searching History

### Search Commit History
```bash
# Search commit messages
git log --grep="authentication"

# Search by author
git log --author="kunle"

# Search by date range
git log --since="2024-01-01" --until="2024-12-31"

# Search file history
git log --follow src/app/page.tsx

# Search for a string in code
git log -S "function signUp" --source --all

# Search with pickaxe (when string was added/removed)
git log -p -S "TODO"
```

### Find Specific Commits
```bash
# Find commits affecting a file
git log -- src/app/page.tsx

# Find when a line was added/changed
git blame src/app/page.tsx

# Find a commit by hash
git show <commit-hash>

# Show specific file in a commit
git show <commit-hash>:src/app/page.tsx
```

### View Specific Commits
```bash
# Show commit details
git show <commit-hash>

# Show last commit
git show HEAD

# Show commit with stats
git show --stat <commit-hash>
```

---

## Stashing Changes

### Stash Working Changes
```bash
# Stash current changes
git stash

# Stash with a message
git stash save "Work in progress on search feature"

# Stash including untracked files
git stash -u

# Stash including ignored files
git stash -a
```

### View and Apply Stashes
```bash
# List all stashes
git stash list

# Apply most recent stash (keep stash)
git stash apply

# Apply specific stash
git stash apply stash@{1}

# Apply and remove stash
git stash pop

# View stash contents
git stash show

# View stash diff
git stash show -p

# View specific stash diff
git stash show -p stash@{1}
```

### Delete Stashes
```bash
# Delete most recent stash
git stash drop

# Delete specific stash
git stash drop stash@{1}

# Delete all stashes
git stash clear
```

---

## Remote Repository Management

### View Remotes
```bash
# List all remotes
git remote

# List remotes with URLs
git remote -v

# Show remote details
git remote show origin
```

### Add and Remove Remotes
```bash
# Add a remote
git remote add origin https://github.com/kunletemowo/auto-dealership-app.git

# Change remote URL
git remote set-url origin https://github.com/kunletemowo/new-repo.git

# Remove a remote
git remote remove origin

# Rename a remote
git remote rename origin upstream
```

### Fetch from Remote
```bash
# Fetch all remotes
git fetch

# Fetch specific remote
git fetch origin

# Fetch and prune deleted remote branches
git fetch --prune
```

---

## File Operations

### Restore Deleted Files
```bash
# Restore a deleted file from last commit
git restore src/components/Header.tsx

# Restore from a specific commit
git restore --source=HEAD~1 src/components/Header.tsx

# Checkout method (older)
git checkout HEAD -- src/components/Header.tsx
```

### Move and Rename Files
```bash
# Move/rename a file (Git tracks this properly)
git mv old-file.tsx new-file.tsx

# After manually moving, stage the change
git add new-file.tsx
git add old-file.tsx
```

### Remove Files
```bash
# Remove a file from Git (keep local file)
git rm --cached file-to-remove.tsx

# Remove a file from Git and disk
git rm file-to-remove.tsx

# Force remove
git rm -f file-to-remove.tsx
```

---

## Merge and Rebase

### Merge Branches
```bash
# Merge a branch into current branch
git merge feature/new-feature

# Merge with a commit message
git merge feature/new-feature -m "Merge feature branch"

# Abort a merge in progress
git merge --abort

# Create a merge commit even if fast-forward possible
git merge --no-ff feature/new-feature
```

### Rebase Branches
```bash
# Rebase current branch onto another
git rebase main

# Interactive rebase (edit commits)
git rebase -i HEAD~3

# Continue after resolving conflicts
git rebase --continue

# Abort rebase
git rebase --abort

# Skip a commit during rebase
git rebase --skip
```

---

## Tagging

### Create Tags
```bash
# Create a lightweight tag
git tag v1.0.0

# Create an annotated tag (recommended)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag a specific commit
git tag -a v1.0.0 <commit-hash> -m "Release version 1.0.0"
```

### List and View Tags
```bash
# List all tags
git tag

# List tags matching a pattern
git tag -l "v1.*"

# Show tag details
git show v1.0.0
```

### Push Tags
```bash
# Push all tags
git push --tags

# Push a specific tag
git push origin v1.0.0

# Delete a local tag
git tag -d v1.0.0

# Delete a remote tag
git push origin --delete v1.0.0
```

---

## Common Workflows

### Daily Development Workflow
```bash
# 1. Check status
git status

# 2. Pull latest changes
git pull

# 3. Make your changes...

# 4. Stage changes
git add .

# 5. Commit
git commit -m "Your commit message"

# 6. Push
git push
```

### Feature Branch Workflow
```bash
# 1. Create and switch to feature branch
git checkout -b feature/new-search-filters

# 2. Make changes and commit
git add .
git commit -m "Add advanced search filters"

# 3. Push branch to remote
git push -u origin feature/new-search-filters

# 4. Merge to main (after PR approval)
git checkout main
git pull
git merge feature/new-search-filters
git push

# 5. Delete feature branch
git branch -d feature/new-search-filters
git push origin --delete feature/new-search-filters
```

### Undo Last Commit (Not Yet Pushed)
```bash
# Keep changes, unstage
git reset HEAD~1

# Keep changes, staged
git reset --soft HEAD~1

# Discard changes completely
git reset --hard HEAD~1
```

### Recover a Deleted File
```bash
# Find when file was deleted
git log --all --full-history -- "path/to/file.tsx"

# Restore from last commit it existed
git checkout <commit-hash>^ -- path/to/file.tsx

# Or restore from HEAD if it was just deleted
git restore path/to/file.tsx
```

### Update Branch from Main
```bash
# Method 1: Merge main into feature branch
git checkout feature/my-feature
git fetch origin
git merge origin/main

# Method 2: Rebase feature branch onto main
git checkout feature/my-feature
git fetch origin
git rebase origin/main
```

---

## Troubleshooting

### Common Issues and Solutions

#### "Your branch is ahead of 'origin/main' by X commits"
```bash
# Push your commits
git push
```

#### "Your branch is behind 'origin/main' by X commits"
```bash
# Pull latest changes
git pull
```

#### "Please commit your changes or stash them"
```bash
# Option 1: Stash changes
git stash
# Do your operation (pull, checkout, etc.)
git stash pop

# Option 2: Commit changes
git add .
git commit -m "WIP: Save current changes"
```

#### "Merge conflict"
```bash
# See conflicted files
git status

# Resolve conflicts manually in files
# Then stage resolved files
git add resolved-file.tsx

# Complete the merge
git commit
```

#### "Permission denied" when pushing
```bash
# Check remote URL
git remote -v

# Verify authentication (may need Personal Access Token)
# Or update remote URL if needed
git remote set-url origin https://github.com/kunletemowo/auto-dealership-app.git
```

#### "fatal: refusing to merge unrelated histories"
```bash
# Allow unrelated histories (use carefully)
git pull origin main --allow-unrelated-histories
```

#### Find what changed and when
```bash
# See what changed in a file
git log -p src/app/page.tsx

# See who changed what
git blame src/app/page.tsx

# Find when a bug was introduced
git bisect start
git bisect bad                    # Current version is bad
git bisect good <commit-hash>    # Known good commit
# Git will help you find the bad commit
git bisect reset                  # When done
```

#### Clean up repository
```bash
# Remove untracked files and directories
git clean -n      # Preview what will be removed
git clean -f      # Remove files
git clean -fd     # Remove files and directories

# Prune remote branches that no longer exist
git fetch --prune
```

---

## Quick Reference Cheat Sheet

```bash
# Check status
git status

# Stage all changes
git add .

# Commit
git commit -m "Message"

# Push
git push

# Pull
git pull

# Create branch
git checkout -b feature/name

# Switch branch
git checkout branch-name

# View history
git log --oneline

# Undo uncommitted changes
git restore .

# Undo last commit (keep changes)
git reset HEAD~1

# Stash changes
git stash
git stash pop
```

---

## Tips for This Project

### Before Starting Work
```bash
# Always pull latest changes
git pull origin main

# Create a feature branch
git checkout -b feature/your-feature-name
```

### Before Committing
```bash
# Check what you're about to commit
git status
git diff --staged

# Make sure tests pass (if applicable)
npm run build
```

### Good Commit Practices
- Write clear, descriptive commit messages
- Make small, focused commits
- Test your changes before committing
- Don't commit sensitive information (API keys, passwords)

### Before Pushing
```bash
# Verify your changes
git log origin/main..HEAD

# Push your branch
git push -u origin your-branch-name
```

---

## Additional Resources

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/
- **Interactive Git Tutorial**: https://learngitbranching.js.org/

---

*Last updated: Based on auto-dealership-app project setup*
