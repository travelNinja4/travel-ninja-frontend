---
name: ship
description: Push the current work the way this repo expects — move it off develop/main onto a feature or bugfix branch, find or create its ClickUp ticket, run the checks, push, open a pull request into develop, then move the ticket to "in review" and comment the PR link on it. Use whenever the user asks to push, ship, raise an MR/PR, or "send this for review", and before any push while on develop or main.
argument-hint: '[short description of the change]'
---

# Ship

Takes local work to an open pull request, following this repo's flow:
`feature/*` or `bugfix/*` → PR into `develop` → (release) PR from `develop` into `main`.

Nothing is pushed to `develop` or `main` directly. Ask the user once, before anything goes outside this
machine: step 5 collects every decision in a single prompt.

`$ARGUMENTS`, if given, describes the change. Use it for the branch name, the ticket search and the ticket/PR title.

## Fixed facts about this repo

- GitHub repo: `travelNinja4/travel-ninja-frontend`. Pass `--repo travelNinja4/travel-ninja-frontend` to every
  `gh` command so it never guesses the wrong repo.
- PR base branch: `develop`. Release PRs go from `develop` into `main`.
- A single Next.js (App Router) app with Vitest unit/snapshot tests and Storybook. Use pnpm only.
- Branch names: `feature/<kebab-case>` for new behaviour, `bugfix/<kebab-case>` for fixes. Keep them short:
  2–4 words, no ticket ID, e.g. `feature/login-flow`, `feature/reset-password`, `bugfix/registration-flow`.
  Match the existing branches (`git branch -a`).
- Commit messages: short lowercase summary in the past tense, e.g. `implemented sideNavBar`,
  `fixed test cases`, `added date picker component`. Match `git log --oneline -10` (ignore merge commits).
- Git hooks: husky runs `lint-staged` (prettier + eslint `--fix`) on commit. Never pass `--no-verify`. If the
  hook fails, fix the cause and commit again (a new commit, not `--amend`).
