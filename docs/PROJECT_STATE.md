# YPL Connect - Development State

Last Updated:
2026-08-16

Current Branch:
main

## Current Objective

Complete recruiter workflow:

Recruiter
→ View Job
→ AI Candidate Recommendation
→ Shortlist Candidate
→ Update Application Status


---

# Current Working Features

## Authentication

Status: WORKING

Better Auth:
- Sign in works
- Recruiter dashboard loads
- Session table connected


## Prisma Database

Status: WORKING

Database:
Prisma Postgres

Verified:

- prisma db pull ✅
- prisma generate ✅
- Prisma Studio ✅


---

# Current Routes


## Public

/jobs

Purpose:
Candidate job browsing


## Recruiter

/recruiter/dashboard

Status:
Working


/recruiter/applications

Status:
Working


/recruiter/jobs/[id]/recommendations

Status:
Working

Problem:
No candidates returned


---

# Current Bug / Investigation


## AI Recommendation Empty


URL:

/recruiter/jobs/cmsarysll0000scfqmkw3rtsl/recommendations


Result:

"No suitable candidates found"


Pipeline:

Job
 ↓
JobSearchProfile
 ↓
Semantic Matching
 ↓
CandidateSearchProfile
 ↓
Recommendation Score


Need to verify:

job_search_profiles table


---

# Database Discovery


jobs table contains:


1.

id:
cmsarysll0000scfqmkw3rtsl

title:
Senior HR Executive


2.

id:
cmsbt8eor0000wcfqqp3cv23

title:
Senior HR Executive


There are duplicate jobs.


---

# Application Testing


Goal:

Change:

applications.status

FROM:

APPLIED


TO:

SHORTLISTED


Current issue:

Senior HR Executive has no applications.


Existing applications belong to other jobs.


---

# Important Files Modified


API:

app/api/recruiter/jobs/[jobId]/candidates/[candidateId]/action/route.ts


Purpose:

Handles:

SHORTLIST
REJECT


Current status:

TypeScript passes.


Command verified:

npx tsc --noEmit


---

# Next Session Starting Point


1. Check:

Prisma Studio
→ job_search_profiles


For:

cmsarysll0000scfqmkw3rtsl


2. Decide:

Option A:
Create real recruiter job creation flow


OR


Option B:
Use existing job with applications to test shortlist.


---

# Never Assume

Before modifying recommendation logic:

Always verify database records first.