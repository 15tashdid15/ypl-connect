export default function ApplicationsLoading() {
    return (
        <main className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-5">
                    <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-7 w-52 animate-pulse rounded bg-slate-200" />
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-5 py-10">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="grid gap-4 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item}>
                                <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                                <div className="mt-3 h-11 animate-pulse rounded-xl bg-slate-100" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-6">
                        <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
                    </div>

                    <div className="divide-y divide-slate-200">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div
                                key={item}
                                className="grid gap-5 px-6 py-5 md:grid-cols-4"
                            >
                                <div className="h-10 animate-pulse rounded bg-slate-100" />
                                <div className="h-10 animate-pulse rounded bg-slate-100" />
                                <div className="h-8 animate-pulse rounded bg-slate-100" />
                                <div className="h-8 animate-pulse rounded bg-slate-100" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}