- ClickUp: workspace `9014669434`, list **Travel-ninja-frontend** `1000340000005717`
  (https://app.clickup.com/9014669434/v/l/li/1000340000005717). Tickets go there unless the user says otherwise.
- ClickUp statuses on that list, in order (use these exact lowercase names in API calls):
  `backlog` → `scoping` → `in design` → `ready for development` → `in development` → `in review` → `done`,
  plus `cancelled`. There is no "to do".
- Every ticket title starts with `UI - `. The PR title is the ClickUp ticket title, word for word.

## Steps

### 1. Preflight

Run these and stop with clear instructions if any fails:

- `gh --version` and `gh auth status`. If `gh` is missing, tell the user to run `brew install gh`. If it isn't
  logged in, tell them to run `! gh auth login` and pick the GitHub account that has access to `travelNinja4`.
  Then stop. Those are interactive and belong to the user.
- `git fetch origin develop --quiet`
- `git status --porcelain=v1 -b`, `git branch --show-current`, and
  `git log --oneline origin/develop..HEAD` (commits not on develop yet).

If there is nothing to ship (clean tree and no commits ahead of `origin/develop`), say so and stop.

Then run the checks from the root:

- `pnpm lint`
- `pnpm exec tsc --noEmit`. `next.config.ts` sets `ignoreBuildErrors`, so this is the only type check. Fix errors
  in files this change touches. If errors already exist on `origin/develop` in files you didn't touch, mention
  them in the report and don't block on them.
- `pnpm test` (CI runs it on every PR into `develop`). If a snapshot fails only because the diff intentionally
  changed that component's markup, update just that snapshot (`pnpm test -u <path-to-test>`) and include it.
  Any other failure has to be fixed.

If a check fails and the fix isn't obvious, stop and report the output. Don't ship red checks.

### 2. Work out the situation

| Current branch | What happens |
|---|---|
| `develop` | New branch needed. The work may be uncommitted, committed locally, or both. |
| `main` | New branch needed. Warn that work should start from `develop`. If the local commits don't apply cleanly onto `origin/develop`, stop and ask. |
| Anything else | Use the current branch. Skip branch creation. If a PR for it already exists (`gh pr view <branch> --repo travelNinja4/travel-ninja-frontend --json url,state,title`), this becomes a normal push, and step 8 only reports the existing PR. |

Read the changes (`git diff origin/develop...HEAD --stat`, `git diff --stat`, and the diff itself if the stat
isn't enough) so you understand what is being shipped. The branch name, ticket and PR are all based on it.

Note if `package.json` / `pnpm-lock.yaml` changed (new dependencies) or if new env vars are read
(`process.env.*`). The PR must call these out, because reviewers need to `pnpm install` or add the variable to
`.env` and CI secrets.

### 3. Find the ticket

Load ClickUp tools with ToolSearch if they are deferred.

Look in this order and stop at the first hit:

1. A ClickUp task ID or URL in `$ARGUMENTS`, the branch name, or the commit messages
   (`CU-<id>`, `app.clickup.com/t/<id>`). Fetch it with `clickup_get_task` to get its name and status.
2. `clickup_search` with 2–4 keywords from the change (for example "reset password form"). Filter to
   `asset_types: ["task"]` and location list `1000340000005717`, and exclude `done`/`cancelled`. Keep the best
   3 matches, judged by title.

If nothing credible turns up, plan a new ticket. Drafting it follows the user's `/ticket` command:
- **Title:** `UI - ` followed by a short, clear imperative summary, e.g. `UI - Add reset password form`.
- **List:** `1000340000005717`.
- **Assignee:** the user (resolve "me" with `clickup_resolve_assignees`).
- **Priority:** `normal`.
- **Description:** a short markdown summary of the change, written from the diff.

If an existing ticket's title doesn't start with `UI - `, plan to rename it to `UI - <current title>` and show
that in step 5.

### 4. Draft the rest

- **Branch name** (only if a new branch is needed): `feature/…` or `bugfix/…`, based on what the diff does.
- **Commit message** (only if there are uncommitted changes): match the repo style above, and end with the
  attribution lines the session asks for.
- **PR title:** exactly the ClickUp ticket title (e.g. `UI - Add reset password form`).

### 5. Confirm once

Show the whole plan in a single `AskUserQuestion`: branch, ticket (existing match or the new draft), commit
message, PR title, base, and that the ticket will be moved to `in review` with the PR link commented on it.
When search found candidates, the options are the candidates plus "Create a new ticket". Otherwise it is one
"Go ahead" option; the user can edit through "Other". Do nothing outward-facing before this answer.

### 6. Branch and commit

On `develop` or `main`:
1. `git switch -c <branch>`. This carries uncommitted changes and local commits along.
2. If the old branch had local commits that aren't on `origin`, reset it so it doesn't stay diverged:
   `git branch -f <old-branch> origin/<old-branch>`. This moves only the branch pointer, and the work is safe on the
   new branch. Mention it in the report.

Then, if the tree is dirty, stage the changes by path (`git add <paths>`, never `-A`), leaving out anything that
looks like a secret or a local artefact: `.env` / `.env.*` (but `.env.example` is fine), `credentials.json`,
`*.pem`, `*.key`, logs, `*.tsbuildinfo`, `.next/`, `coverage/`, `storybook-static/`, `docs/` (JSDoc output),
`node_modules/`. Then commit. The husky hook runs here.

### 7. Create the ticket (if new), then push

- New ticket: `clickup_create_task` with the confirmed draft. Keep the task ID, name and `task_url`.
- Existing ticket that needs the `UI - ` prefix: rename it with `clickup_update_task`.
- `git push -u origin <branch>`. If the push is rejected, stop and report. Never force-push.

### 8. Open the PR

Skip this if step 2 found an existing PR.

```
gh pr create --repo travelNinja4/travel-ninja-frontend --base develop --head <branch> \
  --title "<ClickUp ticket title>" --body-file <tmp file>
```

Body:

```
**ClickUp:** [<ClickUp ticket title>](<task_url>) (CU-<task id>)

## Summary
<2–4 bullets: what changed and why>

## Testing
- [x] pnpm lint
- [x] pnpm exec tsc --noEmit
- [x] pnpm test
- [ ] <manual checks a reviewer should do, e.g. "open /login/forgot-password → submit email → see success toast">

<"New dependencies — run pnpm install" and/or "New env var: X" if step 2 flagged them; otherwise omit>

<attribution line the session asks for>
```

Write the body to a file in the scratchpad rather than inlining it, so quotes and backticks survive.

### 9. Move the ticket to In Review, link the PR, and report

Do these without asking again, because step 5 already covered them:

1. Move the ticket to `in review` with `clickup_update_task` (`status: "in review"`). This applies to new tickets
   and to existing ones in `backlog`, `scoping`, `in design`, `ready for development` or `in development`. If the
   ticket is already `in review`, leave it. If it's `done` or `cancelled`, don't change it. Mention it in the report.
2. Add a comment on the ticket with `clickup_create_task_comment`:
   `PR raised: <PR title> — <PR url>` (also when step 2 found an existing PR that isn't linked yet).
3. Report in a few lines: branch, ticket link and its status, PR link, and anything that was done to `develop`
   or `main` locally (step 6.2).
