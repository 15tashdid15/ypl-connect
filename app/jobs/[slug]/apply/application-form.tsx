"use client";

import { FormEvent, useState } from "react";

type ApplicationFormProps = {
    jobSlug: string;
    jobTitle: string;
};

type SubmissionState = {
    status: "idle" | "submitting" | "success" | "error";
    message: string;
    referenceId?: string;
};

const initialState: SubmissionState = {
    status: "idle",
    message: "",
};

const fieldClassName =
    "mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0f5c9c] focus:ring-4 focus:ring-blue-100";

export default function ApplicationForm({
    jobSlug,
    jobTitle,
}: ApplicationFormProps) {
    const [submission, setSubmission] =
        useState<SubmissionState>(initialState);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        formData.set("jobSlug", jobSlug);
        formData.set("jobTitle", jobTitle);

        setSubmission({
            status: "submitting",
            message: "Submitting your application...",
        });

        try {
            const response = await fetch("/api/applications", {
                method: "POST",
                body: formData,
            });

            const result = (await response.json()) as {
                message?: string;
                applicationId?: string;
                errors?: string[];
            };

            if (!response.ok) {
                const errorMessage =
                    result.errors?.join(" ") ||
                    result.message ||
                    "The application could not be submitted.";

                throw new Error(errorMessage);
            }

            form.reset();

            setSubmission({
                status: "success",
                message:
                    result.message || "Your application was submitted successfully.",
                referenceId: result.applicationId,
            });
        } catch (error) {
            setSubmission({
                status: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong. Please try again.",
            });
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-8"
        >
            <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
            />

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold text-[#0b2d5c]">
                    Personal information
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Fields marked with an asterisk are required.
                </p>

                <div className="mt-7 grid gap-6 md:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Full name *
                        <input
                            required
                            type="text"
                            name="fullName"
                            minLength={2}
                            maxLength={100}
                            placeholder="Enter your full name"
                            className={fieldClassName}
                        />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                        Email address *
                        <input
                            required
                            type="email"
                            name="email"
                            maxLength={150}
                            placeholder="name@example.com"
                            className={fieldClassName}
                        />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                        Phone number *
                        <input
                            required
                            type="tel"
                            name="phone"
                            minLength={7}
                            maxLength={30}
                            placeholder="+880 1XXXXXXXXX"
                            className={fieldClassName}
                        />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                        Current location *
                        <input
                            required
                            type="text"
                            name="location"
                            minLength={2}
                            maxLength={100}
                            placeholder="Dhaka, Bangladesh"
                            className={fieldClassName}
                        />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                        Current organization
                        <input
                            type="text"
                            name="currentCompany"
                            maxLength={150}
                            placeholder="Organization name"
                            className={fieldClassName}
                        />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                        Years of experience *
                        <select
                            required
                            name="experience"
                            defaultValue=""
                            className={fieldClassName}
                        >
                            <option value="" disabled>
                                Select experience
                            </option>
                            <option value="Fresh graduate">Fresh graduate</option>
                            <option value="Less than 1 year">Less than 1 year</option>
                            <option value="1-2 years">1–2 years</option>
                            <option value="3-5 years">3–5 years</option>
                            <option value="6-10 years">6–10 years</option>
                            <option value="More than 10 years">
                                More than 10 years
                            </option>
                        </select>
                    </label>

                    <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                        LinkedIn or portfolio URL
                        <input
                            type="url"
                            name="portfolioUrl"
                            maxLength={300}
                            placeholder="https://linkedin.com/in/your-profile"
                            className={fieldClassName}
                        />
                    </label>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold text-[#0b2d5c]">
                    Application details
                </h2>

                <div className="mt-7 space-y-6">
                    <label className="block text-sm font-semibold text-slate-700">
                        Cover letter or note
                        <textarea
                            name="coverLetter"
                            rows={7}
                            maxLength={3000}
                            placeholder="Briefly explain why you are suitable for this position."
                            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0f5c9c] focus:ring-4 focus:ring-blue-100"
                        />
                    </label>

                    <label className="block text-sm font-semibold text-slate-700">
                        Upload CV *
                        <input
                            required
                            type="file"
                            name="cv"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            className="mt-2 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#0b2d5c] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#123f77]"
                        />

                        <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
                            Accepted formats: PDF, DOC or DOCX. Maximum file size: 5 MB.
                        </span>
                    </label>

                    <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                        <input
                            required
                            type="checkbox"
                            name="consent"
                            className="mt-1 h-4 w-4 rounded border-slate-300"
                        />

                        <span className="text-sm leading-6 text-slate-600">
                            I confirm that the information provided is accurate and consent
                            to YES Private Limited processing my information for recruitment
                            purposes.
                        </span>
                    </label>
                </div>
            </section>

            {submission.status === "success" && (
                <div
                    role="status"
                    className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
                >
                    <h2 className="font-bold text-emerald-900">
                        Application submitted
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-emerald-800">
                        {submission.message}
                    </p>

                    {submission.referenceId && (
                        <p className="mt-3 text-sm font-semibold text-emerald-900">
                            Reference: {submission.referenceId}
                        </p>
                    )}
                </div>
            )}

            {submission.status === "error" && (
                <div
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 p-5"
                >
                    <h2 className="font-bold text-red-900">
                        Application not submitted
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-red-800">
                        {submission.message}
                    </p>
                </div>
            )}

            <button
                type="submit"
                disabled={submission.status === "submitting"}
                className="w-full rounded-xl bg-[#0b2d5c] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#123f77] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {submission.status === "submitting"
                    ? "Submitting application..."
                    : "Submit application"}
            </button>
        </form>
    );
}
