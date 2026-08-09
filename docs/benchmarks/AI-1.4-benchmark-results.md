# AI-1.4 Recruitment Benchmark Results

Date:
2026-08-02


## Benchmark 1: Senior HR Executive


### Expected Ranking

1. Tanveer rahman Alif
2. optimizly1
3. optimizely2


### Actual Ranking

1. Tanveer rahman Alif
2. optimizly1
3. amar name jani na
4. optimizely2


### Evaluation

Top-1 Accuracy:
PASS


Top-3 Match:
2/3


### Observation

The system successfully identified the strongest candidates.

Strengths:

- Strong HR domain understanding.
- Good semantic matching.
- Skill relationship detection works well.
- Experience filtering works correctly.


Issue identified:

The system ranked a strategically similar HR analytics candidate above a more operational HR candidate.

Cause:

Current model gives higher importance to semantic similarity than exact operational skill alignment.



---

## Benchmark 2: Junior HR Assistant


### Expected Ranking

1. Rukaiya
2. testingmia
3. Sabbir ISLAM


### Actual Ranking

1. optimizely2
2. Sabbir ISLAM
3. amar name jani na


### Evaluation

Top-1 Accuracy:
FAIL


Top-3 Match:
1/3


### Observation

The system failed to understand junior role requirements.

Issue identified:

- Senior candidates are not penalized for junior positions.
- Role level awareness is missing.
- Overqualified candidates can rank too high.


Root Cause:

Current matching considers:

- Semantic similarity
- Skills
- Experience

but does not consider:

- Seniority compatibility
- Career level
- Role expectations



---

# AI-1.4 Findings


## Current Strengths

- Candidate semantic understanding is strong.
- Skill normalization works.
- Experience matching works.
- Job description understanding improved after AI-1.3.


## Current Limitations

- No seniority intelligence.
- No overqualification penalty.
- No role-level compatibility.


## Next Improvement

Phase AI-1.5:

Implemented seniority and career-level intelligence into:

- Candidate profile
- Job profile
- Recommendation scoring

Validation of this improvement was performed in AI-1.6 benchmarking.

# AI-1.6 Seniority Ranking Benchmark Results

Date:
2026-08-09

## Objective

Integrate candidate-job seniority compatibility into ranking.

## Change

Added seniorityScore into hybrid ranking.

Previous:
- Semantic 50%
- Skill 30%
- Experience 20%

AI-1.6:
- Semantic 45%
- Skill 25%
- Experience 20%
- Seniority 10%

## Results

### Senior HR Executive

Top-1:
PASS

Top candidate:
Tanveer rahman Alif


### Junior HR Assistant

Top-1:
PASS

Top candidate:
Rukaiya


## Conclusion

AI-1.6 successfully improved seniority-aware candidate ranking without regression.