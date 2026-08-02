# YPL Connect AI Recruitment Platform
# Complete Project Continuation & Development Handoff Document

Version:
AI-1.5 Completion Checkpoint

Date:
2026-08-02

Repository:
ypl-connect

Current Branch:
fix/transactional-application-flow


==================================================
1. PROJECT PURPOSE
==================================================

YPL Connect is an AI-powered recruitment intelligence platform.

The objective is not just CV keyword searching.

The goal is:

Candidate CV
        |
        ↓
AI understanding
        |
        ↓
Structured candidate intelligence
        |
        ↓
Job understanding
        |
        ↓
Semantic + skill + experience + seniority matching
        |
        ↓
Explainable candidate recommendation


The system should behave like a professional recruiter assistant.


==================================================
2. DEVELOPMENT PHILOSOPHY
==================================================

The project follows a practical AI engineering approach.

Never build features only theoretically.

Every intelligence improvement follows:

1. Build feature
2. Run against real/synthetic CV and job data
3. Observe output
4. Compare improvement
5. Fix weaknesses
6. Benchmark
7. Commit stable checkpoint


The system is improved through controlled trial and error.


==================================================
3. COLLABORATION STYLE WITH AI ASSISTANT
==================================================

Preferred working style:

- Deep technical discussion
- Small controlled changes
- Test immediately
- Verify output before moving forward


Avoid:

- Large rewrites
- Blind architecture changes
- Adding AI features without measurement


The AI assistant should:

1. Understand existing architecture first.
2. Continue existing design decisions.
3. Use current files instead of inventing new structures.
4. Provide exact file paths.
5. Provide commands when creating files/folders.
6. Move faster on low-risk changes.
7. Slow down on database, ranking, and intelligence logic.


Preferred command guidance format:

Example:

Create file:

New-Item scripts\example.ts

Open:

code scripts\example.ts


Do not provide unnecessary full directory trees.


==================================================
4. CURRENT TECH STACK
==================================================

Frontend:

Next.js 16
React 19
TypeScript


Backend:

Next.js server architecture


Database:

PostgreSQL


ORM:

Prisma 7.9.1


AI:

Ollama local AI provider


Storage:

Cloud object storage (R2)


Validation:

Zod


Embedding:

Custom embedding provider


Testing:

tsx scripts


==================================================
5. IMPORTANT PROJECT STRUCTURE
==================================================


AI:

lib/ai/


Candidate intelligence:

lib/ai/candidate-profile.ts

lib/ai/types.ts

lib/ai/local-provider.ts

lib/ai/validators/

lib/ai/mappers/


CV pipeline:

lib/cv-parser/


Candidate search:

lib/candidate-search/


Job intelligence:

lib/job-intelligence/


Matching:

lib/job-matching/


Testing:

scripts/


==================================================
6. COMPLETED ENGINEERING STABILIZATION
==================================================


Phase 0A completed:


Transactional application creation

Commit:

fix: make application creation transactional


Atomic CV job claiming

Commit:

fix: make CV parse job claiming atomic


Stale CV job recovery

Commit:

fix: recover stale CV parse jobs


CV parse result idempotency

Commit:

fix: make CV AI results idempotent



==================================================
7. AI VALIDATION AND DATA BOUNDARY
==================================================


Completed:

AI output is now separated from database persistence.


Flow:

AI response

↓

Validation

↓

Normalization

↓

Persistence


Implemented:

- Candidate profile validator
- Candidate profile mapper
- Structured AI types


Purpose:

Prevent unreliable AI output from corrupting database.


==================================================
8. CV INTELLIGENCE PIPELINE
==================================================


Current flow:


CV File

↓

Text extraction

↓

AI extraction

↓

Candidate profile

↓

CvParseResult

↓

CandidateSearchProfile

↓

Embedding generation


Extracted intelligence:

- Name
- Headline
- Summary
- Skills
- Education
- Certifications
- Languages
- Experience
- Keywords
- Total experience
- Seniority


==================================================
9. RECRUITMENT INTELLIGENCE
==================================================


Current candidate matching uses:


Semantic similarity

+

Skill matching

