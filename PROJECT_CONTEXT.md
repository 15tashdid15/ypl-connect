# YPL Connect / ARMS - Project Progress, Handoff, and Completion Roadmap

**Audit date:** 2 August 2026  
**Repository:** https://github.com/15tashdid15/ypl-connect  
**Repository owner and only authorised GitHub write identity:** `15tashdid15`  
**Current working mode:** GitHub documentation updates are authorised, but every write must be performed only while authenticated as `15tashdid15`. At the 2 August 2026 audit, the connected GitHub identity was `Rifat2342` with no push permission, so remote writes remain blocked until the correct account is connected.

## 1. Executive handoff

YPL Connect is currently a functional early Applicant Tracking System foundation with:

- a corporate public website;
- a static blind job board;
- job application and private CV upload;
- PostgreSQL persistence for candidates and applications;
- recruiter sign-in;
- recruiter dashboard, candidate list, application list, status changes, notes, and CV download;
- database models and background code for CV parsing, Ollama-based profile extraction, embeddings, semantic search, hybrid matching, and candidate recommendations.

It is **not yet a production-ready enterprise ARMS**. No proposal module is enterprise-complete. The strongest area is the application-management workflow. The newest AI work exists mainly as library code, database models, migrations, and manual scripts; recruiters cannot yet use it from the dashboard.

The safest completion strategy is:

1. Stabilise the current feature branch.
2. Finish a production MVP.
3. Add the remaining enterprise modules in controlled releases.
4. Add 2-million-record scale architecture only after the workflows and data model are stable.

## 2. Project goal

### Business goal

Replace YPL's fragmented recruitment process - WhatsApp CVs, email attachments, local files, repeated records, manual screening, and disconnected client communication - with one secure recruitment platform that manages candidates from intake through placement.

### Recommended immediate release goal

The next release should be a **Production MVP**, not the full 24-week enterprise scope in one step. It should let YPL reliably:

- create and publish blind jobs from the database;
- receive and securely store applications;
- parse and review CV information;
- search, score, and recommend candidates;
- manage authorised recruiters and roles;
- move candidates through controlled recruitment stages;
- retain a complete audit history;
- operate with tests, monitoring, backups, and deployment documentation.

### Longer-term enterprise goal

The proposal documents add client CRM/portal, interviews, offers, finance, reports, notifications, WhatsApp/email ingestion, full nine-role RBAC, advanced security, high availability, and scale testing.

### Future platform vision

The visual roadmap extends beyond ARMS into a commercial SaaS/global recruitment-intelligence platform with multi-tenancy, subscriptions, mobile apps, video interviews, marketplace APIs, white labelling, localisation, multi-region deployment, and a recruiter copilot. These are later products, not MVP acceptance criteria.

## 3. Proposal scopes reviewed

| Source | Finish line | Main scope |
|---|---:|---|
| `ARMS_Proposal_YPL_by_kamal.pdf` | 15 weeks | Enterprise ARMS architecture, nine roles, ATS, blind portal, omnichannel intake, AI modules, security, QA, and deployment |
| `Presentation-Yes-By-Be-Digital_today.pdf` | 24 weeks | Ten modules, client portal, finance, reports, DevOps, training, documentation, and UAT |
| `ARMS - Proposal Plan 11072026.pdf` | 0-12+ months | Foundation, MVP, automation, enterprise, commercial SaaS, and global platform roadmap |

The repository matches the beginning of the Foundation/MVP stages. It does not yet meet the 15-week or 24-week enterprise acceptance scope.

## 4. Repository and branch status

### Remote state

- Default branch: `main`
- `main` commit: `6249be1` - `Delete CNAME`
- Latest implementation branch: `feature/cv-parsing-foundation`
- Latest feature commit: `8ef8769` - `Add AI skill intelligence and normalized matching taxonomy`
- Comparison with `main`: feature branch is **9 commits ahead and 2 commits behind**
- Feature-branch change size: **64 files, 4,273 insertions, 10 deletions**
- Open GitHub issues found: none
- No pull request exists for the CV/AI feature branch
- Current connector can read but cannot push; it is authenticated as `Rifat2342`. This identity must never be used for this project's writes.

The two commits on `main` after the merge base add and then remove a CNAME. The feature branch contains unrelated GitHub Pages/Jekyll files (`Gemfile`, `_config.yml`, and `index.md`) that should be reviewed during cleanup.

### Local audit checkout

