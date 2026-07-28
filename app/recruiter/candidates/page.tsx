import Link from "next/link";
import { redirect } from "next/navigation";

import { Prisma } from "@/app/generated/prisma/client";
import {
    getApplicationStatusLabel,
} from "@/lib/application-status";
import prisma from "@/lib/prisma";
import { requireRecruiter } from "@/lib/require-recruiter";

import CandidateFilters from "./candidate-filters";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 15;

type CandidatesPageProps = {
    searchParams: Promise<{
        q?: string | string[];
        page?: string | string[];
    }>;
};

function getSearchValue(
    value: string | string[] | undefined,
) {
    return Array.isArray(value)
        ? value[0]?.trim() ?? ""
        : value?.trim() ?? "";
}

function getPageNumber(value: string) {
    const page = Number(value);

    return Number.isInteger(page) && page > 0
        ? page
        : 1;
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

export default async function RecruiterCandidatesPage({
    searchParams,
}: CandidatesPageProps) {
    await requireRecruiter();

    const parameters = await searchParams;

    const query = getSearchValue(parameters.q);

    const currentPage = getPageNumber(
        getSearchValue(parameters.page),
    );

    const where: Prisma.CandidateWhereInput =
        query
            ? {
                OR: [
                    {
                        fullName: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        email: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        phone: {
                            contains: query,
                        },
                    },
                    {
                        location: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        currentCompany: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        experience: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : {};

    function createPageUrl(page: number) {
        const parameters = new URLSearchParams();

        if (query) {
            parameters.set("q", query);
        }

        if (page > 1) {
            parameters.set("page", page.toString());
        }

        const queryString = parameters.toString();

        return queryString
            ? `/recruiter/candidates?${queryString}`
            : "/recruiter/candidates";
    }

    const [candidateCount, candidates] =
        await Promise.all([
            prisma.candidate.count({
                where,
            }),

            prisma.candidate.findMany({
                where,
                skip:
                    (currentPage - 1) * PAGE_SIZE,
                take: PAGE_SIZE,
                orderBy: {
                    updatedAt: "desc",
                },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    location: true,
                    currentCompany: true,
                    experience: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            applications: true,
                        },
                    },
                    applications: {
                        take: 1,
                        orderBy: {
                            createdAt: "desc",
                        },
                        select: {
                            jobTitle: true,
                            status: true,
                            createdAt: true,
                        },
                    },
                },
            }),
        ]);

    const totalPages = Math.max(
        1,
        Math.ceil(candidateCount / PAGE_SIZE),
    );

    if (currentPage > totalPages) {
        redirect(createPageUrl(totalPages));
    }

    const firstVisibleRecord =
        candidateCount === 0
            ? 0
            : (currentPage - 1) * PAGE_SIZE + 1;

    const lastVisibleRecord = Math.min(
        currentPage * PAGE_SIZE,
        candidateCount,
    );

    return (
        <main className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f5c9c]">
                            YPL Recruiter Portal
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-[#0b2d5c]">
                            Candidates
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/recruiter/applications"
                            className="rounded-xl bg-[#0b2d5c] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#123f77]"
                        >
                            Applications
                        </Link>

                        <Link
                            href="/recruiter/dashboard"
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-5 py-10">
                <CandidateFilters
                    key={query}
                    initialQuery={query}
                />

                <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-xl font-bold text-[#0b2d5c]">
                            Candidate records
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Showing {firstVisibleRecord}–
                            {lastVisibleRecord} of{" "}
                            {candidateCount}
                        </p>
                    </div>

                    {candidates.length === 0 ? (
                        <p className="px-6 py-12 text-sm text-slate-500">
                            No candidates match your search.
                        </p>
                    ) : (
                        <div className="divide-y divide-slate-200">
                            {candidates.map((candidate) => {
                                const latestApplication =
                                    candidate.applications[0];

                                return (
                                    <article
                                        key={candidate.id}
                                        className="grid gap-5 px-6 py-6 transition hover:bg-slate-50 lg:grid-cols-[1.2fr_1fr_1fr_auto]"
                                    >
                                        <div>
                                            <Link
                                                href={`/recruiter/candidates/${candidate.id}`}
                                                className="text-lg font-bold text-slate-900 hover:text-[#0f5c9c]"
                                            >
                                                {candidate.fullName}
                                            </Link>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {candidate.email}
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {candidate.phone}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-slate-500">
                                                Candidate profile
                                            </p>

                                            <p className="mt-2 font-semibold text-slate-800">
                                                {candidate.location}
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {candidate.currentCompany ||
                                                    "No current organization"}
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {candidate.experience}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-slate-500">
                                                Latest application
                                            </p>

                                            {latestApplication ? (
                                                <>
                                                    <p className="mt-2 font-semibold text-slate-800">
                                                        {
                                                            latestApplication.jobTitle
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-sm text-[#0f5c9c]">
                                                        {getApplicationStatusLabel(
                                                            latestApplication.status,
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {formatDate(
                                                            latestApplication.createdAt,
                                                        )}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="mt-2 text-sm text-slate-500">
                                                    No applications
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center lg:justify-end">
                                            <div className="text-right">
                                                <p className="text-sm text-slate-500">
                                                    {
                                                        candidate._count
                                                            .applications
                                                    }{" "}
                                                    application
                                                    {candidate._count
                                                        .applications === 1
                                                        ? ""
                                                        : "s"}
                                                </p>

                                                <Link
                                                    href={`/recruiter/candidates/${candidate.id}`}
                                                    className="mt-3 inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-[#0f5c9c] hover:bg-white"
                                                >
                                                    View candidate
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-5">
                            <Link
                                href={createPageUrl(
                                    Math.max(
                                        1,
                                        currentPage - 1,
                                    ),
                                )}
                                aria-disabled={
                                    currentPage === 1
                                }
                                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${currentPage === 1
                                        ? "pointer-events-none border-slate-200 text-slate-300"
                                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                Previous
                            </Link>

                            <p className="text-sm text-slate-500">
                                Page {currentPage} of{" "}
                                {totalPages}
                            </p>

                            <Link
                                href={createPageUrl(
                                    Math.min(
                                        totalPages,
                                        currentPage + 1,
                                    ),
                                )}
                                aria-disabled={
                                    currentPage === totalPages
                                }
                                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${currentPage === totalPages
                                        ? "pointer-events-none border-slate-200 text-slate-300"
                                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                Next
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}