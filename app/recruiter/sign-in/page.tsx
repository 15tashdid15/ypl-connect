import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import SignInForm from "./sign-in-form";

export default async function RecruiterSignInPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        redirect("/recruiter/dashboard");
    }

    return (
        <main className="min-h-screen bg-slate-100 px-5 py-16">
            <div className="mx-auto max-w-md">
                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg sm:p-10">
                    <div className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0f5c9c]">
                        YPL Recruiter Portal
                    </div>

                    <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#0b2d5c]">
                        Recruiter sign in
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                        Access is restricted to authorized YES Private
                        Limited recruitment personnel.
                    </p>

                    <SignInForm />
                </div>
            </div>
        </main>
    );
}