- Local branch: `codex/finish-ypl`
- It points at `8ef8769` and tracks `origin/feature/cv-parsing-foundation`.
- No application source changes are pending.
- A generated local `.npm-cache/` directory is untracked and is not project code. It must not be committed.

### Development history

The merged ATS foundation was built through jobs pages, applications, PostgreSQL, R2 storage, recruiter authentication, recruiter management, and application audit notes. The unmerged feature branch then added:

1. CV parsing schema;
2. parse-job creation after application upload;
3. extracted-text persistence;
4. local CV intelligence;
5. embeddings and semantic search;
6. hybrid matching;
7. candidate recommendations;
8. skill aliasing and normalisation.

Tag order is inconsistent: `v0.15-ai-candidate-recommendation` is followed by `v0.14-skill-intelligence`. Do not rewrite published tags without an explicit release-management decision.

## 5. Current technical architecture

```mermaid
flowchart TD
    B["Public or recruiter browser"] --> N["Next.js application"]
    N --> P["PostgreSQL via Prisma"]
    B --> R["Private Cloudflare R2"]
    N --> R
    W["Manual CV worker"] --> R
    W --> O["Local Ollama models"]
    W --> P
```

| Layer | Current implementation |
|---|---|
| Frontend | Next.js 16.2.12 App Router, React 19.2.4, TypeScript 5.9.3, Tailwind CSS 4 |
| Backend | Next.js Route Handlers in the same application |
| Database | PostgreSQL through Prisma 7.9.1 and `@prisma/adapter-pg` |
| Authentication | Better Auth email/password sessions |
| File storage | Private Cloudflare R2 using S3-compatible signed URLs |
| CV extraction | `pdf-parse` for PDF and `mammoth` for DOCX |
| Local AI | Ollama, default generation model `qwen2.5:7b` |
| Embeddings | Ollama `nomic-embed-text`; embedding URL/model are hard-coded |
| Search/matching | Text contains search, in-memory cosine similarity, rule-based skill/experience scoring |

Not present: Redis, Elasticsearch/OpenSearch, a durable queue service, Docker configuration, Nginx, CI/CD, monitoring, error tracking, automated backups, load testing, or production infrastructure code.

The proposals mention Laravel or NestJS as a separate API. The repository instead uses full-stack Next.js. That is acceptable for the first production MVP, but it is a deliberate architecture difference that must be documented. Do not introduce a second backend merely to match a proposal diagram unless scale or organisational needs justify it.

## 6. Implemented product features

### Public website

- Corporate YPL Connect homepage
- Public jobs list with client-side filtering
- Job details pages
- Six sample jobs stored in `data/jobs.ts`
- Job application page and form
- File size/type validation and a bot honeypot
- Two-step direct-to-R2 CV upload
- Server verification of uploaded object size and declared content type
- Candidate upsert and duplicate-application prevention
- Application reference ID generation

### Recruiter portal

- Email/password sign-in with public signup disabled
- Eight-hour sessions
- Bootstrap script for the first recruiter
- Protected recruiter pages
- Dashboard counts and recent applications
- Searchable/filterable/paginated application list
- Searchable/paginated candidate list
- Candidate and application detail pages
- Application status updates
- Internal recruiter notes
- Application activity history with recruiter snapshot
- Short-lived private CV download link

### CV and AI foundation

- Candidate document model
- CV parse queue model and statuses
- Extracted CV text storage
- Parsed candidate profile storage
- Candidate search profile storage
- AI provider configuration model
- Job and job search profile models
- PDF and DOCX text extraction
- Ollama candidate-profile extraction
- Ollama job-profile extraction method
- Candidate/job embeddings
- Keyword search
- Semantic candidate search
- Hybrid semantic/skill/experience scoring
- Explainable match reasons
- Candidate recommendation code
- Skill aliases and normalisation
- Several manual smoke/debug scripts

### Important integration boundary

The AI/search/recommendation functions are not imported by recruiter pages or API routes. There is no recruiter search screen using semantic search, no job recommendation UI, no parsed-CV review UI, and no public AI endpoint. The implementation is therefore an experimental foundation, not a delivered user-facing AI module.

## 7. Current routes and APIs

### Pages

| Route | Purpose |
|---|---|
| `/` | Corporate homepage |
| `/jobs` | Static public jobs |
| `/jobs/[slug]` | Static job details |
| `/jobs/[slug]/apply` | Application form |
| `/recruiter/sign-in` | Recruiter login |
| `/recruiter/dashboard` | Counts and recent applications |
| `/recruiter/applications` | Application management |
| `/recruiter/applications/[id]` | Status, note, history, and CV access |
| `/recruiter/candidates` | Candidate management list |
| `/recruiter/candidates/[id]` | Candidate detail and application history |

