import {
    calculateHybridScore,
} from "@/lib/candidate-search/scoring";


console.log(

    calculateHybridScore({

        semanticScore: 62.53,

        skillScore: 90,

        experienceScore: 100,

    })

);