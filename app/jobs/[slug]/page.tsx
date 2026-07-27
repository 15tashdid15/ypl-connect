import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobBySlug, jobs } from "@/data/jobs";

type JobDetailsPageProps = {
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
}: JobDetailsPageProps): Promise<Metadata> {
    const { slug } = await params;
    const job = getJobBySlug(slug);

    if (!job) {
        return {
            title: "Job Not Found",
        };
    }

    return {
        title: job.title,
        description: job.summary,
    };
}

export default async function JobDetailsPage({
    params,
}: JobDetailsPageProps) {
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

                        <span className="font-bold text-[#0b2d5c]">YPL Connect</span>
                    </Link>

                    <Link
                        href="/jobs"
                        className="text-sm font-semibold text-slate-600 transition hover:text-[#0b2d5c]"
                    >
                        View all jobs
                    </Link>
                </div>
            </header>

            <section className="bg-[#071f43]">
                <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
                    <Link
                        href="/jobs"
                        className="text-sm font-semibold text-blue-200 transition hover:text-white"
                    >
                        ← Back to current jobs
                    </Link>

                    <div className="mt-8 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
                            {job.department}
                        </span>

                        <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
                            {job.type}
                        </span>

                        <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
                            {job.workplace}
                        </span>
                    </div>

                    <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        {job.title}
                    </h1>

                    <p className="mt-5 max-w-3xl text-base leading-8 text-blue-100">
                        {job.summary}
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_340px] lg:py-16">
                <div className="space-y-8">
                    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="text-2xl font-bold text-[#0b2d5c]">
                            Key responsibilities
                        </h2>

                        <ul className="mt-6 space-y-4">
                            {job.responsibilities.map((responsibility) => (
                                <li
                                    key={responsibility}
                                    className="flex gap-3 text-sm leading-7 text-slate-600"
                                >
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#f5b400]" />
                                    <span>{responsibility}</span>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="text-2xl font-bold text-[#0b2d5c]">
                            Requirements
                        </h2>

                        <ul className="mt-6 space-y-4">
                            {job.requirements.map((requirement) => (
                                <li
                                    key={requirement}
                                    className="flex gap-3 text-sm leading-7 text-slate-600"
                                >
                                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[#0f5c9c]">
                                        ✓
                                    </span>
                                    <span>{requirement}</span>
                                </li>
                            ))}
                        </ul>
                    </article>
                </div>

                <aside>
                    <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-[#0b2d5c]">
                            Job overview
                        </h2>

                        <dl className="mt-6 space-y-5 text-sm">
                            <div>
                                <dt className="text-slate-500">Location</dt>
                                <dd className="mt-1 font-semibold text-slate-900">
                                    {job.location}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500">Experience</dt>
                                <dd className="mt-1 font-semibold text-slate-900">
                                    {job.experience}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500">Education</dt>
                                <dd className="mt-1 font-semibold leading-6 text-slate-900">
                                    {job.education}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500">Vacancies</dt>
                                <dd className="mt-1 font-semibold text-slate-900">
                                    {job.vacancy}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500">Salary</dt>
                                <dd className="mt-1 font-semibold text-slate-900">
                                    {job.salary}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500">Deadline</dt>
                                <dd className="mt-1 font-semibold text-slate-900">
                                    {job.deadline}
                                </dd>
                            </div>
                        </dl>

                        <button
                            type="button"
                            disabled
                            className="mt-8 w-full cursor-not-allowed rounded-xl bg-[#0b2d5c] px-5 py-3.5 text-sm font-bold text-white opacity-70"
                        >
                            Application form coming next
                        </button>

                        <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                            The online CV and application form will be connected in the next
                            development stage.
                        </p>
                    </div>
                </aside>
            </section>
        </main>
    );
}
