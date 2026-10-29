# Travel Ninja Docs

The user guide and testing reference for Travel Ninja, built with [Docusaurus](https://docusaurus.io/).

This is a separate project with its own dependencies and lockfile. It is not part of the Next.js app build.

## Commands

Run these from the repository root:

| Command              | What it does                                      |
| -------------------- | ------------------------------------------------- |
| `pnpm docs:install`  | Installs the docs site's dependencies             |
| `pnpm docs:dev`      | Starts the docs site at http://localhost:3001      |
| `pnpm docs:build`    | Builds the static site into `docs-site/build`     |

## Writing docs

- Pages live in `docs/` as Markdown (`.md`) or MDX (`.mdx`) files.
- The sidebar is generated from the folders. Order pages with `sidebar_position` in their front matter, and label folders with a `_category_.json` file.
- When a feature ships, update its user guide page and add an entry to `docs/release-notes.md` in the same PR.
