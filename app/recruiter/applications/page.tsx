import Link from "next/link";
import { redirect } from "next/navigation";

import { Prisma } from "@/app/generated/prisma/client";
import {
    getApplicationStatusLabel,
    isApplicationStatus,
} from "@/lib/application-status";
import prisma from "@/lib/prisma";
import { requireRecruiter } from "@/lib/require-recruiter";

import ApplicationFilters from "./application-filters";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 15;

type ApplicationsPageProps = {
    searchParams: Promise<{
        q?: string | string[];
        status?: string | string[];
        job?: string | string[];
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

export default async function RecruiterApplicationsPage({
    searchParams,
}: ApplicationsPageProps) {
    await requireRecruiter();

    const parameters = await searchParams;

    const query = getSearchValue(parameters.q);

    const rawStatus = getSearchValue(
        parameters.status,
    );

    const jobSlug = getSearchValue(parameters.job);

    const requestedPage = getPageNumber(
        getSearchValue(parameters.page),
    );

    const status = isApplicationStatus(rawStatus)
        ? rawStatus
        : "";

    const filters: Prisma.ApplicationWhereInput[] =
        [];

    if (query) {
        filters.push({
            OR: [
                {
                    referenceId: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    jobTitle: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    candidate: {
                        is: {
                            fullName: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                    },
                },
                {
                    candidate: {
                        is: {
                            email: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                    },
                },
                {
                    candidate: {
                        is: {
                            phone: {
                                contains: query,
                            },
                        },
                    },
                },
                {
                    candidate: {
                        is: {
                            location: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            ],
        });
    }

    if (status) {
        filters.push({
            status,
        });
    }

    if (jobSlug) {
        filters.push({
            jobSlug,
        });
    }

    const where: Prisma.ApplicationWhereInput =
        filters.length > 0
            ? {
                AND: filters,
            }
            : {};

    function createPageUrl(page: number) {
        const urlParameters = new URLSearchParams();

        if (query) {
            urlParameters.set("q", query);
        }

        if (status) {
            urlParameters.set("status", status);
        }

        if (jobSlug) {
            urlParameters.set("job", jobSlug);
        }

        if (page > 1) {
            urlParameters.set(
                "page",
                page.toString(),
            );
        }

        const queryString =
            urlParameters.toString();

        return queryString
            ? `/recruiter/applications?${queryString}`
            : "/recruiter/applications";
    }

    /*
     * Use the requested page for the initial database query.
     * Filters automatically remove the page parameter, so
     * normal filter changes always return to page 1.
     */
    const currentPage = requestedPage;

    const [
        applicationCount,
        jobOptions,
        applications,
    ] = await Promise.all([
        prisma.application.count({
            where,
        }),

        prisma.application.findMany({
            distinct: ["jobSlug"],
            orderBy: {
                jobTitle: "asc",
            },
            select: {
                jobSlug: true,
                jobTitle: true,
            },
        }),

        prisma.application.findMany({
            where,
            skip:
                (currentPage - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                referenceId: true,
                jobTitle: true,
                jobSlug: true,
                status: true,
                createdAt: true,
                candidate: {
                    select: {
                        fullName: true,
                        email: true,
                        location: true,
                    },
                },
            },
        }),
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            applicationCount / PAGE_SIZE,
        ),
    );

    /*
     * Someone may manually enter an invalid page number,
     * such as ?page=100. Redirect them to the last valid
     * page instead of displaying an empty table.
     */
    if (currentPage > totalPages) {
        redirect(createPageUrl(totalPages));
    }

    const firstVisibleRecord =
        applicationCount === 0
            ? 0
            : (currentPage - 1) *
            PAGE_SIZE +
            1;

    const lastVisibleRecord = Math.min(
        currentPage * PAGE_SIZE,
        applicationCount,
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
                            Applications
                        </h1>
                    </div>

                    <Link
                        href="/recruiter/dashboard"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Dashboard
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-5 py-10">
                <ApplicationFilters
                    key={`${query}|${status}|${jobSlug}`}
                    initialQuery={query}
                    initialStatus={status}
                    initialJobSlug={jobSlug}
                    jobOptions={jobOptions}
                />

                <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
                        <div>
                            <h2 className="text-xl font-bold text-[#0b2d5c]">
                                Application records
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Showing{" "}
                                {firstVisibleRecord}–
                                {lastVisibleRecord} of{" "}
                                {applicationCount}
                            </p>
                        </div>
                    </div>

                    {applications.length === 0 ? (
                        <p className="px-6 py-12 text-sm text-slate-500">
                            No applications match the selected
                            filters.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        {[
                                            "Candidate",
                                            "Position",
                                            "Status",
                                            "Submitted",
                                            "Action",
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {applications.map(
                                        (application) => (
                                            <tr
                                                key={application.id}
                                                className="transition hover:bg-slate-50"
                                            >
                                                <td className="px-6 py-5">
                                                    <p className="font-semibold text-slate-900">
                                                        {
                                                            application
                                                                .candidate
                                                                .fullName
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {
                                                            application
                                                                .candidate
                                                                .email
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {
                                                            application
                                                                .candidate
                                                                .location
                                                        }
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <p className="font-medium text-slate-800">
                                                        {
                                                            application.jobTitle
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {
                                                            application.referenceId
                                                        }
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0f5c9c]">
                                                        {getApplicationStatusLabel(
                                                            application.status,
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">
                                                    {formatDate(
                                                        application.createdAt,
                                                    )}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <Link
                                                        href={`/recruiter/applications/${application.id}`}
                                                        className="font-semibold text-[#0f5c9c] hover:underline"
                                                    >
                                                        View details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
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
                                    currentPage ===
                                    totalPages
                                }
                                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${currentPage ===
                                    totalPages
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