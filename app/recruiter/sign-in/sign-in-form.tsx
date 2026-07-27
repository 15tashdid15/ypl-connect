"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function SignInForm() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setErrorMessage("");
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);

        const email = String(formData.get("email") ?? "")
            .trim()
            .toLowerCase();

        const password = String(
            formData.get("password") ?? "",
        );

        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
                rememberMe: false,
            });

            if (error) {
                setErrorMessage(
                    "The email or password is incorrect.",
                );
                return;
            }

            router.replace("/recruiter/dashboard");
            router.refresh();
        } catch {
            setErrorMessage(
                "Sign-in is temporarily unavailable. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold text-slate-700">
                Email address
                <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    maxLength={150}
                    placeholder="recruiter@example.com"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-900 outline-none transition focus:border-[#0f5c9c] focus:ring-4 focus:ring-blue-100"
                />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
                Password
                <input
                    required
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    minLength={12}
                    maxLength={128}
                    placeholder="Enter your password"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-900 outline-none transition focus:border-[#0f5c9c] focus:ring-4 focus:ring-blue-100"
                />
            </label>

            {errorMessage && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                >
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#0b2d5c] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#123f77] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting
                    ? "Signing in..."
                    : "Sign in to recruiter portal"}
            </button>
        </form>
    );
}