---
name: release
description: Raise the release pull request from develop into main, titled "[DEV TO MAIN] Prod deployment DD-MM-YYYY", with a description listing every PR included and any dependency or env var changes. Before that, bring the Docusaurus business documentation up to date for the release (module pages written like a business analyst, Storybook screenshots, flowcharts, release notes) and open it as a docs PR into develop. Use when the user asks to release, deploy to prod, raise/open a PR from dev/develop to main, or update/regenerate the business docs.
argument-hint: '[DD-MM-YYYY] [--no-docs | --docs-only]'
---

# Release

Opens the release PR `develop` → `main`, together with the business documentation for what's in it. Feature work
reaches `develop` through the `ship` skill. This skill only promotes what is already merged into `develop`, and the
docs reach `develop` through their own PR. It never pushes to `develop` or `main`, never merges a PR, and never
force-pushes.

`$ARGUMENTS` can contain:
- a date `DD-MM-YYYY` to use in the title and release notes instead of today;
- `--no-docs`: skip step 4 (the documentation);
- `--docs-only`: do steps 1 and 4–6 for the docs PR only, with no release PR. Use it to backfill or refresh the docs
  between releases. Step 1's "nothing to release" check doesn't stop this mode.

## Fixed facts about this repo

- GitHub repo: `travelNinja4/travel-ninja-frontend`. Pass `--repo travelNinja4/travel-ninja-frontend` to every
  `gh` command.
- Base: `main`. Head: `develop`.
- Title: `[DEV TO MAIN] Prod deployment DD-MM-YYYY`, with today's local date (`date +%d-%m-%Y`) unless a date was
  given, e.g. `[DEV TO MAIN] Prod deployment 19-10-2026`. Older release PRs used `[DEV TO TEST]`; don't copy that.
- Feature PRs merge into `develop` as `Merge pull request #<n> from travelNinja4/<branch>` commits. That is how
  the included PRs are found.
- Never read `.env` or `.env.*` files (they hold secrets). `.env.example` is fine.
- Docs site: Docusaurus in `docs-site/` (its own `package.json`; root scripts `docs:install`, `docs:dev`,
  `docs:build`). Pages live in `docs-site/docs/`, images in `docs-site/static/img/`. `onBrokenLinks: 'throw'`, so a
  broken link fails the build.
- Screenshots: `pnpm docs:screenshots` (`scripts/docs-screenshots.mjs`) captures Storybook stories with Playwright.
  Storybook runs with `pnpm storybook --ci` on port 6006.
- Branch and commit style are the same as in the `ship` skill: a short `feature/<kebab-case>` branch, and a lowercase
  past-tense commit message.

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
- Unless `--no-docs`: `git status --porcelain`. Step 4 switches branches, so the tree must be clean. If it isn't,
  ask the user to commit or stash first, and stop. Note the current branch (`git branch --show-current`) so you can
  return to it in step 6.

### 2. Collect what's included

1. Find the merged PR numbers:
   `git log --merges --format=%s origin/main..origin/develop | grep -oE '^Merge pull request #[0-9]+' | grep -oE '[0-9]+'`
2. For each number, get its title and link:
   `gh pr view <n> --repo travelNinja4/travel-ninja-frontend --json number,title,url,author,body`.
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

### 4. Write the business documentation (skip with `--no-docs`)

**Read [business-docs.md](business-docs.md) first.** It sets the voice, page structure, screenshot and flowchart
rules. Everything in this step is local; nothing leaves the machine until step 5 is answered.

#### 4.1 Branch and scope

- `git switch -c feature/release-docs-<DD-MM-YYYY> origin/develop`. If that branch already exists from an earlier
  run, switch to it and `git merge origin/develop`.
- Work out the **modules** (the user-facing areas: one per folder in `src/app/` that has a `page.tsx`, with the
  account screens `login`, `create-account` and their sub-pages grouped as "Getting started"; skip `not-found` and
  `favicon`):
  - **Changed in this release:** `git diff --name-only origin/main origin/develop -- src docs-site`. Map each changed
    file to the module(s) that show it. A file under `src/app/<module>/` belongs to that module. For a shared file in
    `src/components/`, `src/constants/` or `src/hooks/`, find which module pages import it (`git grep`). A change used
    by every page, like the sidebar or header, goes on the Introduction page.
  - **Missing:** modules that have no page in `docs-site/docs/` yet. Document these too, so the set becomes complete
    (the first run backfills everything).
  - With `--docs-only`, treat every module as in scope and check each existing page against the code.
- Always in scope: `release-notes.md` (except with `--docs-only`). Also in scope: `index.md` and `glossary.md`
  whenever a module is added, removed or changes what it is for.

#### 4.2 One-time setup

Check these and fix only what's missing:

- `docs-site/node_modules` exists. If not: `pnpm docs:install`.
- Mermaid flowcharts: `docs-site/docusaurus.config.ts` has `markdown: { mermaid: true }` and
  `themes: ['@docusaurus/theme-mermaid']`. If not, run `pnpm --dir docs-site add @docusaurus/theme-mermaid@<same version as @docusaurus/core>`
  and add both keys to the config (top level, next to `presets`).
- Playwright's Chromium: `pnpm exec playwright install chromium` (does nothing if it's already installed).

#### 4.3 Screenshots

