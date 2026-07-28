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

import { APPLICATION_STATUSES } from "@/lib/application-status";

type JobOption = {
    jobSlug: string;
    jobTitle: string;
};

type ApplicationFiltersProps = {
    initialQuery: string;
    initialStatus: string;
    initialJobSlug: string;
    jobOptions: JobOption[];
};

type FilterUpdates = {
    q?: string;
    status?: string;
    job?: string;
};

export default function ApplicationFilters({
    initialQuery,
    initialStatus,
    initialJobSlug,
    jobOptions,
}: ApplicationFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchText, setSearchText] =
        useState(initialQuery);

    const [isPending, startTransition] =
        useTransition();

    const firstSearchRender = useRef(true);

    const updateFilters = useCallback(
        (updates: FilterUpdates) => {
            const parameters = new URLSearchParams(
                searchParams.toString(),
            );

            for (const [name, value] of Object.entries(
                updates,
            )) {
                const normalizedValue = value?.trim() ?? "";

                if (normalizedValue) {
                    parameters.set(name, normalizedValue);
                } else {
                    parameters.delete(name);
                }
            }

            /*
             * Return to page 1 whenever the filters change.
             */
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
        [
            pathname,
            router,
            searchParams,
        ],
    );

    /*
     * Automatically search 450 ms after typing stops.
     */
    useEffect(() => {
        if (firstSearchRender.current) {
            firstSearchRender.current = false;
            return;
        }

        const timer = window.setTimeout(() => {
            updateFilters({
                q: searchText,
            });
        }, 450);

        return () => {
            window.clearTimeout(timer);
        };
    }, [searchText, updateFilters]);

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        updateFilters({
            q: searchText,
        });
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
                className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr_0.9fr_auto]"
            >
                <label className="text-sm font-semibold text-slate-700">
                    Search
                    <input
                        type="search"
                        name="q"
                        value={searchText}
                        onChange={(event) =>
                            setSearchText(event.target.value)
                        }
                        placeholder="Name, email, phone, job or reference"
                        className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-4 font-normal outline-none transition focus:border-[#0f5c9c] focus:ring-4 focus:ring-blue-100"
                    />

                    <span className="mt-2 block text-xs font-normal text-slate-400">
                        Results update automatically. Press Enter to
                        search immediately.
                    </span>
                </label>

                <label className="text-sm font-semibold text-slate-700">
                    Status
                    <select
                        defaultValue={initialStatus}
                        onChange={(event) =>
                            updateFilters({
                                q: searchText,
                                status: event.target.value,
                            })
                        }
                        className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal outline-none focus:border-[#0f5c9c] focus:ring-4 focus:ring-blue-100"
                    >
                        <option value="">All statuses</option>

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

                <label className="text-sm font-semibold text-slate-700">
                    Position
                    <select
                        defaultValue={initialJobSlug}
                        onChange={(event) =>
                            updateFilters({
                                q: searchText,
                                job: event.target.value,
                            })
                        }
                        className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal outline-none focus:border-[#0f5c9c] focus:ring-4 focus:ring-blue-100"
                    >
                        <option value="">All positions</option>

                        {jobOptions.map((job) => (
                            <option
                                key={job.jobSlug}
                                value={job.jobSlug}
                            >
                                {job.jobTitle}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="flex items-start gap-3 lg:pt-[29px]">
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={isPending}
                        className="flex h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Reset
                    </button>
                </div>
            </form>

            <div
                aria-live="polite"
                className="mt-4 min-h-5"
            >
                {isPending && (
                    <div className="flex items-center gap-2 text-sm font-medium text-[#0f5c9c]">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-[#0f5c9c]" />

                        Updating results…
                    </div>
                )}
            </div>
        </section>
    );
}