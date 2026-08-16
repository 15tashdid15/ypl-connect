import Link from "next/link";

import { requireRecruiter } from "@/lib/require-recruiter";
import { getCandidateRecommendations } from "@/lib/job-matching/recommendation-service";

import RecommendationCard from "@/components/recruiter/recommendation-card";


export const dynamic = "force-dynamic";


export default async function RecommendationPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {


    const session =
        await requireRecruiter();


    const { id } = await params;


    const recruiterId =
        session.user.id;


    const recommendations =
        await getCandidateRecommendations(
            id,
            recruiterId,
        );



    return (

        <main className="min-h-screen bg-slate-100">


            <header className="border-b border-slate-200 bg-white">


                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">


                    <div>

                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f5c9c]">
                            YPL Recruiter Portal
                        </p>


                        <h1 className="mt-1 text-2xl font-bold text-[#0b2d5c]">
                            AI Candidate Recommendations
                        </h1>

                    </div>



                    <Link
                        href="/recruiter/dashboard"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Dashboard
                    </Link>


                </div>


            </header>




            <div className="mx-auto max-w-7xl px-5 py-10">


                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


                    <h2 className="text-xl font-bold text-[#0b2d5c]">
                        Recommended Candidates
                    </h2>


                    <p className="mt-2 text-sm text-slate-500">
                        Candidates ranked using semantic matching,
                        skills, experience, and seniority compatibility.
                    </p>


                </section>




                <section className="mt-8 space-y-5">


                    {
                        recommendations.length === 0 ? (

                            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">

                                No suitable candidates found.

                            </div>


                        ) : (


                            recommendations.map(
                                (
                                    candidate,
                                    index,
                                ) => (


                                    <RecommendationCard
                                        key={candidate.candidateId}
                                        jobId={id}
                                        candidate={candidate}
                                        rank={index + 1}
                                    />


                                ),
                            )


                        )
                    }


                </section>


            </div>


        </main>

    );

}