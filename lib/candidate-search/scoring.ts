export function calculateHybridScore({

    semanticScore,

    skillScore,

    experienceScore,

}: {

    semanticScore: number;

    skillScore: number;

    experienceScore: number;

}) {


    const finalScore =

        (
            semanticScore * 0.50
        )

        +

        (
            skillScore * 0.30
        )

        +

        (
            experienceScore * 0.20
        );


    return Number(
        finalScore.toFixed(2),
    );

}