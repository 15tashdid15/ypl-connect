export function calculateSeniorityMatch({

    candidateSeniority,

    requiredSeniority,

}: {

    candidateSeniority?: string | null;

    requiredSeniority?: string | null;

}): number {


    if (
        !requiredSeniority ||
        !candidateSeniority
    ) {

        return 50;

    }


    const candidate =
        candidateSeniority.toLowerCase();


    const required =
        requiredSeniority.toLowerCase();



    if (
        candidate === required
    ) {

        return 100;

    }



    const levels = [
        "junior",
        "mid",
        "senior",
        "lead",
        "manager",
    ];



    const candidateIndex =
        levels.indexOf(
            candidate,
        );


    const requiredIndex =
        levels.indexOf(
            required,
        );



    if (
        candidateIndex === -1 ||
        requiredIndex === -1
    ) {

        return 50;

    }



    const difference =
        Math.abs(
            candidateIndex -
            requiredIndex,
        );



    if (
        difference === 1
    ) {

        return 75;

    }


    return 40;

}