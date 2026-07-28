"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type NoteFormProps = {
    applicationId: string;
};

export default function NoteForm({
    applicationId,
}: NoteFormProps) {
    const router = useRouter();

    const [note, setNote] = useState("");
    const [message, setMessage] = useState("");

    const [isSaving, setIsSaving] =
        useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setMessage("");

        const normalizedNote = note.trim();

        if (normalizedNote.length < 2) {
            setMessage("Enter an internal note.");
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch(
                `/api/recruiter/applications/${applicationId}/notes`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: normalizedNote,
                    }),
                },
            );

            const result = (await response.json()) as {
                message?: string;
            };

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "The internal note could not be added.",
                );
            }

            setNote("");

            setMessage(
                result.message ||
                "Internal note added successfully.",
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
                Add internal note
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
                Notes are visible only inside the recruiter
                portal.
            </p>

            <label className="mt-5 block text-sm font-semibold text-slate-700">
                Recruiter note
                <textarea
                    required
                    value={note}
                    onChange={(event) =>
                        setNote(event.target.value)
                    }
                    minLength={2}
                    maxLength={2000}
                    rows={5}
                    placeholder="Record screening observations, client feedback or follow-up actions"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal leading-6 outline-none focus:border-[#0f5c9c] focus:ring-4 focus:ring-blue-100"
                />

                <span className="mt-1 block text-right text-xs font-normal text-slate-400">
                    {note.length}/2000
                </span>
            </label>

            <button
                type="submit"
                disabled={
                    isSaving || note.trim().length < 2
                }
                className="mt-4 w-full rounded-xl border border-[#0b2d5c] px-5 py-3 text-sm font-bold text-[#0b2d5c] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSaving
                    ? "Adding note..."
                    : "Add internal note"}
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