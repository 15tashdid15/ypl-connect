"use client";


import {
    useState,
} from "react";


type RecommendationActionsProps = {

    jobId: string;

    candidateId: string;

};



export default function RecommendationActions({

    jobId,
    candidateId,

}: RecommendationActionsProps) {


    const [loading, setLoading] =
        useState(false);


    const [message, setMessage] =
        useState("");



    async function saveAction(
        action: string,
    ) {

        setLoading(true);
        setMessage("");

        try {

            const response =
                await fetch(
                    `/api/recruiter/jobs/${jobId}/candidates/${candidateId}/action`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            action,
                        }),
                    },
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Action failed.",
                );

            }


            setMessage(
                data.message ||
                "Candidate action saved.",
            );


        } catch (error) {


            setMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong.",
            );


        } finally {

            setLoading(false);

        }

    }



    return (

        <div className="mt-6 flex flex-wrap gap-3">


            <button

                disabled={
                    loading ||
                    !jobId ||
                    !candidateId
                }

                onClick={() =>
                    saveAction(
                        "SHORTLIST",
                    )
                }

                className="rounded-xl border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"

            >

                {
                    loading
                        ? "Updating..."
                        : "Shortlist"
                }


            </button>



            <button

                disabled={
                    loading ||
                    !jobId ||
                    !candidateId
                }

                onClick={() =>
                    saveAction(
                        "REJECT",
                    )
                }

                className="rounded-xl border border-red-600 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"

            >

                Reject


            </button>



            {
                message && (

                    <p className="basis-full text-sm text-slate-600">

                        {message}

                    </p>

                )
            }


        </div>

    );

}