### Route handlers

| Method and route | Purpose |
|---|---|
| `GET /api/health` | Basic application health response |
| `POST /api/uploads/cv` | Authorise a signed R2 upload |
| `POST /api/applications` | Validate and save an application and queue parsing |
| `GET/POST /api/auth/[...all]` | Better Auth endpoints |
| `PATCH /api/recruiter/applications/[id]/status` | Change application status and write an activity |
| `POST /api/recruiter/applications/[id]/notes` | Add recruiter note |
| `GET /api/recruiter/applications/[id]/cv` | Redirect to a short-lived CV download URL |

Proposal APIs such as candidate CRUD, job CRUD, job upload, CV parsing, matching, skill extraction, and summary generation do not yet exist as product APIs.

## 8. Database progress

There are **15 Prisma models, 9 enums, and 9 migrations**.

| Domain | Models |
|---|---|
| Recruitment core | `Candidate`, `Application`, `Job` |
| Authentication | `User`, `Session`, `Account`, `Verification` |
| Activity history | `ApplicationActivity` |
| Documents/parsing | `CandidateDocument`, `CvParseJob`, `CvExtractedText`, `CvParseResult` |
| Search/AI | `CandidateSearchProfile`, `JobSearchProfile`, `AIConfiguration` |

Key limitations:

- `Application` stores `jobSlug` and `jobTitle` but has no relation to `Job`.
- Public jobs come from `data/jobs.ts`, not the `Job` table.
- `Job` lacks the proposal's slug, department, category, salary rules, public/blind status, activation/deadline, and requisition fields.
- `User` has no role or permission relation; every authenticated user is effectively a recruiter.
- Candidate lifecycle stages such as New, Parsed, Verified, and Available are not modelled separately.
- Interview, client, contact, feedback, offer, invoice, payment, notification, attachment, and full audit-log entities are absent.
- Embeddings are JSON arrays, not a vector column or external index.
- `CvParseStatus` and `CvParseTrigger` are currently unused.

## 9. Verification results on 2 August 2026

| Check | Result |
|---|---|
| TypeScript: `npx tsc --noEmit` | Pass |
| Prisma: `npx prisma validate` | Pass |
| Production build: `npm run build` | Pass with required environment variables supplied |
| ESLint: `npm run lint` | Fail: 4 errors and 2 warnings in AI files |
| Dependency audit: `npm audit --omit=dev` | 4 findings: 3 high and 1 moderate |
| Automated test suite | Missing; no `test` package script or test framework |
| Algorithm smoke scripts | Five pure scoring/normalisation scripts ran successfully, but they print values and contain no assertions |
| Live PostgreSQL/R2/Ollama end-to-end test | Not verified in this audit because no project credentials/services were supplied |
| CI/CD | Missing |
| README/setup guide | Still the default Create Next App README |

Lint failures:

- `lib/ai/candidate-profile.ts`: explicit `any`
- `lib/ai/local-provider.ts`: explicit `any`
- `lib/job-matching/semantic-match.ts`: two explicit `any` values
- `lib/ai/api-provider.ts`: two unused parameter warnings

The dependency findings are currently associated with nested PostCSS and Sharp packages through Next.js, plus a propagated Better Auth finding. Do not run `npm audit fix --force` blindly; assess a supported Next.js/dependency update and rerun the full test/build suite.

The production build proves compilation and route generation only. It does not prove database migrations, authentication, R2 CORS, upload/download, Ollama parsing, or worker behaviour in a real environment.

## 10. Critical defects and risks

### P0 - fix before expanding scope

1. **Application creation is not transactional.** Candidate/application creation, candidate document creation, and parse-job creation are separate database calls. If a later call fails, the application can remain while error cleanup deletes its R2 CV, leaving a broken database record.
2. **CV worker is not safe for retry or concurrency.** It selects one queued job without an atomic claim, creates unique result rows rather than upserting, has no stale-job recovery, no retry policy, and exits after one job. Two workers can process the same job, and a partial retry can fail on unique constraints.
3. **Job extraction wrapper calls the wrong provider method.** `lib/job-intelligence/extract-job-profile.ts` calls `extractCandidateProfile` instead of `extractJobProfile`.
4. **OPENAI and GEMINI providers are stubs.** Both routes return empty arrays through `APIAIProvider`. Configuration fallback flags and token limits are not enforced.
5. **Accepted file types do not match parser support.** Upload accepts PDF, DOC, and DOCX, but parsing supports only PDF and DOCX. Every legacy DOC parse job fails.
6. **No RBAC.** Authentication exists, but roles and permissions do not. Any authenticated user can use all recruiter functions.
7. **Static and database jobs are disconnected.** Job-management and recommendation work cannot become reliable until one database-backed job source is used throughout.
8. **Security and dependency gate is failing.** Lint fails, the dependency audit reports high findings, and public upload/application endpoints have no rate limiting.

