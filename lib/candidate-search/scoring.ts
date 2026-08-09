export function calculateHybridScore({

    semanticScore,

    skillScore,

    experienceScore,

    seniorityScore,

}: {

    semanticScore: number;

    skillScore: number;

    experienceScore: number;

    seniorityScore?: number;

}) {


    const finalScore =

        (
            semanticScore * 0.45
        )

        +

        (
            skillScore * 0.25
        )

        +

        (
            experienceScore * 0.20
        )

        +

        (
            (seniorityScore ?? 50) * 0.10
        )


    return Number(
        finalScore.toFixed(2),
    );

}