1. If `curl -sf http://localhost:6006/index.json -o /dev/null` fails, start Storybook in the background
   (`pnpm storybook --ci`, with `run_in_background`) and wait for it:
   `curl -s --retry 60 --retry-delay 2 --retry-connrefused http://localhost:6006/index.json -o /dev/null`.
   If you started it, stop it when the screenshots are done.
2. For each module in scope: `pnpm docs:screenshots --list <module>` to see its stories, then
   `pnpm docs:screenshots <module> <story-id>[=<name>] ...` for the states the page explains.
3. Read every image you'll use and check it (see "Screenshots" in business-docs.md). Retake or drop broken ones.
4. Delete images under `docs-site/static/img/screens/` that no page references anymore.

#### 4.4 Pages

For each module in scope, read its code (see "Where the facts come from") and the PR descriptions from step 2, then
create or update its page from the template in business-docs.md, with screenshots and flowcharts where the guide
calls for them. Then update `index.md` (modules table, end-to-end journey flowchart) and `glossary.md` if they're in
scope.

#### 4.5 Release notes

In `docs-site/docs/release-notes.md`, add a section for this release at the top, under the intro:

```md
## <DD-MM-YYYY>

### New
- **<Feature in business words>.** <What a user can now do.> See [<Page>](./user-guide/<page>.md).
### Improved
- ...
### Fixed
- **<What was wrong, as the user saw it>** is fixed.
```

Write each entry from the PR titles, descriptions and diffs, in business language. Leave out changes users can't see
(tests, refactors, CI, dependency bumps), and drop empty groups. Fold any entries in the existing **Unreleased** section
into this release (keep their wording if it's accurate) and remove that section. Every entry about a screen links to
its page, so the testing team knows what to check.

#### 4.6 Verify and commit

- `pnpm docs:build` must pass. Fix broken links or Markdown errors and rebuild.
- `pnpm exec prettier --check docs-site/docs` (fix with `--write` if it complains).
- Stage by path (`git add docs-site/docs docs-site/static/img docs-site/docusaurus.config.ts`, plus
  `docs-site/package.json docs-site/pnpm-lock.yaml` if 4.2 added Mermaid). Never `-A`, and never stage
  `docs-site/build/` or `docs-site/.docusaurus/`.
- Commit: `updated business docs for release <DD-MM-YYYY>` (or `updated business docs` with `--docs-only`), ending
  with the attribution lines the session asks for. The husky hook runs here.

### 5. Confirm once

Show everything in a single `AskUserQuestion` with a "Go ahead" option (the user can change things through "Other"):

- **Docs PR** (unless `--no-docs`): branch, title `UI - Update business docs for release <DD-MM-YYYY>`, base `develop`,
  the pages created or updated, the number of screenshots, and any open questions or screens with no story.
- **Release PR** (unless `--docs-only`): title, number of commits, the included PR list and the deployment notes.

Do nothing outward-facing before the answer.

### 6. Push the docs and open the docs PR (skip with `--no-docs`)

- `git push -u origin feature/release-docs-<DD-MM-YYYY>`. If it's rejected, stop and report. Never force-push.
- Open the PR into `develop`, with the body in a scratchpad file:

```
Business documentation for the release of <DD-MM-YYYY>.

## Pages
- <New|Updated>: <page title> (<path>)
- ...

## Screenshots
<count> images from Storybook. <"No story yet for: <screens>" if any>

## For the reviewer
- [ ] `pnpm docs:dev` and read the changed pages
- [ ] <open questions from step 4, if any>

<attribution line the session asks for>
```

```
gh pr create --repo travelNinja4/travel-ninja-frontend --base develop --head feature/release-docs-<DD-MM-YYYY> \
  --title "UI - Update business docs for release <DD-MM-YYYY>" --body-file <tmp file>
```

- Switch back to the branch noted in step 1 (`git switch <branch>`).

The release PR's head is `develop`, so once the docs PR is merged into `develop` the release PR includes the docs
automatically. There's no need to wait for it before step 7.

### 7. Open the release PR (skip with `--docs-only`)

Write the description to a file in the scratchpad so quotes and backticks survive:

```
Release of `develop` into `main` (<count> commits).

## Included
- #<n> <PR title>
- ...

<"### Dependabot" group, and "### Direct commits" if step 2 found any; otherwise omit>

## Documentation
<"Business docs: #<docs PR number>. Merge it into `develop` before this PR so the docs ship with the release." or,
with `--no-docs`, "Docs not updated in this release.">

## Deployment notes
- <"Dependencies changed (<notable upgrades>): run `pnpm install`." or "No dependency changes.">
- <"New env var: X, add it to the deployment environment." for each, or "No new env vars.">
- <"CI on develop failed: <url>" if so; otherwise omit>

## Checklist
- [ ] Docs PR #<n> merged into `develop` <omit with --no-docs>
- [ ] Deployed to the test environment and smoke-tested
- [ ] Env vars set in the deployment environment

<attribution line the session asks for>
```

Then:

```
gh pr create --repo travelNinja4/travel-ninja-frontend --base main --head develop \
  --title "[DEV TO MAIN] Prod deployment <DD-MM-YYYY>" --body-file <tmp file>
```

### 8. Report

In a few lines: the docs PR link and the pages it changes, the release PR link and title, the commit and PR counts,
the deployment notes, and any open questions or screens without screenshots. Don't merge either PR.
