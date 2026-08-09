"use client";


import {
    useState,
} from "react";


type RecommendationActionsProps = {

    applicationId:
    string | null;

};



export default function RecommendationActions({

    applicationId,

}: RecommendationActionsProps) {


    const [loading, setLoading] =
        useState(false);


    const [message, setMessage] =
        useState("");



    async function updateStatus(
        status: string,
    ) {


        if (!applicationId) {

            setMessage(
                "No application found for this candidate.",
            );

            return;

        }



        setLoading(true);

        setMessage("");



        try {


            const response =
                await fetch(

                    `/api/recruiter/applications/${applicationId}/status`,

                    {

                        method: "PATCH",


                        headers: {

                            "Content-Type":
                                "application/json",

                        },


                        body: JSON.stringify({

                            status,

                        }),

                    },

                );



            const data =
                await response.json();



            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Status update failed.",
                );

            }



            setMessage(
                data.message ||
                "Status updated successfully.",
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
                    !applicationId
                }

                onClick={() =>
                    updateStatus(
                        "SHORTLISTED",
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
                    !applicationId
                }

                onClick={() =>
                    updateStatus(
                        "REJECTED",
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