### P1 - fix for Production MVP

- Parsed profile/review/recommendation UI and APIs are missing.
- Status changes allow arbitrary jumps; no transition matrix enforces the recruitment lifecycle.
- Job/client confidentiality rules are not represented in the schema.
- AI JSON responses have minimal runtime validation and no timeout/circuit-breaker behaviour.
- Embedding endpoint/model configuration is hard-coded.
- No duplicate candidate/document detection is active even though checksum fields exist.
- File verification checks extension, size, and declared MIME metadata, but not content signature or malware.
- Environment example omits Better Auth, Ollama, and bootstrap variables.
- R2 CORS and lifecycle/retention instructions are undocumented.
- Application activity is only a partial audit trail; other changes are not audited.
- The bootstrap script only works while the entire user table is empty.
- Error handling is console-only; no structured logging or alerting.

### P2 - enterprise and scale risks

- Semantic search loads all candidate embeddings into application memory.
- Candidate recommendation performs additional per-candidate database queries.
- JSON embeddings and text `contains` queries cannot satisfy a 2-million-profile target.
- No Redis/cache, queue, vector index, Elasticsearch/OpenSearch, or partition/archive strategy.
- No load testing against 500 concurrent operations or sub-two-second response goals.
- No backup verification, RTO drill, high-availability design, or observability.

## 11. Proposal module gap matrix

| Proposal module | Current status | Main missing work |
|---|---|---|
| Authentication and RBAC | Partial | Roles, permissions, MFA, admin user management, broader audit |
| Candidate management | Partial | Manual CRUD, profile editing, structured education/experience/skills, parsed-data review, duplicate merge |
| Job management | Foundation only | Database CRUD, slug/status, blind fields, department/category, requisitions, publishing |
| Application management | Most advanced | Controlled transitions, assignment, bulk actions, submissions, offers/joining records |
| Client CRM/portal | Missing | Clients, contacts, requisitions, candidate review, feedback, scorecards |
| AI engine | Experimental foundation | Reliable providers, validation, APIs, UI, retries, duplicate detection, summary generation |
| Interview management | Missing | Schedule, calendar, invitations, feedback, evaluations |
| Finance | Missing | Placements, invoices, payments, billing rules |
| Reports | Minimal counts only | KPI dashboards, placement analytics, recruiter/client performance, exports |
| System administration | Missing | Settings, notifications, logs, backups, monitoring, retention |
| WhatsApp/email ingestion | Missing | Webhooks, IMAP/Graph/Gmail intake, deduplication, consent/source tracking |
| Production operations | Missing | CI/CD, deployment, secrets, monitoring, backups, disaster recovery, load tests |

## 12. Recommended completion plan

### Phase 0A - stabilise the current branch

Do this before adding new modules.

1. Branch from `origin/feature/cv-parsing-foundation`.
2. Remove/reconcile unrelated Jekyll/GitHub Pages files and ignore local cache artifacts.
3. Fix all lint errors/warnings and introduce runtime schemas for external AI data.
4. Correct job extraction to call `extractJobProfile`.
5. Either implement real OpenAI/Gemini providers or explicitly disable those configuration choices.
6. Wrap application, document, and parse-job persistence in a database transaction with safe R2 cleanup.
7. Implement atomic parse-job claiming, idempotent upserts, retries, stale-processing recovery, timeouts, and continuous worker operation.
8. For MVP, reject legacy DOC files unless a secure DOC converter/parser is implemented.
9. Complete `.env.example` and replace the default README.
10. Add unit and integration tests plus a GitHub Actions workflow.
11. Resolve supported dependency updates and rerun audit/build/tests.

**Exit criteria:** lint, type check, Prisma validation, automated tests, production build, and one real PDF/DOCX application-to-recommendation flow all pass.

### Phase 0B - database-backed jobs and minimum RBAC

1. Extend `Job` for slug, status, blind/public data, department, category, deadlines, salary rules, and requisition metadata.
2. Relate applications to jobs and migrate the six sample jobs.
3. Build recruiter job CRUD and public database-backed job pages.
4. Add roles/permissions. Minimum MVP roles: Admin, Recruitment Manager, Recruiter, and Data Entry.
5. Enforce permissions in server pages and every mutation route.
6. Add controlled application transition rules and assignments.

