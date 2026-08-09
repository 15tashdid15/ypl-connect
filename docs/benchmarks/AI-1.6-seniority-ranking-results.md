# AI-1.6 Seniority Ranking Benchmark Results

Date:
2026-08-09


## Objective

Integrate candidate-job seniority compatibility into the recommendation ranking system.

The AI-1.4 benchmark identified that the system could understand candidate skills and experience but failed to consider career-level compatibility.

The main issue was:

- Senior candidates could rank highly for junior positions.
- Role-level expectations were not considered.
- Overqualified candidates were not penalized.

AI-1.6 introduces seniority-aware ranking to improve recruiter-style matching.


---

# Problem Identified (AI-1.4)

## Junior HR Assistant Benchmark

Previous result:

Top-1 Accuracy:

FAIL


Observed issue:

The system ranked experienced candidates above suitable junior candidates.

Root cause:

The ranking model considered:

- Semantic similarity
- Skill matching
- Experience matching

but did not consider:

- Candidate seniority
- Required job level
- Career-stage compatibility


---

# AI-1.6 Implementation

## Change Introduced

Added seniority compatibility score into the hybrid ranking model.


## Previous Ranking Model
