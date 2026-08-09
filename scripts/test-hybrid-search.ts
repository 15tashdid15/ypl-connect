import "dotenv/config";

import {
    hybridCandidateSearch,
} from "@/lib/candidate-search/hybrid-search";


async function main() {


    const results =
        await hybridCandidateSearch({

            query:
                "HR payroll employee management",

            requiredSkills: [
                "Payroll",
                "HRIS",
            ],

            requiredExperience:
                3,

        });


    console.log(
        JSON.stringify(
            results,
            null,
            2,
        ),
    );


}


main();