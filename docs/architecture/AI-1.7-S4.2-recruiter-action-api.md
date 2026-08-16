# AI-1.7-S4.2 Recruiter Action API Layer

Date:
2026-08-17


## Objective

Create the API layer that connects recruiter decisions from the AI recommendation interface with the backend database.


## Previous Completed Work

Before this stage:

✅ CV Extraction Pipeline

Raw CV Document
→ Text Extraction
→ AI Understanding
→ Structured Candidate Profile
→ Database Profile
→ Searchable Candidate Intelligence


Completed AI matching modules:

✅ Semantic Search
✅ Hybrid Matching
✅ Skill Intelligence
✅ AI Candidate Recommendation
✅ Recommendation Ranking UI


## Current Implementation

Building API communication for recruiter decisions.


Flow:

Recruiter Recommendation Page

        ↓

Recommendation Actions Component

        ↓

Recruiter Action API

        ↓

Prisma Database

        ↓

RecruiterCandidateAction Table


## API Responsibility

The API will:

- Authenticate recruiter session
- Receive candidate decision
- Validate request
- Store recruiter action
- Update existing decision when required


## Supported Actions

Initial actions:

- SHORTLIST
- REJECT


## Database Model

Table:

RecruiterCandidateAction


Stores:

- jobId
- candidateId
- recruiterId
- action
- note
- createdAt
- updatedAt


## Design Decision

A unique constraint is used:

(jobId, candidateId, recruiterId)

Reason:

A recruiter should have only one active decision for a candidate in a specific job.

New decisions update previous decisions instead of creating duplicates.


## Next Steps

1. Create API route
2. Test API response
3. Connect UI buttons
4. Display recruiter decision status
5. Commit stable checkpoint
## Current Status

Phase:
AI-1.7 Recruiter Decision Workflow

Current Task:
AI-1.7-S4.2 — Create API Layer

Status:
🚧 In Progress


## Implementation Checkpoint

Branch:

feature/ai-1.7-recruiter-decision-workflow


Previous Stable Tag:

v0.17-ai-recruiter-decision-foundation