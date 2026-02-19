# Git Branching, Commit, and Merging Guide

A comprehensive guide to Git branching strategies, commit best practices, and merging techniques for the auto-dealership-app project.

## Table of Contents

1. [Git Branching](#git-branching)
2. [Committing](#committing)
3. [Merging](#merging)
4. [Complete Workflows](#complete-workflows)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

---

## Git Branching

### Understanding Branches

Branches are pointers to specific commits. They allow you to work on different features simultaneously without affecting the main codebase.

### Branch Types and Naming Conventions

#### Main Branches
- **main** (or **master**): Production-ready code
- **develop**: Integration branch for features (optional, for larger teams)

#### Feature Branches
```bash
feature/user-authentication
feature/search-filters
feature/car-listing-form
feature/profile-management
```

#### Bug Fix Branches
```bash
bugfix/auth-redirect-error
bugfix/image-upload-issue
hotfix/critical-security-patch
```

#### Release Branches
```bash
release/v1.0.0
release/v1.1.0
```

### Creating Branches

#### Create and Switch to New Branch
```bash
# Create and switch to a new branch
git checkout -b feature/new-feature

# Using switch command (Git 2.23+)
git switch -c feature/new-feature

# Create branch from specific commit
git checkout -b feature/new-feature <commit-hash>

# Create branch from another branch
git checkout -b feature/new-feature develop
```

#### Create Branch Without Switching
```bash
# Create branch but stay on current branch
git branch feature/new-feature

# Create branch from remote branch
git branch feature/new-feature origin/feature/new-feature
```

### Listing and Viewing Branches

```bash
# List local branches
git branch

# List all branches (local and remote)
git branch -a

# List remote branches
git branch -r

# Show branches with last commit info
git branch -v

# Show which branches are merged
git branch --merged

# Show which branches are not merged
git branch --no-merged
```

### Switching Between Branches

```bash
# Switch to an existing branch
git checkout branch-name

# Using switch command (Git 2.23+)
git switch branch-name

# Switch to previous branch
git checkout -

# Create branch and switch in one command
git checkout -b new-branch
```

### Branch Management

#### Delete Branches
```bash
# Delete a local branch (safe - only if merged)
git branch -d feature/old-feature

# Force delete local branch (even if not merged)
git branch -D feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature

# Delete remote branch (alternative syntax)
git push origin :feature/old-feature

# Prune remote-tracking branches that no longer exist
git fetch --prune
```

#### Rename Branches
```bash
# Rename current branch
git branch -m new-branch-name

# Rename a different branch
git branch -m old-name new-name

# Rename remote branch (requires push)
git branch -m old-name new-name
git push origin :old-name
git push origin -u new-name
```

#### Track Remote Branches
```bash
# Set upstream tracking
git branch --set-upstream-to=origin/main main

# When pushing for the first time
git push -u origin feature/new-feature

# Track remote branch locally
git checkout -b local-branch origin/remote-branch
```

### Branch Comparison

```bash
# Compare two branches
git diff branch1..branch2

# Compare branches for specific file
git diff branch1..branch2 -- src/app/page.tsx

# See commits in branch1 not in branch2
git log branch1..branch2

# See commits in both branches
git log branch1...branch2

# See which files differ between branches
git diff --name-only branch1..branch2
```

---

## Committing

### Commit Anatomy

A commit contains:
- **Hash**: Unique identifier (SHA-1)
- **Author**: Who made the change
- **Date**: When it was made
- **Message**: Description of changes
- **Changes**: What files were modified

### Commit Best Practices

#### 1. Make Small, Focused Commits

**Good:**
```bash
git commit -m "Add province dropdown to car search form"
git commit -m "Implement city autocomplete functionality"
git commit -m "Fix validation error in search form"
```

**Bad:**
```bash
git commit -m "Update everything"
```

#### 2. Write Clear Commit Messages

**Format:**
```
<type>: <subject>

<body>

<footer>
```

**Examples:**

**Simple:**
```bash
git commit -m "Add authentication error handling"
```

**Detailed:**
```bash
git commit -m "fix: Resolve NEXT_REDIRECT error on sign-in

The signIn server action was using redirect() which throws
an error when called from client components. Changed to
return success object and handle redirect on client side.

Fixes #123"
```

#### 3. Commit Message Types

Use conventional commit types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

**Examples:**
```bash
git commit -m "feat: Add province dropdown to search form"
git commit -m "fix: Resolve authentication redirect error"
git commit -m "docs: Update README with setup instructions"
git commit -m "refactor: Simplify car listing form validation"
git commit -m "style: Format code with Prettier"
```

### Creating Commits

#### Basic Commit
```bash
# Stage changes and commit
git add .
git commit -m "Your commit message"

# Stage all modified files and commit
git commit -am "Your commit message"
```

#### Amend Last Commit
```bash
# Change last commit message
git commit --amend -m "New commit message"

# Add files to last commit
git add forgotten-file.tsx
git commit --amend --no-edit

# Edit last commit interactively
git commit --amend
```

#### Partial Commits (Interactive Staging)
```bash
# Stage parts of a file
git add -p src/app/page.tsx

# This opens interactive mode:
# y - stage this hunk
# n - don't stage this hunk
# q - quit
# s - split into smaller hunks
# e - manually edit the hunk
```

#### Commit Multiple Changes Separately
```bash
# Stage specific files
git add src/components/Header.tsx
git commit -m "Update header navigation"

# Stage other files
git add src/components/Footer.tsx
git commit -m "Update footer links"
```

### Viewing Commits

```bash
# View commit history
git log

# One-line format
git log --oneline

# Graph view
git log --oneline --graph --all

# Show file changes in commits
git log -p

# Show stats
git log --stat

# Filter commits
git log --author="kunle"
git log --since="2024-01-01"
git log --grep="authentication"
git log -- src/app/page.tsx  # Commits affecting specific file
```

### Undoing Commits

#### Before Pushing
```bash
# Undo commit, keep changes staged
git reset --soft HEAD~1

# Undo commit, keep changes unstaged
git reset HEAD~1
# or
git reset --mixed HEAD~1

# Undo commit, discard changes (careful!)
git reset --hard HEAD~1
```

#### After Pushing (Safe Method)
```bash
# Create a new commit that undoes changes
git revert HEAD
git revert <commit-hash>

# Revert multiple commits
git revert HEAD~3..HEAD
```

---

## Merging

### Understanding Merges

Merging combines changes from one branch into another. Git creates a merge commit that has two parent commits.

### Merge Strategies

#### 1. Fast-Forward Merge

Occurs when the target branch hasn't diverged. Git simply moves the branch pointer forward.

```bash
# Fast-forward merge (default when possible)
git checkout main
git merge feature/new-feature
```

#### 2. Three-Way Merge

Occurs when branches have diverged. Git creates a merge commit with two parents.

```bash
# Create merge commit even if fast-forward is possible
git merge --no-ff feature/new-feature -m "Merge feature: new feature"
```

#### 3. Squash Merge

Combines all commits from a branch into a single commit on the target branch.

```bash
# Squash all commits into one
git merge --squash feature/new-feature
git commit -m "Add complete search feature"
```

### Basic Merging

#### Merge Feature Branch into Main
```bash
# 1. Switch to target branch
git checkout main

# 2. Pull latest changes
git pull origin main

# 3. Merge feature branch
git merge feature/new-feature

# 4. Push merged changes
git push origin main
```

#### Merge Main into Feature Branch
```bash
# Keep feature branch up to date
git checkout feature/new-feature
git merge main
# or
git pull origin main
```

### Handling Merge Conflicts

#### Identify Conflicts
```bash
# Check status during merge
git status

# See conflicted files
# Files will be marked as "both modified"
```

#### Resolve Conflicts Manually

1. **Open conflicted file:**
```
<<<<<<< HEAD
// Current branch code
=======
// Incoming branch code
>>>>>>> feature/new-feature
```

2. **Edit the file to resolve conflict:**
   - Keep your changes
   - Keep their changes
   - Keep both
   - Create new solution

3. **Stage resolved file:**
```bash
git add resolved-file.tsx
```

4. **Complete the merge:**
```bash
git commit
```

#### Abort Merge
```bash
# Cancel merge and return to pre-merge state
git merge --abort
```

#### Using Merge Tools
```bash
# Open merge tool
git mergetool

# Configure merge tool (VS Code example)
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

### Merge Options

```bash
# Merge without fast-forward (always create merge commit)
git merge --no-ff feature/new-feature

# Merge but don't commit (review first)
git merge --no-commit feature/new-feature

# Merge with specific strategy
git merge -s ours feature/new-feature  # Ignore their changes
git merge -s theirs feature/new-feature  # Accept their changes (limited use)

# Merge only specific commits (cherry-pick instead)
git cherry-pick <commit-hash>
```

### Comparing Branches Before Merge

```bash
# See what would be merged
git diff main..feature/new-feature

# See commits that would be merged
git log main..feature/new-feature

# Preview merge result
git merge --no-commit --no-ff feature/new-feature
git diff --cached  # Review staged changes
git merge --abort  # Cancel if needed
```

---

## Complete Workflows

### Feature Branch Workflow

#### Starting a New Feature
```bash
# 1. Ensure main is up to date
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/add-search-filters

# 3. Start working...
```

#### During Development
```bash
# Make changes and commit regularly
git add src/components/CarSearchForm.tsx
git commit -m "feat: Add province dropdown to search form"

git add src/lib/utils/location.ts
git commit -m "feat: Implement city autocomplete functionality"

# Keep branch updated with main
git checkout main
git pull origin main
git checkout feature/add-search-filters
git merge main
# or
git rebase main
```

#### Completing a Feature
```bash
# 1. Final commit
git add .
git commit -m "feat: Complete search filters implementation"

# 2. Push feature branch
git push -u origin feature/add-search-filters

# 3. Create Pull Request on GitHub/GitLab
# 4. After PR approval, merge on main
git checkout main
git pull origin main
git merge feature/add-search-filters
git push origin main

# 5. Clean up
git branch -d feature/add-search-filters
git push origin --delete feature/add-search-filters
```

### Bug Fix Workflow

```bash
# 1. Create bug fix branch from main
git checkout main
git pull origin main
git checkout -b bugfix/fix-auth-error

# 2. Fix the bug
# ... make changes ...
git add src/app/actions/auth.ts
git commit -m "fix: Resolve authentication redirect error"

# 3. Test the fix
# ... run tests ...

# 4. Merge back to main
git checkout main
git merge bugfix/fix-auth-error
git push origin main

# 5. Clean up
git branch -d bugfix/fix-auth-error
```

### Hotfix Workflow (Production Issues)

```bash
# 1. Create hotfix from main
git checkout main
git checkout -b hotfix/critical-security-patch

# 2. Fix the issue
git add .
git commit -m "fix: Patch critical security vulnerability"

# 3. Merge to main
git checkout main
git merge hotfix/critical-security-patch
git push origin main

# 4. Also merge to develop (if exists)
git checkout develop
git merge hotfix/critical-security-patch
git push origin develop

# 5. Tag the release
git checkout main
git tag -a v1.0.1 -m "Hotfix: Security patch"
git push origin v1.0.1

# 6. Clean up
git branch -d hotfix/critical-security-patch
```

### Keeping Feature Branch Updated

#### Option 1: Merge Main into Feature
```bash
git checkout feature/my-feature
git fetch origin
git merge origin/main
# Resolve conflicts if any
git push origin feature/my-feature
```

#### Option 2: Rebase Feature onto Main
```bash
git checkout feature/my-feature
git fetch origin
git rebase origin/main
# Resolve conflicts if any (for each commit)
git push origin feature/my-feature --force-with-lease
```

**When to use each:**
- **Merge**: When working with others on the same branch (preserves history)
- **Rebase**: For cleaner history (only if working alone on branch)

---

## Best Practices

### Branching Best Practices

1. **Use descriptive branch names**
   - ✅ `feature/user-authentication`
   - ❌ `fix` or `new-feature`

2. **Keep branches short-lived**
   - Merge and delete feature branches promptly
   - Avoid long-running branches that diverge significantly

3. **One feature per branch**
   - Don't mix unrelated changes
   - Easier to review and rollback

4. **Regularly sync with main**
   - Merge or rebase main into your feature branch regularly
   - Reduces conflicts and keeps code current

### Committing Best Practices

1. **Commit often**
   - Small, logical units of work
   - Easier to understand and review
   - Easier to rollback if needed

2. **Write meaningful commit messages**
   - Use imperative mood: "Add feature" not "Added feature"
   - Explain what and why, not how
   - Reference issue numbers when applicable

3. **Don't commit broken code**
   - Ensure code compiles
   - Run tests before committing
   - Use `git commit --no-verify` sparingly (skip hooks)

4. **Review before committing**
   ```bash
   # Always check what you're committing
   git status
   git diff --staged
   ```

### Merging Best Practices

1. **Always test before merging**
   - Verify feature works correctly
   - Run all tests
   - Test integration with main branch

2. **Keep main branch stable**
   - Never push directly to main (use PRs)
   - All merges should be reviewed
   - Use protected branches

3. **Resolve conflicts carefully**
   - Understand both sides of conflict
   - Test thoroughly after resolution
   - Get help if unsure

4. **Use meaningful merge commit messages**
   ```bash
   git merge --no-ff feature/new-feature -m "Merge feature: Add search filters

   Implements province dropdown and city autocomplete
   for car search functionality."
   ```

5. **Clean up after merging**
   - Delete merged branches locally and remotely
   - Keeps repository clean

---

## Common Patterns

### Pattern 1: Feature Development

```bash
# Create feature branch
git checkout -b feature/search-filters

# Develop with multiple commits
git commit -m "feat: Add province dropdown"
git commit -m "feat: Add city autocomplete"
git commit -m "fix: Handle empty search results"

# Update from main
git checkout main && git pull
git checkout feature/search-filters
git merge main

# Push and create PR
git push -u origin feature/search-filters
```

### Pattern 2: Quick Bug Fix

```bash
# Create fix branch
git checkout -b bugfix/fix-validation

# Make fix
git commit -m "fix: Correct email validation regex"

# Merge immediately
git checkout main
git merge bugfix/fix-validation
git push origin main
git branch -d bugfix/fix-validation
```

### Pattern 3: Interactive Commit Splitting

```bash
# Stage all changes
git add .

# Interactively choose what to commit
git add -p  # Stage parts of files

# Commit first part
git commit -m "feat: Add province dropdown"

# Commit second part
git add -p
git commit -m "feat: Add city autocomplete"
```

### Pattern 4: Undo and Recommit

```bash
# Realize you need to split a commit
git reset HEAD~1  # Undo last commit, keep changes

# Make separate commits
git add file1.tsx
git commit -m "First change"
git add file2.tsx
git commit -m "Second change"
```

### Pattern 5: Collaborative Feature Branch

```bash
# Team member A pushes work
git push origin feature/shared-feature

# Team member B pulls and continues
git pull origin feature/shared-feature

# Both continue working
# Use merge (not rebase) to preserve history
git checkout feature/shared-feature
git merge origin/main
```

---

## Troubleshooting

### Merge Conflicts

#### Problem: Too many conflicts
```bash
# Strategy: Accept one side entirely for certain files
git checkout --ours path/to/file.tsx  # Keep your version
git checkout --theirs path/to/file.tsx  # Keep their version
git add path/to/file.tsx
```

#### Problem: Complex conflict resolution
```bash
# Use merge tool
git mergetool

# Or abort and try rebase instead
git merge --abort
git rebase main
```

### Commit Issues

#### Problem: Committed to wrong branch
```bash
# 1. Note the commit hash
git log --oneline

# 2. Reset current branch
git reset --soft HEAD~1

# 3. Switch to correct branch
git checkout correct-branch

# 4. Cherry-pick the commit
git cherry-pick <commit-hash>
```

#### Problem: Need to change commit message after push
```bash
# Only if you're the only one who pulled
git commit --amend -m "New message"
git push --force-with-lease
```

### Branch Issues

#### Problem: Branch diverged from remote
```bash
# Fetch latest
git fetch origin

# See the difference
git log HEAD..origin/feature/my-feature

# Merge or rebase
git merge origin/feature/my-feature
# or
git rebase origin/feature/my-feature
```

#### Problem: Accidentally deleted branch
```bash
# Find the commit hash
git reflog

# Recreate branch from that commit
git checkout -b recovered-branch <commit-hash>
```

### Merge Issues

#### Problem: Merge went wrong, want to start over
```bash
# Abort the merge
git merge --abort

# Start fresh
git checkout main
git pull origin main
git merge feature/new-feature
```

#### Problem: Merged wrong branch
```bash
# Undo the merge (before pushing)
git reset --hard HEAD~1

# Or revert if already pushed
git revert -m 1 HEAD
```

---

## Quick Reference

### Daily Workflow
```bash
git checkout main
git pull origin main
git checkout -b feature/my-feature
# ... make changes ...
git add .
git commit -m "feat: Description"
git push -u origin feature/my-feature
# ... create PR, get approval ...
git checkout main
git merge feature/my-feature
git push origin main
git branch -d feature/my-feature
```

### Common Commands
```bash
# Branching
git branch                    # List branches
git checkout -b new-branch    # Create and switch
git branch -d old-branch      # Delete branch

# Committing
git add .                     # Stage all
git commit -m "Message"       # Commit
git commit --amend            # Fix last commit

# Merging
git merge branch-name         # Merge branch
git merge --abort             # Cancel merge
```

---

*This guide is tailored for the auto-dealership-app project workflow and best practices.*
