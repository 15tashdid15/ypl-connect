import {
    normalizeSkill,
} from "@/lib/skill-intelligence/normalize-skill";


const candidateSkills = [

    "HR Operations",

    "HRIS & HRMS (ZingHR)",

    "Payroll Support",

    "Talent Acquisition",

    "Employee Separation & Final Settlement",

];


const requiredSkills = [

    "Payroll",

    "HRIS",

    "Recruitment",

    "Employee Relations",

];



console.log("Candidate normalization:");

candidateSkills.forEach(
    skill => {

        console.log(
            skill,
            "=>",
            normalizeSkill(skill),
        );

    }
);



console.log("\nRequired normalization:");

requiredSkills.forEach(
    skill => {

        console.log(
            skill,
            "=>",
            normalizeSkill(skill),
        );

    }
);