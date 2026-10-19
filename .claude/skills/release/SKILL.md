---
name: release
description: Raise the release pull request from develop into main, titled "[DEV TO MAIN] Prod deployment DD-MM-YYYY", with a description listing every PR included and any dependency or env var changes. Use when the user asks to release, deploy to prod, or raise/open a PR from dev/develop to main.
argument-hint: '[optional date DD-MM-YYYY, defaults to today]'
---

# Release

Opens the release PR `develop` → `main`. Feature work reaches `develop` through the `ship` skill; this skill
only promotes what is already merged into `develop`. It never pushes to `develop` or `main`, never merges the
PR, and never force-pushes.

`$ARGUMENTS`, if given, is the release date to use in the title instead of today.

## Fixed facts about this repo

- GitHub repo: `travelNinja4/travel-ninja-frontend`. Pass `--repo travelNinja4/travel-ninja-frontend` to every
  `gh` command.
- Base: `main`. Head: `develop`.
- Title: `[DEV TO MAIN] Prod deployment DD-MM-YYYY`, with today's local date (`date +%d-%m-%Y`) unless a date was
  given, e.g. `[DEV TO MAIN] Prod deployment 19-10-2026`. Older release PRs used `[DEV TO TEST]`; don't copy that.
- Feature PRs merge into `develop` as `Merge pull request #<n> from travelNinja4/<branch>` commits. That is how
  the included PRs are found.
- Never read `.env` or `.env.*` files (they hold secrets). `.env.example` is fine.

## Steps

### 1. Preflight

- `gh auth status`. If not logged in, tell the user to run `! gh auth login` and stop.
- `git fetch origin develop main --quiet`
- Existing release PR: `gh pr list --repo travelNinja4/travel-ninja-frontend --base main --head develop --state open --json number,url,title`.
  If one is open, don't create another. Report its link and offer to update its title and description with
  the steps below (`gh pr edit <n> --title ... --body-file ...`).
- `git rev-list --count origin/main..origin/develop`. If it's 0, there's nothing to release: say so and stop.
- `git rev-list --count origin/develop..origin/main`. If it's not 0, `main` has commits `develop` lacks (likely
  a hotfix). List them with `git log --oneline origin/develop..origin/main`, warn that the PR may conflict or
  that `main` should be merged back into `develop` first, and ask before going on.

### 2. Collect what's included

1. Find the merged PR numbers:
   `git log --merges --format=%s origin/main..origin/develop | grep -oE '^Merge pull request #[0-9]+' | grep -oE '[0-9]+'`
2. For each number, get its title and link:
   `gh pr view <n> --repo travelNinja4/travel-ninja-frontend --json number,title,url,author`.
   List them newest first as `- #<n> <title>`, and put dependabot PRs in their own group.
3. Commits pushed straight to `develop` without a PR (non-merge commits that aren't part of any merged PR's
   branch) are worth flagging. Find them with `git log --first-parent --no-merges --oneline origin/main..origin/develop`
   and list them under "Direct commits" if there are any.

### 3. Check what deployers need to know

- **Dependencies:** `git diff --stat origin/main origin/develop -- package.json pnpm-lock.yaml`. If they changed,
  note "run `pnpm install`" and name notable upgrades from the `package.json` diff (e.g. Next.js major version).
- **Env vars:** compare the names on each side:
  `git grep -ohE 'process\.env\.[A-Z0-9_]+' origin/main -- src | sort -u` vs the same for `origin/develop`.
  List any name that's only on `develop` as "New env var: X, add it to the deployment environment", and any name
  only on `main` as no longer used. Also check `git diff origin/main origin/develop -- .env.example`.
- **CI on develop:** `gh run list --repo travelNinja4/travel-ninja-frontend --branch develop --limit 3 --json name,conclusion,url`.
  If the latest run failed, say so in the confirmation and in the description.

### 4. Confirm once

Show the title, the number of commits, the included PR list and the notes in a single `AskUserQuestion` with a
"Go ahead" option (the user can change things through "Other"). Do nothing outward-facing before the answer.

### 5. Open the PR

Write the description to a file in the scratchpad so quotes and backticks survive:

```
Release of `develop` into `main` (<count> commits).

## Included
- #<n> <PR title>
- ...

<"### Dependabot" group, and "### Direct commits" if step 2 found any; otherwise omit>

## Deployment notes
- <"Dependencies changed (<notable upgrades>): run `pnpm install`." or "No dependency changes.">
- <"New env var: X, add it to the deployment environment." for each, or "No new env vars.">
- <"CI on develop failed: <url>" if so; otherwise omit>

## Checklist
- [ ] Deployed to the test environment and smoke-tested
- [ ] Env vars set in the deployment environment

<attribution line the session asks for>
```

Then:

```
gh pr create --repo travelNinja4/travel-ninja-frontend --base main --head develop \
  --title "[DEV TO MAIN] Prod deployment <DD-MM-YYYY>" --body-file <tmp file>
```

### 6. Report

Give the PR link and title, the commit and PR counts, and the deployment notes in a few lines. Don't merge it.
