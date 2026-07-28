"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
    APPLICATION_STATUSES,
    ApplicationStatusValue,
} from "@/lib/application-status";

type StatusFormProps = {
    applicationId: string;
    currentStatus: ApplicationStatusValue;
};

export default function StatusForm({
    applicationId,
    currentStatus,
}: StatusFormProps) {
    const router = useRouter();

    const [status, setStatus] =
        useState<ApplicationStatusValue>(
            currentStatus,
        );

    const [savedStatus, setSavedStatus] =
        useState<ApplicationStatusValue>(
            currentStatus,
        );

    const [message, setMessage] = useState("");
    const [isSaving, setIsSaving] =
        useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setIsSaving(true);
        setMessage("");

        try {
            const response = await fetch(
                `/api/recruiter/applications/${applicationId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status,
                    }),
                },
            );

            const result = (await response.json()) as {
                message?: string;
            };

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "The application status could not be updated.",
                );
            }

            setSavedStatus(status);
            setMessage(
                result.message ||
                "Application status updated.",
            );

            router.refresh();
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong.",
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <h2 className="text-lg font-bold text-[#0b2d5c]">
                Application status
            </h2>

            <label className="mt-5 block text-sm font-semibold text-slate-700">
                Current stage
                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(
                            event.target
                                .value as ApplicationStatusValue,
                        )
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-normal"
                >
                    {APPLICATION_STATUSES.map((item) => (
                        <option
                            key={item.value}
                            value={item.value}
                        >
                            {item.label}
                        </option>
                    ))}
                </select>
            </label>

            <button
                type="submit"
                disabled={
                    isSaving || status === savedStatus
                }
                className="mt-4 w-full rounded-xl bg-[#0b2d5c] px-5 py-3 text-sm font-bold text-white hover:bg-[#123f77] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSaving
                    ? "Updating status..."
                    : "Update status"}
            </button>

            {message && (
                <p
                    role="status"
                    className="mt-4 text-sm text-slate-600"
                >
                    {message}
                </p>
            )}
        </form>
    );
}