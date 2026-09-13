# `.pi/skills/` — project-local Pi agent skills

Each subdirectory holds one skill following the
[Agent Skills spec](https://agentskills.io/specification):

```
.pi/skills/
└── <skill-name>/
    └── SKILL.md   # YAML frontmatter (name, description) + Markdown body
```

## How Pi picks them up

Pi auto-discovers `.pi/skills/` from the cwd, searching up to the git repo
root. The presence of `.pi/skills/` (and `.pi/settings.json`) is itself a
trust-prompt trigger — **on the next interactive Pi session in this directory,
Pi will ask you to trust the project.** Approve it; the decision is cached in
`~/.pi/agent/trust.json` for future sessions.

Once trusted:

- Skills load automatically when their `description` matches the task.
- Use `/skill:astro-frontend` to force-load the full SKILL.md on demand
  (requires `enableSkillCommands: true`, set in `.pi/settings.json`).
- Use `pi --skill <path>` to load a skill without trusting the project.

Trust is permission-based, not a sandbox — review skill content before use.

## Adding a new skill

1. Create `.pi/skills/<name>/SKILL.md`.
2. Add valid frontmatter: `name` (≤64 chars, lowercase, hyphens) and
   `description` (≤1024 chars, non-empty).
3. Reference nested files relative to the skill directory.

## Current skills

- `astro-frontend/` — Astro 5/6 conventions for this repo's kosmos-hub blog
  (content collections, hydration directives, integrations, GH Pages deploy).
