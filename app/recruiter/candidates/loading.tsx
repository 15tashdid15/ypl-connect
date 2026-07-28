export default function CandidatesLoading() {
    return (
        <main className="min-h-screen bg-slate-100">
            <div className="mx-auto max-w-7xl px-5 py-10">
                <div className="h-28 animate-pulse rounded-2xl bg-white" />

                <div className="mt-6 overflow-hidden rounded-2xl bg-white">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="grid gap-5 border-b border-slate-100 px-6 py-6 md:grid-cols-4"
                        >
                            <div className="h-16 animate-pulse rounded bg-slate-100" />
                            <div className="h-16 animate-pulse rounded bg-slate-100" />
                            <div className="h-16 animate-pulse rounded bg-slate-100" />
                            <div className="h-10 animate-pulse rounded bg-slate-100" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}