### Phase 0C - make AI useful to recruiters

1. Build parsed-CV review and verification UI.
2. Add recruiter candidate keyword/semantic search.
3. Add job-profile extraction/review.
4. Add explainable recommended-candidate results per job.
5. Record model/provider/version, confidence, reviewer corrections, and timestamps.
6. Add deduplication using normalised email/phone plus document checksum and cautious fuzzy review.

### Phase 0D - Production MVP release

1. Add rate limiting, content-signature checks, malware scanning, secure headers, structured logs, and audit coverage.
2. Add email notifications required for the MVP.
3. Add end-to-end tests for apply, login, status, notes, parsing, search, and recommendation.
4. Configure managed Next.js hosting, PostgreSQL, R2, secrets, migrations, worker hosting, monitoring, and backups.
5. Run UAT, accessibility checks, backup restore test, and a realistic load test.
6. Publish operator, recruiter, deployment, and recovery documentation.

### Enterprise releases after MVP

1. Client CRM and portal
2. Interview/feedback and offer management
3. Placement finance, invoices, and payments
4. Reports and exports
5. WhatsApp/email ingestion and notifications
6. Full nine-role permissions and MFA
7. Vector/search infrastructure, Redis, queues, archival, and scale validation
8. SaaS/multi-tenant/global features only if approved as a separate product

## 13. Windows + VS Code local setup

### Clone and select the correct baseline

Open PowerShell or Windows Terminal:

```powershell
git clone https://github.com/15tashdid15/ypl-connect.git
cd ypl-connect
git fetch origin
git switch -c local/mvp-hardening origin/feature/cv-parsing-foundation
git status
code .
```

Do not begin new work from `main`. Do not merge the current feature branch into `main` before Phase 0A passes.

If the repository already exists:

```powershell
cd C:\path\to\ypl-connect
git fetch origin
git switch local/mvp-hardening
git status
```

### Install dependencies

Use a team-pinned Node version that satisfies Next.js's `>=20.9.0` requirement. The audit used Node `24.14.0` and npm `11.9.0`.

```powershell
npm ci
```

### PostgreSQL

Use a local PostgreSQL database or a development database. Example Docker setup:

```powershell
docker run --name ypl-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ypl_connect -p 5432:5432 -v ypl_pgdata:/var/lib/postgresql/data -d postgres:16
```

### Environment file

The Prisma configuration and terminal scripts load `.env`. Create it and never commit it:

```powershell
Copy-Item .env.example .env
```

Complete `.env`:

```dotenv
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ypl_connect?schema=public"

BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="GENERATE_A_LONG_RANDOM_SECRET"

R2_ENDPOINT="https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="YOUR_DEVELOPMENT_KEY"
R2_SECRET_ACCESS_KEY="YOUR_DEVELOPMENT_SECRET"
R2_BUCKET_NAME="ypl-private-cvs"

OLLAMA_URL="http://localhost:11434"
OLLAMA_MODEL="qwen2.5:7b"
```

Generate a Better Auth secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

R2 must allow browser PUT requests from `http://localhost:3000` during development and from the final production origin later. Use a separate development bucket/key if possible.

### Generate client and apply migrations

```powershell
npx prisma generate
npx prisma migrate dev
```

Use `npx prisma migrate deploy` in production, never `migrate dev`.

### Bootstrap the first recruiter

This currently succeeds only if no user exists:

```powershell
$env:BOOTSTRAP_RECRUITER_NAME="YPL Administrator"
$env:BOOTSTRAP_RECRUITER_EMAIL="admin@example.com"
$env:BOOTSTRAP_RECRUITER_PASSWORD="USE-A-STRONG-UNIQUE-PASSWORD"
npx tsx scripts/bootstrap-recruiter.ts
```

### Ollama models

```powershell
ollama pull qwen2.5:7b
ollama pull nomic-embed-text
```

### Recommended VS Code terminal layout

**Terminal 1 - application**

```powershell
npm run dev
```

**Terminal 2 - Ollama, if the desktop service is not already running**

```powershell
ollama serve
```

**Terminal 3 - CV worker**

```powershell
npx tsx scripts/process-cv-jobs.ts
```

The current worker processes only one queued CV and exits. Run it again for each queued item until Phase 0A replaces it with a continuous, safely claimed worker.

**Optional Terminal 4 - database inspection**

