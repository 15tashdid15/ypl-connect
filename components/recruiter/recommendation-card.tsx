import RecommendationActions from "./recommendation-actions";

type RecommendationCardProps = {

    jobId: string;
    candidate: {
        candidateId: string;

        applicationId: string | null;
        name: string;

        finalScore: number;

        semanticScore: number;
        skillScore: number;
        experienceScore: number;
        seniorityScore: number;

        reasons?: string[];
    };

    rank: number;
};


function getMatchLevel(score: number) {

    if (score >= 85) {
        return "Excellent Match";
    }

    if (score >= 70) {
        return "Strong Match";
    }

    if (score >= 50) {
        return "Moderate Match";
    }

    return "Low Match";

}



function ScoreBox({
    label,
    value,
}: {
    label: string;
    value: number;
}) {

    return (

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">

                {label}

            </p>


            <p className="mt-2 text-xl font-bold text-[#0b2d5c]">

                {value.toFixed(2)}%

            </p>

        </div>

    );

}



export default function RecommendationCard({

    jobId,

    candidate,

    rank,

}: RecommendationCardProps) {


    return (

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


            <div className="flex flex-col justify-between gap-5 md:flex-row">


                <div>


                    <div className="flex items-center gap-3">


                        <span className="rounded-full bg-[#0b2d5c] px-3 py-1 text-xs font-bold text-white">

                            #{rank}

                        </span>


                        <h3 className="text-xl font-bold text-slate-900">

                            {candidate.name}

                        </h3>


                    </div>


                    <p className="mt-3 text-sm font-semibold text-[#0f5c9c]">

                        {getMatchLevel(candidate.finalScore)}

                    </p>


                </div>



                <div className="text-right">


                    <p className="text-sm text-slate-500">

                        AI Match Score

                    </p>


                    <p className="mt-1 text-3xl font-bold text-[#0b2d5c]">

                        {candidate.finalScore.toFixed(2)}%

                    </p>


                </div>


            </div>



            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


                <ScoreBox
                    label="Semantic"
                    value={candidate.semanticScore}
                />


                <ScoreBox
                    label="Skills"
                    value={candidate.skillScore}
                />


                <ScoreBox
                    label="Experience"
                    value={candidate.experienceScore}
                />


                <ScoreBox
                    label="Seniority"
                    value={candidate.seniorityScore}
                />


            </div>



            {
                candidate.reasons && (

                    <div className="mt-6 rounded-xl bg-slate-50 p-4">


                        <p className="text-sm font-bold text-slate-700">

                            Why this candidate?

                        </p>


                        <div className="mt-2 space-y-1 text-sm text-slate-600">

                            {
                                candidate.reasons.map(
                                    (
                                        reason,
                                        index,
                                    ) => (

                                        <p key={index}>
                                            ✓ {reason}
                                        </p>

                                    ),
                                )
                            }

                        </div>


                    </div>

                )
            }



            <RecommendationActions

                jobId={
                    jobId
                }

                candidateId={
                    candidate.candidateId
                }

            />


        </article>

    );

}