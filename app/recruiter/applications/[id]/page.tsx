import Link from "next/link";
import { notFound } from "next/navigation";
import NoteForm from "./note-form";
import {
    ApplicationStatusValue,
    getApplicationStatusLabel,
} from "@/lib/application-status";
import prisma from "@/lib/prisma";
import { requireRecruiter } from "@/lib/require-recruiter";

import StatusForm from "./status-form";

export const dynamic = "force-dynamic";

type ApplicationDetailsPageProps = {
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

function formatFileSize(bytes: number) {
    if (bytes < 1024) {
        return `${bytes} bytes`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(
        bytes /
        (1024 * 1024)
    ).toFixed(2)} MB`;
}

export default async function ApplicationDetailsPage({
    params,
}: ApplicationDetailsPageProps) {
    await requireRecruiter();

    const { id } = await params;

    const application =
        await prisma.application.findUnique({
            where: {
                id,
            },
            include: {
                candidate: {
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
                            },
                        },
                    },
                },
                activities: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        id: true,
                        type: true,
                        message: true,
                        previousStatus: true,
                        newStatus: true,
                        recruiterName: true,
                        recruiterEmail: true,
                        createdAt: true,
                    },
                },
            },
        });

    if (!application) {
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
                            Application details
                        </h1>
                    </div>

                    <Link
                        href="/recruiter/applications"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Back to applications
                    </Link>
                </div>
            </header>

            <div className="mx-auto grid max-w-7xl gap-7 px-5 py-10 lg:grid-cols-[1fr_340px]">
                <div className="space-y-7">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-5">
                            <div>
                                <p className="text-sm font-semibold text-[#0f5c9c]">
                                    {application.referenceId}
                                </p>

                                <h2 className="mt-2 text-2xl font-bold text-[#0b2d5c]">
                                    {application.jobTitle}
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Submitted{" "}
                                    {formatDateTime(
                                        application.createdAt,
                                    )}
                                </p>
                            </div>

                            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-[#0f5c9c]">
                                {getApplicationStatusLabel(
                                    application.status,
                                )}
                            </span>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-[#0b2d5c]">
                            Candidate details
                        </h2>

                        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                            {[
                                [
                                    "Full name",
                                    application.candidate.fullName,
                                ],
                                [
                                    "Email",
                                    application.candidate.email,
                                ],
                                [
                                    "Phone",
                                    application.candidate.phone,
                                ],
                                [
                                    "Location",
                                    application.candidate.location,
                                ],
                                [
                                    "Current organization",
                                    application.candidate
                                        .currentCompany || "Not provided",
                                ],
                                [
                                    "Experience",
                                    application.candidate.experience,
                                ],
                            ].map(([label, value]) => (
                                <div key={label}>
                                    <dt className="text-sm font-medium text-slate-500">
                                        {label}
                                    </dt>

                                    <dd className="mt-1 font-semibold text-slate-900">
                                        {value}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        {application.candidate.portfolioUrl && (
                            <a
                                href={
                                    application.candidate
                                        .portfolioUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="mt-6 inline-flex font-semibold text-[#0f5c9c] hover:underline"
                            >
                                Open LinkedIn or portfolio
                            </a>
                        )}
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-[#0b2d5c]">
                            Cover letter or note
                        </h2>

                        <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                            {application.coverLetter ||
                                "No cover letter was provided."}
                        </p>
                    </section>
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div>
                            <h2 className="text-xl font-bold text-[#0b2d5c]">
                                Recruiter activity
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Status history and internal recruiter notes.
                            </p>
                        </div>

                        {application.activities.length === 0 ? (
                            <p className="mt-6 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                                No audit activity has been recorded yet.
                                Changes made before audit tracking was enabled
                                cannot be reconstructed.
                            </p>
                        ) : (
                            <div className="relative mt-7 space-y-6 before:absolute before:bottom-3 before:left-[11px] before:top-3 before:w-px before:bg-slate-200">
                                {application.activities.map((activity) => (
                                    <article
                                        key={activity.id}
                                        className="relative pl-10"
                                    >
                                        <span
                                            className={`absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-white ${activity.type === "STATUS_CHANGE"
                                                ? "bg-[#0f5c9c]"
                                                : "bg-amber-500"
                                                }`}
                                        />

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-bold text-slate-900">
                                                        {activity.type ===
                                                            "STATUS_CHANGE"
                                                            ? `Status changed from ${getApplicationStatusLabel(
                                                                activity.previousStatus ||
                                                                "UNKNOWN",
                                                            )} to ${getApplicationStatusLabel(
                                                                activity.newStatus ||
                                                                "UNKNOWN",
                                                            )}`
                                                            : "Internal recruiter note"}
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {activity.recruiterName} ·{" "}
                                                        {activity.recruiterEmail}
                                                    </p>
                                                </div>

                                                <time className="text-xs text-slate-400">
                                                    {formatDateTime(
                                                        activity.createdAt,
                                                    )}
                                                </time>
                                            </div>

                                            {activity.message && (
                                                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                                    {activity.message}
                                                </p>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-[#0b2d5c]">
                            Candidate application history
                        </h2>

                        <div className="mt-5 divide-y divide-slate-200">
                            {application.candidate.applications.map(
                                (item) => (
                                    <article
                                        key={item.id}
                                        className="flex flex-wrap items-center justify-between gap-4 py-4"
                                    >
                                        <div>
                                            <Link
                                                href={`/recruiter/applications/${item.id}`}
                                                className="font-semibold text-slate-900 hover:text-[#0f5c9c]"
                                            >
                                                {item.jobTitle}
                                            </Link>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {item.referenceId} ·{" "}
                                                {formatDateTime(
                                                    item.createdAt,
                                                )}
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                            {getApplicationStatusLabel(
                                                item.status,
                                            )}
                                        </span>
                                    </article>
                                ),
                            )}
                        </div>
                    </section>
                </div>

                <aside className="space-y-6">
                    <StatusForm
                        applicationId={application.id}
                        currentStatus={
                            application.status as ApplicationStatusValue
                        }
                    />
                    <NoteForm applicationId={application.id} />
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#0b2d5c]">
                            Candidate CV
                        </h2>

                        <dl className="mt-5 space-y-4 text-sm">
                            <div>
                                <dt className="text-slate-500">
                                    Original filename
                                </dt>

                                <dd className="mt-1 break-words font-semibold text-slate-900">
                                    {application.cvOriginalName}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500">
                                    File size
                                </dt>

                                <dd className="mt-1 font-semibold text-slate-900">
                                    {formatFileSize(
                                        application.cvSize,
                                    )}
                                </dd>
                            </div>
                        </dl>

                        {application.cvStorageKey ? (
                            <a
                                href={`/api/recruiter/applications/${application.id}/cv`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#0b2d5c] px-5 py-3 text-sm font-bold text-white hover:bg-[#123f77]"
                            >
                                Download private CV
                            </a>
                        ) : (
                            <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                                No stored CV is available for this
                                application.
                            </p>
                        )}

                        <p className="mt-3 text-xs leading-5 text-slate-500">
                            The private download link expires after
                            60 seconds.
                        </p>
                    </section>
                </aside>
            </div>
        </main>
    );
}