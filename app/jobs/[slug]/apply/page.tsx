import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobBySlug, jobs } from "@/data/jobs";
import ApplicationForm from "./application-form";

type ApplyPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export function generateStaticParams() {
    return jobs.map((job) => ({
        slug: job.slug,
    }));
}

export async function generateMetadata({
    params,
}: ApplyPageProps): Promise<Metadata> {
    const { slug } = await params;
    const job = getJobBySlug(slug);

    if (!job) {
        return {
            title: "Job Not Found",
        };
    }

    return {
        title: `Apply for ${job.title}`,
        description: `Submit your application for the ${job.title} position.`,
    };
}

export default async function ApplyPage({ params }: ApplyPageProps) {
    const { slug } = await params;
    const job = getJobBySlug(slug);

    if (!job) {
        notFound();
    }

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
                        href={`/jobs/${job.slug}`}
                        className="text-sm font-semibold text-slate-600 transition hover:text-[#0b2d5c]"
                    >
                        Back to job details
                    </Link>
                </div>
            </header>

            <section className="bg-[#071f43]">
                <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-18">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
                        Job application
                    </p>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Apply for {job.title}
                    </h1>

                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-100">
                        <span>{job.department}</span>
                        <span>{job.location}</span>
                        <span>{job.type}</span>
                        <span>Deadline: {job.deadline}</span>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-5xl gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_280px]">
                <ApplicationForm
                    jobSlug={job.slug}
                    jobTitle={job.title}
                />

                <aside className="order-first lg:order-last">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f5c9c]">
                            Applying for
                        </p>

                        <h2 className="mt-3 text-xl font-bold text-[#0b2d5c]">
                            {job.title}
                        </h2>

                        <dl className="mt-6 space-y-4 text-sm">
                            <div>
                                <dt className="text-slate-500">Department</dt>
                                <dd className="mt-1 font-semibold text-slate-900">
                                    {job.department}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500">Location</dt>
                                <dd className="mt-1 font-semibold text-slate-900">
                                    {job.location}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500">Employment type</dt>
                                <dd className="mt-1 font-semibold text-slate-900">
                                    {job.type}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500">Deadline</dt>
                                <dd className="mt-1 font-semibold text-slate-900">
                                    {job.deadline}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </aside>
            </section>
        </main>
    );
}
