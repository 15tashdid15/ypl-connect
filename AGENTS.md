<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---
# AGENTS.md — YPL Connect / ARMS

This file contains binding repository instructions for any AI coding assistant or developer.

## Read first

Before proposing or editing code, read:

1. `PROJECT_CONTEXT.md`
2. the newest entry in `docs/SESSION_LOG.md`
3. `package.json`
4. `prisma/schema.prisma`
5. `git status`
6. `git branch --show-current`
7. `git rev-parse --short HEAD`

The exact branch and commit SHA are authoritative.

## Repository identity boundary

- Repository: `15tashdid15/ypl-connect`
- Only authorised GitHub write identity: `15tashdid15`
- Before push/PR/merge:
  - run `gh auth status`
  - run `gh api user --jq .login`
- Stop if the login is not exactly `15tashdid15`.
- Never push through `Rifat2342` or any other account.

## Current baseline

- Work from `feature/cv-parsing-foundation` at `8ef8769` unless `PROJECT_CONTEXT.md` records a newer approved checkpoint.
- Do not start from `main`.
- Do not merge the AI feature branch until Phase 0A gates pass.

## Product direction

YPL Connect is an AI-assisted recruitment intelligence platform, not only a CV parser.

The two principal AI domains are:

- Candidate Intelligence
- Job Intelligence

Use deterministic rules for validation/security/workflow. Use local AI first for sensitive documents. Treat cloud AI as a controlled, auditable fallback. AI must support, not replace, recruiter decisions.

## Engineering rules

- Inspect before editing.
- Work one bounded task at a time.
- Preserve unrelated changes.
- Never commit secrets, credentials, candidate PII, CV content, or production data.
- Use transactions for multi-record integrity.
- Design workers for atomic claims, idempotency, retries, stale recovery, and concurrency.
- Validate all AI output at runtime.
- Add tests for every defect fixed.
- Run the relevant quality gates after changes.
- Do not introduce a second backend solely to mimic a proposal diagram.
- Keep the full-stack Next.js architecture for MVP unless an approved architecture decision changes it.

## Required quality gates

At minimum, report:

```powershell
npm run lint
npx tsc --noEmit
npx prisma validate
npm run build
```

Also run unit/integration/end-to-end tests once their scripts exist.

## End-of-session continuity

For every meaningful session:

1. update `PROJECT_CONTEXT.md`;
2. append `docs/SESSION_LOG.md`;
3. record changed files, commands, tests, migrations, environment changes, risks, and next task;
4. commit documentation with the code it describes.

A session is not complete while the repository context is stale.
