import "dotenv/config";
import {
    semanticCandidateSearch,
} from "@/lib/candidate-search/semantic-search";



async function main() {


    const results =
        await semanticCandidateSearch(
            "HR payroll employee management",
        );


    console.log(
        JSON.stringify(
            results,
            null,
            2,
        ),
    );

}


main();