import type { Metadata } from "next";
import Link from "next/link";
import JobsList from "./jobs-list";
import { jobs } from "@/data/jobs";

export const metadata: Metadata = {
    title: "Current Jobs",
    description:
        "Explore current job opportunities available through YES Private Limited.",
};

export default function JobsPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b2d5c] text-sm font-bold text-white">
                            YPL
                        </span>

                        <span>
                            <span className="block font-bold text-[#0b2d5c]">
                                YPL Connect
                            </span>
                            <span className="hidden text-xs text-slate-500 sm:block">
                                YES Private Limited
                            </span>
                        </span>
                    </Link>

                    <Link
                        href="/"
                        className="text-sm font-semibold text-slate-600 transition hover:text-[#0b2d5c]"
                    >
                        Back to homepage
                    </Link>
                </div>
            </header>

            <section className="bg-[#071f43]">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
                        Career opportunities
                    </p>

                    <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        Find an opportunity that matches your experience
                    </h1>

                    <p className="mt-5 max-w-2xl leading-8 text-blue-100">
                        Browse current vacancies, review job requirements and find the
                        right next step for your career.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
                <JobsList jobs={jobs} />
            </section>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:px-8 md:flex-row md:justify-between">
                    <p>© 2026 YES Private Limited.</p>
                    <p>YPL Connect — Recruitment Management Platform</p>
                </div>
            </footer>
        </main>
    );
}