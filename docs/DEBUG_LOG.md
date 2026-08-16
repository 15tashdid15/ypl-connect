# YPL Connect Debug Log


## 2026-08-16


### Issue:
Prisma database timeout

Error:

ETIMEDOUT
modelName: Session


### Fix:

Updated DATABASE_URL.

Verified:

Prisma Studio works.

---

### Issue:
TypeScript errors in shortlist API.


File:

app/api/recruiter/jobs/[jobId]/candidates/[candidateId]/action/route.ts


Fix:

Removed incorrect jobSearchProfile.jobSlug relation.


Verified:

npx tsc --noEmit

Passed.


---

### Issue:

APPLICATION UPDATE RESULT: 0


Reason:

Candidate application belonged to another job.

Example:

Candidate applied:

Data Entry Executive


Recruiter action:

Senior HR Executive


Therefore updateMany matched zero rows.


---

### Current Investigation:

Recommendation engine returns empty.

Need to verify:

JobSearchProfile
CandidateSearchProfile
