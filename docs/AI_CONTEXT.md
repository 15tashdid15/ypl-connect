# YPL Connect AI Context

Project:
YPL Connect

Framework:
Next.js 16.2.12

Database:
Prisma + PostgreSQL

Authentication:
Better Auth


## Current Development Phase

Recruiter workflow completion.


## Current Goal

Complete:

Recruiter
→ View Job
→ AI Recommendation
→ Shortlist Candidate
→ Update Application Status


## Important Rules

Before changing code:

1. Check Prisma schema.
2. Check database records first.
3. Do not assume missing data.
4. Run after changes:

npx prisma generate

npx tsc --noEmit


## Current Important Routes

Public:

/jobs


Recruiter:

/recruiter/dashboard

/recruiter/applications

/recruiter/jobs/[id]/recommendations


## Current Problem

Recommendation page loads but shows:

"No suitable candidates found"


Need to investigate:

job_search_profiles

candidate_search_profiles


## Last Known Database Finding

jobs table contains:

Senior HR Executive

IDs:

cmsarysll0000scfqmkw3rtsl

cmsbt8eor0000wcfqqp3cv23


## Last Successful Checks

Prisma:

npx prisma db pull ✅

npx prisma generate ✅

npx tsc --noEmit ✅


## Continue From

Check:

Prisma Studio
→ job_search_profiles

Verify Senior HR Executive has JobSearchProfile.
