import "dotenv/config";
import {
    searchCandidates,
} from "@/lib/candidate-search/search";


async function main() {

    const results =
        await searchCandidates(
            "payroll",
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