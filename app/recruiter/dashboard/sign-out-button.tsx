"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] =
        useState(false);

    async function handleSignOut() {
        setIsSigningOut(true);

        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.replace("/recruiter/sign-in");
                        router.refresh();
                    },
                },
            });
        } finally {
            setIsSigningOut(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {isSigningOut ? "Signing out..." : "Sign out"}
        </button>
    );
}