+

Experience matching



Current scoring:

Semantic:
50%


Skill:
30%


Experience:
20%


The score is explainable.


Example output:

Candidate:

Tanveer Rahman Alif


Reasons:

- Strong semantic match
- Matched skills
- Experience requirement satisfied


==================================================
10. BENCHMARK SYSTEM
==================================================


Created:

scripts/benchmarks/


Purpose:

Measure whether AI improvements actually improve recruitment.


Current benchmark:

HR recruitment


Examples:

Senior HR Executive

Junior HR role


Benchmark evaluates:

- Top 1 accuracy
- Top 3 candidate relevance
- Ranking order


Never change ranking without benchmark comparison.


==================================================
11. AI-1.5 SENIORITY INTELLIGENCE
==================================================


COMPLETED


Goal:

Teach system difference between:

Junior

Mid

Senior


Pipeline:


CV

↓

AI extraction

↓

CvParseResult.seniority

↓

CandidateSearchProfile.seniority


Examples:


Tanveer Rahman Alif:

3 years

Mid


optimizly1:

6 years

Senior


Rukaiya:

1 year

Junior


Khalid Mahmud:

Strategic HR Leader

Senior



==================================================
12. SENIORITY MATCHING FOUNDATION
==================================================


Created:

lib/candidate-search/seniority-matching.ts


Purpose:

Compare:


Candidate seniority

against

Job seniority requirement



Current logic:


Exact match:

100


One level difference:

75


Large mismatch:

40


Unknown:

50


This is intentionally isolated before changing ranking weights.


==================================================
13. CURRENT DATABASE INTELLIGENCE
==================================================


CandidateSearchProfile contains:


candidateId

searchableText

skills

keywords

totalExperienceYears

seniority

highestEducation

embedding



JobSearchProfile contains:


requiredSkills

requiredExperience

seniority

educationRequirement

embedding



==================================================
14. CURRENT TEST SCRIPTS
==================================================


CV processing:

scripts/process-cv-jobs.ts


CV recovery:

scripts/reprocess-cv-profiles.ts


Candidate rebuild:

scripts/rebuild-candidate-search-profiles.ts


Recommendation:

scripts/test-candidate-recommendation.ts


Hybrid search:

scripts/test-hybrid-search.ts


Benchmark:

scripts/run-recruitment-benchmark.ts


Verification:

scripts/check-search-seniority.ts


==================================================
15. CURRENT STATUS
==================================================


Completed:

YES:

- CV pipeline
- AI validation
- Candidate intelligence
- Job intelligence
- Semantic search
- Hybrid matching
- Benchmark framework
- Seniority extraction
- Seniority propagation


In progress:

AI-1.6


Senioritiy-aware ranking.


==================================================
16. NEXT DEVELOPMENT ROADMAP
==================================================


AI-1.6

Senioritiy-aware ranking


Steps:


1. Complete job seniority propagation

2. Rebuild job search profiles

3. Run recommendation benchmark

4. Compare old ranking vs new ranking

5. Decide seniority weight



AI-1.7

Failed CV recovery system


Known issue:

Sabbir ISLAM CV parse failed.


Future:


AI-1.8

Recruiter feedback learning


AI-1.9

Candidate explanation engine


AI-2.0

Advanced ranking optimization


==================================================
17. IMPORTANT RULES FOR FUTURE AI ASSISTANT
==================================================


When continuing:


First understand:

- Existing files
- Existing database
- Existing tests


Do not:

- Replace architecture
- Rewrite matching system
- Add unnecessary frameworks


Always:

1. Give exact file path
2. Give command if creating files
3. Make small changes
4. Run:

npx tsc --noEmit


5. Test output
6. Commit checkpoint


==================================================
18. PROJECT MATURITY STATUS
==================================================


Current maturity:

Early production architecture.


Already achieved:

A functional AI recruitment engine.


Remaining work:

Optimization and intelligence refinement.


The hardest parts ahead:

- Ranking accuracy
- Feedback learning
- Recruiter trust
- Explainability
- Large-scale evaluation


The foundation is stable.


==================================================
END OF HANDOFF
==================================================