```powershell
npx prisma studio
```

### Current verification commands

```powershell
npm run lint
npx tsc --noEmit
npx prisma validate
npm run build
npm audit --omit=dev
```

At the audit baseline, lint and dependency audit intentionally fail as described above. Do not mark Phase 0A complete until these gates have an accepted result.

## 14. Local-only Git workflow for option 3B

Make small, reviewable local commits:

```powershell
git status
git diff
git add -p
git commit -m "fix: stabilise application and parsing workflow"
```

Create a portable patch when needed:

```powershell
git format-patch origin/feature/cv-parsing-foundation..HEAD --stdout > ypl-connect-local-work.patch
```

No push is authorised for now. Before any future push:

```powershell
gh auth status
gh api user --jq .login
```

The login must be exactly `15tashdid15`. If it is anything else, stop. Never push using `Rifat2342`.

## 15. How to continue with ChatGPT + VS Code

Work one bounded task at a time. Give ChatGPT:

- the repository path/branch;
- the exact phase/task;
- relevant terminal output;
- permission boundaries;
- acceptance criteria;
- a request to inspect before editing and test after editing.

Use this continuation prompt:

```text
We are continuing the YPL Connect project at 15tashdid15/ypl-connect.

Binding rules:
- GitHub owner and only permitted write identity: 15tashdid15.
- Work locally only; do not push, merge, open PRs, or alter remote settings.
- Baseline: origin/feature/cv-parsing-foundation at 8ef8769, not main.
- Stack: Next.js 16 App Router, React 19, TypeScript, Prisma 7, PostgreSQL, Better Auth, Cloudflare R2, and Ollama.
- Read AGENTS.md and the relevant installed Next.js guide before changing Next.js code.
- Preserve unrelated local changes and secrets.

Current task: Phase 0A, starting with transactional application/document/parse-job persistence and safe R2 cleanup.

First inspect the relevant route, Prisma schema/migrations, and tests. Explain the failure modes, implement the smallest safe fix, add automated tests, then run lint, type check, Prisma validation, and build. Report changed files and remaining risks. Do not expand into job CRUD, RBAC, or UI redesign in this task.
```

After each task, save:

1. changed files;
2. commands run;
3. test results;
4. database migration impact;
5. environment changes;
6. known remaining issues;
7. next recommended task.

## 16. Production MVP definition of done

The MVP is complete only when:

- all jobs are database-managed and blind-publication rules are enforced;
- applications are atomic and never reference missing CV objects;
- at least PDF and DOCX parsing are reliable and retry-safe;
- parsed fields can be reviewed and corrected;
- recruiters can search and receive explainable recommendations;
- roles and server-side permissions are enforced;
- recruitment status transitions are controlled and audited;
- file and public endpoints are hardened and rate-limited;
- automated unit, integration, and end-to-end tests pass;
- lint, type check, Prisma validation, build, and accepted dependency audit pass;
- CI/CD, migrations, secrets, worker deployment, monitoring, backups, and restore instructions are operational;
- recruiter and operator documentation is complete;
- UAT is signed off using realistic YPL workflows.

The full enterprise ARMS is complete only after client CRM/portal, interviews, offers, finance, reports, omnichannel ingestion, full role matrix, high availability, and scale requirements are also delivered.

## 17. Immediate next action

Start **Phase 0A** on a local branch. The first code task should make application + candidate-document + parse-job creation transactional and define correct R2 cleanup behaviour. This is the highest-risk integrity defect and should be fixed before any new feature.

## 18. Durable repository memory protocol

This repository must be understandable without access to any previous ChatGPT conversation.

### Canonical continuity files

- `PROJECT_CONTEXT.md` — current truth: goals, architecture, progress, risks, hardware, AI decisions, exact branch/commit, and next task.
- `docs/SESSION_LOG.md` — append-only record of each completed work session.
- `AGENTS.md` — binding instructions for ChatGPT, Codex, GitHub Copilot, or another coding assistant.
- `scripts/save-project-handoff.ps1` — local helper that appends a structured session record.

### Start-of-session rule

Before changing code, every assistant or developer must read:

1. `AGENTS.md`
2. `PROJECT_CONTEXT.md`
3. the newest entry in `docs/SESSION_LOG.md`
4. `git status`
5. `git branch --show-current`
6. `git rev-parse --short HEAD`

The exact Git branch and commit SHA are authoritative. Informal labels such as “step 13.15” are useful context, but must never replace a branch and commit reference.

### End-of-session rule

Before ending a meaningful development session:

