import prisma from "@/lib/prisma";
import { requireRecruiter } from "@/lib/require-recruiter";

import SignOutButton from "./sign-out-button";

export const dynamic = "force-dynamic";

function formatStatus(status: string) {
    return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) =>
            character.toUpperCase(),
        );
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

export default async function RecruiterDashboardPage() {
    const session = await requireRecruiter();

    const [
        candidateCount,
        applicationCount,
        newApplicationCount,
        shortlistedCount,
        recentApplications,
    ] = await Promise.all([
        prisma.candidate.count(),

        prisma.application.count(),

        prisma.application.count({
            where: {
                status: "APPLIED",
            },
        }),

        prisma.application.count({
            where: {
                status: "SHORTLISTED",
            },
        }),

        prisma.application.findMany({
            take: 8,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                referenceId: true,
                jobTitle: true,
                status: true,
                createdAt: true,
                candidate: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
            },
        }),
    ]);

    const statistics = [
        {
            label: "Candidates",
            value: candidateCount,
        },
        {
            label: "Applications",
            value: applicationCount,
        },
        {
            label: "New applications",
            value: newApplicationCount,
        },
        {
            label: "Shortlisted",
            value: shortlistedCount,
        },
    ];

    return (
        <main className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f5c9c]">
                            YPL Recruiter Portal
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-[#0b2d5c]">
                            Recruitment dashboard
                        </h1>
                    </div>

                    <SignOutButton />
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-5 py-10">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Signed in recruiter
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                        {session.user.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                        {session.user.email}
                    </p>
                </section>

                <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {statistics.map((statistic) => (
                        <article
                            key={statistic.label}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <p className="text-sm font-medium text-slate-500">
                                {statistic.label}
                            </p>

                            <p className="mt-3 text-3xl font-bold text-[#0b2d5c]">
                                {statistic.value}
                            </p>
                        </article>
                    ))}
                </section>

                <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-xl font-bold text-[#0b2d5c]">
                            Recent applications
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            The latest candidate applications received
                            by YPL Connect.
                        </p>
                    </div>

                    {recentApplications.length === 0 ? (
                        <p className="px-6 py-12 text-sm text-slate-500">
                            No applications have been submitted yet.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Candidate
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Position
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Submitted
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {recentApplications.map(
                                        (application) => (
                                            <tr key={application.id}>
                                                <td className="px-6 py-5">
                                                    <p className="font-semibold text-slate-900">
                                                        {
                                                            application.candidate
                                                                .fullName
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {
                                                            application.candidate
                                                                .email
                                                        }
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <p className="font-medium text-slate-800">
                                                        {application.jobTitle}
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {application.referenceId}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0f5c9c]">
                                                        {formatStatus(
                                                            application.status,
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">
                                                    {formatDate(
                                                        application.createdAt,
                                                    )}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}