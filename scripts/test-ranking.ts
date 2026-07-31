import {
    calculateCandidateScore,
} from "@/lib/candidate-search/ranking";


const score =
    calculateCandidateScore({

        candidateSkills: [
            "Payroll",
            "HR Operations",
            "Recruitment",
        ],

        candidateKeywords: [
            "HRIS",
            "Employee Relations",
        ],

        candidateExperience: 5,

        query:
            "HR payroll",

    });



console.log({
    score,
});