"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Job } from "@/data/jobs";

type JobsListProps = {
    jobs: Job[];
};

export default function JobsList({ jobs }: JobsListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [department, setDepartment] = useState("All departments");
    const [jobType, setJobType] = useState("All types");

    const departments = [
        "All departments",
        ...Array.from(new Set(jobs.map((job) => job.department))),
    ];

    const jobTypes = [
        "All types",
        ...Array.from(new Set(jobs.map((job) => job.type))),
    ];

    const filteredJobs = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return jobs.filter((job) => {
            const matchesSearch =
                normalizedSearch.length === 0 ||
                job.title.toLowerCase().includes(normalizedSearch) ||
                job.department.toLowerCase().includes(normalizedSearch) ||
                job.category.toLowerCase().includes(normalizedSearch) ||
                job.location.toLowerCase().includes(normalizedSearch);

            const matchesDepartment =
                department === "All departments" ||
                job.department === department;

            const matchesType =
                jobType === "All types" || job.type === jobType;

            return matchesSearch && matchesDepartment && matchesType;
        });
    }, [department, jobType, jobs, searchTerm]);

    return (
        <div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
                    <label>
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                            Search jobs
                        </span>

                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Job title, category or location"
                            className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0f5c9c] focus:ring-4 focus:ring-blue-100"
                        />
                    </label>

                    <label>
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                            Department
                        </span>

                        <select
                            value={department}
                            onChange={(event) => setDepartment(event.target.value)}
                            className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-[#0f5c9c] focus:ring-4 focus:ring-blue-100"
                        >
                            {departments.map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                            Employment type
                        </span>

                        <select
                            value={jobType}
                            onChange={(event) => setJobType(event.target.value)}
                            className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-[#0f5c9c] focus:ring-4 focus:ring-blue-100"
                        >
                            {jobTypes.map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                    </label>

                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm("");
                            setDepartment("All departments");
                            setJobType("All types");
                        }}
                        className="mt-auto h-12 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                    >
                        Clear
                    </button>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                    Showing{" "}
                    <strong className="text-slate-950">{filteredJobs.length}</strong>{" "}
                    {filteredJobs.length === 1 ? "job" : "jobs"}
                </p>
            </div>

            <div className="mt-5 space-y-5">
                {filteredJobs.map((job) => (
                    <article
                        key={job.id}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-7"
                    >
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0f5c9c]">
                                        {job.department}
                                    </span>

                                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                        {job.type}
                                    </span>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                        {job.workplace}
                                    </span>
                                </div>

                                <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#0b2d5c]">
                                    <Link
                                        href={`/jobs/${job.slug}`}
                                        className="transition hover:text-[#0f5c9c]"
                                    >
                                        {job.title}
                                    </Link>
                                </h2>

                                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                                    {job.summary}
                                </p>

                                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                                    <span>{job.location}</span>
                                    <span>{job.experience}</span>
                                    <span>{job.vacancy} vacancies</span>
                                    <span>Deadline: {job.deadline}</span>
                                </div>
                            </div>

                            <Link
                                href={`/jobs/${job.slug}`}
                                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#0b2d5c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#123f77]"
                            >
                                View details
                            </Link>
                        </div>
                    </article>
                ))}

                {filteredJobs.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <h2 className="text-xl font-bold text-[#0b2d5c]">
                            No matching jobs found
                        </h2>

                        <p className="mt-3 text-sm text-slate-600">
                            Try changing your search term or filters.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}