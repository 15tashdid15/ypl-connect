import Link from "next/link";
import { notFound } from "next/navigation";

import {
    getApplicationStatusLabel,
} from "@/lib/application-status";
import prisma from "@/lib/prisma";
import { requireRecruiter } from "@/lib/require-recruiter";

export const dynamic = "force-dynamic";

type CandidateDetailsPageProps = {
    params: Promise<{
        id: string;
    }>;
};

function formatDateTime(date: Date) {
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export default async function CandidateDetailsPage({
    params,
}: CandidateDetailsPageProps) {
    await requireRecruiter();

    const { id } = await params;

    const candidate =
        await prisma.candidate.findUnique({
            where: {
                id,
            },
            include: {
                applications: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        id: true,
                        referenceId: true,
                        jobTitle: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });

    if (!candidate) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f5c9c]">
                            YPL Recruiter Portal
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-[#0b2d5c]">
                            Candidate profile
                        </h1>
                    </div>

                    <Link
                        href="/recruiter/candidates"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Back to candidates
                    </Link>
                </div>
            </header>

            <div className="mx-auto grid max-w-7xl gap-7 px-5 py-10 lg:grid-cols-[360px_1fr]">
                <aside className="space-y-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-[#0f5c9c]">
                            {candidate.fullName
                                .split(/\s+/)
                                .slice(0, 2)
                                .map((name) => name[0])
                                .join("")
                                .toUpperCase()}
                        </div>

                        <h2 className="mt-5 text-2xl font-bold text-[#0b2d5c]">
                            {candidate.fullName}
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            {candidate.email}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            {candidate.phone}
                        </p>

                        {candidate.portfolioUrl && (
                            <a
                                href={candidate.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-5 inline-flex font-semibold text-[#0f5c9c] hover:underline"
                            >
                                Open LinkedIn or portfolio
                            </a>
                        )}
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#0b2d5c]">
                            Profile information
                        </h2>

                        <dl className="mt-5 space-y-5">
                            <div>
                                <dt className="text-sm text-slate-500">
                                    Location
                                </dt>

                                <dd className="mt-1 font-semibold text-slate-900">
                                    {candidate.location}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-slate-500">
                                    Current organization
                                </dt>

                                <dd className="mt-1 font-semibold text-slate-900">
                                    {candidate.currentCompany ||
                                        "Not provided"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-slate-500">
                                    Experience
                                </dt>

                                <dd className="mt-1 font-semibold text-slate-900">
                                    {candidate.experience}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-slate-500">
                                    Candidate since
                                </dt>

                                <dd className="mt-1 font-semibold text-slate-900">
                                    {formatDateTime(
                                        candidate.createdAt,
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-slate-500">
                                    Last profile update
                                </dt>

                                <dd className="mt-1 font-semibold text-slate-900">
                                    {formatDateTime(
                                        candidate.updatedAt,
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </section>
                </aside>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-xl font-bold text-[#0b2d5c]">
                            Application history
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {candidate.applications.length} total
                            application
                            {candidate.applications.length === 1
                                ? ""
                                : "s"}
                        </p>
                    </div>

                    {candidate.applications.length === 0 ? (
                        <p className="px-6 py-12 text-sm text-slate-500">
                            This candidate has no application
                            history.
                        </p>
                    ) : (
                        <div className="divide-y divide-slate-200">
                            {candidate.applications.map(
                                (application) => (
                                    <article
                                        key={application.id}
                                        className="grid gap-4 px-6 py-6 transition hover:bg-slate-50 md:grid-cols-[1fr_auto]"
                                    >
                                        <div>
                                            <Link
                                                href={`/recruiter/applications/${application.id}`}
                                                className="text-lg font-bold text-slate-900 hover:text-[#0f5c9c]"
                                            >
                                                {application.jobTitle}
                                            </Link>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {application.referenceId}
                                            </p>

                                            <p className="mt-2 text-sm text-slate-500">
                                                Submitted{" "}
                                                {formatDateTime(
                                                    application.createdAt,
                                                )}
                                            </p>
                                        </div>

                                        <div className="md:text-right">
                                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0f5c9c]">
                                                {getApplicationStatusLabel(
                                                    application.status,
                                                )}
                                            </span>

                                            <p className="mt-2 text-xs text-slate-400">
                                                Updated{" "}
                                                {formatDateTime(
                                                    application.updatedAt,
                                                )}
                                            </p>
                                        </div>
                                    </article>
                                ),
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}