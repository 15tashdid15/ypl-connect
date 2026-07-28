"use client";

import {
    FormEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
    useTransition,
} from "react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

type CandidateFiltersProps = {
    initialQuery: string;
};

export default function CandidateFilters({
    initialQuery,
}: CandidateFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchText, setSearchText] =
        useState(initialQuery);

    const [isPending, startTransition] =
        useTransition();

    const firstRender = useRef(true);

    const applySearch = useCallback(
        (value: string) => {
            const parameters = new URLSearchParams(
                searchParams.toString(),
            );

            const normalizedValue = value.trim();

            if (normalizedValue) {
                parameters.set("q", normalizedValue);
            } else {
                parameters.delete("q");
            }

            parameters.delete("page");

            const queryString = parameters.toString();

            startTransition(() => {
                router.replace(
                    queryString
                        ? `${pathname}?${queryString}`
                        : pathname,
                    {
                        scroll: false,
                    },
                );
            });
        },
        [pathname, router, searchParams],
    );

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        const timer = window.setTimeout(() => {
            applySearch(searchText);
        }, 450);

        return () => {
            window.clearTimeout(timer);
        };
    }, [applySearch, searchText]);

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();
        applySearch(searchText);
    }

    function handleReset() {
        setSearchText("");

        startTransition(() => {
            router.replace(pathname, {
                scroll: false,
            });
        });
    }

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 sm:flex-row sm:items-start"
            >
                <label className="flex-1 text-sm font-semibold text-slate-700">
                    Search candidates
                    <input
                        type="search"
                        value={searchText}
                        onChange={(event) =>
                            setSearchText(event.target.value)
                        }
                        placeholder="Name, email, phone, location or organization"
                        className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-4 font-normal outline-none transition focus:border-[#0f5c9c] focus:ring-4 focus:ring-blue-100"
                    />

                    <span className="mt-2 block text-xs font-normal text-slate-400">
                        Results update automatically. Press Enter
                        to search immediately.
                    </span>
                </label>

                <button
                    type="button"
                    onClick={handleReset}
                    disabled={isPending}
                    className="h-11 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 sm:mt-[29px]"
                >
                    Reset
                </button>
            </form>

            <div
                aria-live="polite"
                className="mt-3 min-h-5"
            >
                {isPending && (
                    <div className="flex items-center gap-2 text-sm font-medium text-[#0f5c9c]">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-[#0f5c9c]" />
                        Updating candidates…
                    </div>
                )}
            </div>
        </section>
    );
}