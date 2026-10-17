---
name: merged
description: After a pull request is merged into develop, move its ClickUp ticket to "done" and comment the merge on it. Use when the user says a PR was merged, asks to close/finish/mark done the ticket for a merged PR, or wants to sweep merged PRs whose tickets are still "in review". Counterpart of the ship skill.
argument-hint: '[PR number, PR URL or branch — omit to sweep recently merged PRs]'
---

# Merged

Closes the loop that `ship` opens: `ship` raises a PR and moves its ticket to `in review`. Once that PR is merged
into `develop`, this skill moves the ticket to `done`.

Ask the user once (step 4) before changing anything in ClickUp.

## Fixed facts about this repo

- GitHub repo: `travelNinja4/travel-ninja-frontend`. Pass `--repo travelNinja4/travel-ninja-frontend` to every
  `gh` command.
- Feature and bugfix PRs merge into `develop`. A merge into `develop` counts as done. Release PRs
  (`develop` → `main`) are not tied to a ticket, so skip them.
- ClickUp: workspace `9014669434`, list **Travel-ninja-frontend** `1000340000005717`.
- Statuses (exact lowercase names): `backlog` → `scoping` → `in design` → `ready for development` →
  `in development` → `in review` → `done`, plus `cancelled`.
- PRs raised by `ship` have the ticket on their first body line:
  `**ClickUp:** [<ticket title>](<task_url>) (CU-<task id>)`. The PR title is the ticket title, word for word.

## Steps

### 1. Preflight

- `gh auth status`. If not logged in, tell the user to run `! gh auth login` and stop.
- Load the ClickUp tools with ToolSearch if they are deferred (`clickup_get_task`, `clickup_search`,
  `clickup_update_task`, `clickup_create_task_comment`).

### 2. Collect the PRs

- **With `$ARGUMENTS`** (a PR number, URL or branch):
  `gh pr view <arg> --repo travelNinja4/travel-ninja-frontend --json number,title,url,state,mergedAt,baseRefName,headRefName,body`.
  If it isn't `MERGED`, say so and stop. Don't move a ticket for an open or closed-unmerged PR.
- **Without arguments**, sweep recent merges:
  `gh pr list --repo travelNinja4/travel-ninja-frontend --state merged --base develop --limit 30 --json number,title,url,mergedAt,headRefName,body`.

Ignore PRs from `dependabot/*` branches and PRs whose head is `develop` (release PRs).

### 3. Find each PR's ticket

Look in this order and stop at the first hit:

1. `CU-<id>` or `app.clickup.com/t/<id>` in the PR body, title or branch name.
2. `clickup_search` for the PR title in list `1000340000005717` (`asset_types: ["task"]`). Accept only a task
   whose name matches the PR title exactly, ignoring case.

Fetch each ticket with `clickup_get_task` to read its name and status, then sort them:

| Ticket status | What happens |
|---|---|
| `in review` | Move to `done`. This is the normal case. |
| `backlog` … `in development` | Move to `done`, but flag it in step 4 because it skipped review in ClickUp. |
| `done` | Already finished. Report it and don't touch it. In a sweep, leave these out completely. |
| `cancelled` | Don't touch it. Report it. |
| No ticket found | Report the PR so the user can link it by hand. |

If the sweep finds nothing to move, say so and stop.

### 4. Confirm once

One `AskUserQuestion` listing each ticket that will move: ticket title → `done`, with its PR number and merge
date. Mark any flagged ones. Option "Go ahead". With several tickets, use `multiSelect` so the user can untick
some. Do nothing in ClickUp before this answer.

### 5. Move and comment

For each confirmed ticket:

1. `clickup_update_task` with `status: "done"`.
2. `clickup_create_task_comment`: `PR merged into develop: <PR title> — <PR url>`.

If an update fails (for example, a required custom field), report it and carry on with the rest.

### 6. Report

A few lines per ticket: title (linked), its old status → `done`, and the PR link. After that, list the skipped
PRs (already done, cancelled, no ticket).

If the merged branch still exists locally, mention that the user can clean it up
(`git switch develop && git pull && git branch -d <branch>`). Don't run that yourself.