1. Update the “Current checkpoint” and “Immediate next action” in `PROJECT_CONTEXT.md`.
2. Append a session entry to `docs/SESSION_LOG.md`.
3. Record changed files, commands, test results, migration/environment impact, unresolved risks, and next task.
4. Commit the context files together with the code they describe.
5. Push only after confirming the active GitHub identity is exactly `15tashdid15`.

Never store passwords, API keys, database URLs, private CV data, candidate PII, or cloud credentials in these files.

## 19. Local development hardware and AI runtime contract

### Owner workstation

| Component | Recorded configuration |
|---|---|
| CPU | AMD Ryzen 7 7700 |
| Motherboard | B650M |
| System memory | 16 GB DDR5-6000 |
| GPU | Colorful GeForce RTX 5060 Ti, 16 GB VRAM, triple-fan |
| Storage | 1 TB PCIe Gen4 NVMe; user described it as Corsair “Elite MP600”. Verify the exact retail model before writing hardware-specific deployment documentation. |
| Operating workflow | Windows, VS Code, Windows Terminal/PowerShell |
| Local AI runtime | Ollama |
| Default local generation model | `qwen2.5:7b` |
| Default embedding model | `nomic-embed-text` |

The phrase “Ollama 2.5 7B” should be interpreted as **Ollama running `qwen2.5:7b`**, unless the owner explicitly changes the model.

### Hardware-aware constraints

- The 16 GB GPU is the primary local inference device.
- The 16 GB system RAM can become the practical bottleneck when Next.js, PostgreSQL, VS Code, browser tabs, Prisma, and Ollama run together.
- Do not assume a larger model is production-safe merely because it loads. Benchmark latency, memory use, structured-output reliability, and concurrent-job behaviour locally.
- Model names, quantisation, context size, and concurrency limits must be configurable through environment variables or database-backed AI configuration.
- Production must not depend on the owner workstation being online. The workstation is a development and optional private-processing node, not the sole production worker.

## 20. Approved hybrid AI orchestration design

The platform is no longer limited to “CV parsing” or “job matching”. It is being built as an AI-assisted recruitment intelligence platform with two major intelligence domains:

1. **Candidate Intelligence** — CV/document understanding, profile construction, deduplication, search, ranking, summaries, and recruiter review.
2. **Job Intelligence** — job circular/JD/requisition understanding, confidentiality controls, structured requirement extraction, taxonomy normalisation, matching strategy, and recommendation explanations.

### 20.1 Orchestration principles

1. **Deterministic first:** file validation, text extraction, schema validation, normalisation, permissions, and hard business rules must not be delegated to an LLM.
2. **Local-first for private data:** use Ollama for CV/JD processing where practical, especially when raw personal or client-confidential information is involved.
3. **Cloud fallback is controlled:** OpenAI/Gemini or another provider may be used only when configured, authorised, audited, and necessary. The current cloud-provider code is incomplete and must remain disabled until implemented and tested.
4. **Structured outputs only:** all AI responses must pass runtime validation before persistence.
5. **Human review:** AI scores and recommendations support recruiters; they do not make final hiring, rejection, compensation, or compliance decisions.
6. **Explainability:** every recommendation must expose matched skills, missing requirements, experience fit, semantic contribution, hard-filter results, provider/model/version, and confidence.
7. **Privacy minimisation:** send only the minimum necessary text to any external provider. Redact unnecessary candidate PII and client identity where possible.
8. **Resilience:** timeouts, bounded retries, idempotency, stale-job recovery, circuit breakers, and durable queues are mandatory before production.
9. **Observability:** record latency, provider, model, token/character usage where available, validation failures, fallbacks, reviewer corrections, and final outcomes.
10. **Evaluation before scaling:** maintain an anonymised, consent-safe evaluation set and compare extraction/matching quality before changing models or scoring weights.

### 20.2 Candidate intelligence pipeline

```mermaid
flowchart LR
    A["CV intake"] --> B["File and security validation"]
    B --> C["PDF/DOCX text extraction"]
    C --> D["Deterministic cleanup"]
    D --> E["Local structured profile extraction"]
    E --> F["Runtime schema validation"]
    F --> G["Skill/title/taxonomy normalisation"]
    G --> H["Duplicate detection"]
    H --> I["Embeddings and searchable profile"]
    I --> J["Recruiter review and correction"]
    J --> K["Verified candidate intelligence"]
```

Planned candidate intelligence capabilities:

