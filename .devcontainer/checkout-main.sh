#!/bin/bash
set -e

# Only run if we are inside a git repo
if [ -d ".git" ]; then
    echo "🔍 Checking current Git branch..."

    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo "⚠️ Uncommitted changes detected. Skipping branch switch to avoid overwriting work."
        exit 0
    fi

    git fetch origin main

    # Get current branch
    current_branch=$(git rev-parse --abbrev-ref HEAD)

    if [ "$current_branch" != "main" ]; then
        echo "🔄 Switching to main branch..."
        git checkout main || echo "❌ Could not checkout main, please check manually."
    else
        echo "✅ Already on main branch."
    fi

    # Pull latest changes
    echo "⬇️ Pulling latest changes from main..."
    git pull origin main || echo "❌ Could not pull from main, check your network or permissions."
else
    echo "❌ No .git directory found. Please clone the repo before opening devcontainer."
fi