- multi-document candidate record;
- structured employment, education, skills, certifications, languages, location, notice period, preferences, and seniority;
- duplicate detection using normalised email/phone, document checksum, and cautious fuzzy/semantic review;
- keyword, semantic, and hybrid search;
- job-specific ranking and explanations;
- standardised candidate summaries;
- reviewer corrections retained as supervised feedback;
- source, consent, provenance, model version, and review status.

### 20.3 Job intelligence pipeline

```mermaid
flowchart LR
    A["JD/requisition intake"] --> B["File/text validation"]
    B --> C["Client-confidentiality classification"]
    C --> D["Structured requirement extraction"]
    D --> E["Runtime schema validation"]
    E --> F["Skill/title/department/category normalisation"]
    F --> G["Hard filters and scoring policy"]
    G --> H["Job embedding"]
    H --> I["Recruiter review"]
    I --> J["Blind public job and recommendation profile"]
```

Planned job intelligence capabilities:

- parse raw JD documents, email text, forms, and recruiter-entered requirements;
- extract title, seniority, responsibilities, must-have/nice-to-have skills, experience, education, location, employment type, salary policy, deadlines, and screening questions;
- separate internal client identity from blind public content;
- flag ambiguous, contradictory, discriminatory, or incomplete requirements for human review;
- generate a structured matching policy rather than relying on one opaque similarity score;
- retain the original source and all reviewer edits.

### 20.4 Matching architecture

The production matching score should be modular and configurable:

- eligibility/hard filters;
- required-skill coverage;
- preferred-skill coverage;
- experience and seniority fit;
- title/functional taxonomy fit;
- education/certification fit where legitimately required;
- location/availability/preferences;
- semantic similarity;
- recruiter-defined weighting;
- data quality and verification status.

A candidate must not be rejected solely because of an embedding score. Missing data must be represented as unknown, not automatically treated as failure.

### 20.5 Provider routing target

The future router should select a provider by task, sensitivity, confidence, cost, availability, and administrator policy:

```text
request
  -> deterministic pre-processing
  -> task policy
  -> local provider
  -> validate result
  -> if invalid/low-confidence and fallback is authorised:
       redact/minimise -> cloud provider -> validate
  -> persist provenance and confidence
  -> human review where required
```

The current `AIProvider` enum (`LOCAL`, `GEMINI`, `OPENAI`) is only a foundation. `OPENAI` and `GEMINI` must not appear as available production options until their implementations, privacy controls, budgets, error handling, and tests are complete.

## 21. “Step 13.15” checkpoint interpretation

The remembered “13.15” checkpoint most closely corresponds to the unmerged AI candidate-recommendation stage immediately before/around skill-intelligence normalisation.

The exact authoritative checkpoint is:

- Branch: `feature/cv-parsing-foundation`
- Commit: `8ef87697c00b994c09396508eb07b2d69acb629a`
- Commit message: `Add AI skill intelligence and normalized matching taxonomy`
- Relationship to `main`: 9 commits ahead, 2 commits behind as of 2 August 2026
- Merge state: no open pull request; do not merge yet

This branch contains the CV parsing, local AI, embeddings, search, hybrid scoring, job intelligence, recommendation, and skill-normalisation foundations. These parts are not yet integrated into recruiter-facing workflows and are not production-safe.

The next task is **not** “merge every module”. The correct sequence is:

1. stabilise data integrity and the worker;
2. add automated tests and CI;
3. unify database-backed jobs;
4. add minimum RBAC;
5. expose reviewed AI workflows to recruiters;
6. only then prepare a controlled integration PR.

## 22. Current checkpoint — 2 August 2026

### Verified remote facts

- Repository: `15tashdid15/ypl-connect`
- Default branch: `main`
- Main head: `6249be1`
- Implementation branch: `feature/cv-parsing-foundation`
- Implementation head: `8ef8769`
- Branch status: diverged, 9 ahead / 2 behind
- Open pull requests: none
- Connected ChatGPT GitHub identity during this session: `Rifat2342`
- Permission through that identity: read-only; no push

### Immediate blocked action

Create and push the continuity files only after the GitHub connector/CLI is authenticated as `15tashdid15`. Do not use `Rifat2342` for a commit, branch, pull request, or merge in this repository.

### Immediate engineering action after continuity files are committed

Start Phase 0A with transactional creation of:

- candidate update/create;
- application;
- candidate document;
- CV parse job;

and define correct R2 cleanup behaviour for:

- validation failure before database persistence;
- duplicate application;
- transaction rollback;
- successful database commit;
- database commit followed by response failure;
- orphan-object reconciliation.

