import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Executive Search",
    description:
      "Identify and connect qualified professionals with leadership and specialist positions.",
  },
  {
    number: "02",
    title: "Recruitment Process Outsourcing",
    description:
      "Manage candidate sourcing, screening, shortlisting and recruitment operations in one place.",
  },
  {
    number: "03",
    title: "Talent Acquisition",
    description:
      "Build structured candidate pipelines and match suitable talent with business requirements.",
  },
  {
    number: "04",
    title: "Candidate Management",
    description:
      "Collect, organize and track candidate profiles, CVs, skills, experience and applications.",
  },
];

const platformFeatures = [
  "Central candidate database",
  "Online CV collection",
  "Job and vacancy management",
  "Application pipeline tracking",
  "Interview scheduling",
  "Client and recruiter records",
];

const workflow = [
  {
    step: "01",
    title: "Receive requirement",
    description:
      "The recruitment team records the client’s vacancy and candidate requirements.",
  },
  {
    step: "02",
    title: "Source candidates",
    description:
      "CVs and candidate profiles are collected and stored in a structured database.",
  },
  {
    step: "03",
    title: "Review and shortlist",
    description:
      "Recruiters search, filter and shortlist suitable candidates for the vacancy.",
  },
  {
    step: "04",
    title: "Interview and place",
    description:
      "Interview progress, feedback, offers and final placement are tracked centrally.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b2d5c] text-sm font-bold text-white">
              YPL
            </span>

            <span>
              <span className="block text-base font-bold tracking-tight text-[#0b2d5c]">
                YPL Connect
              </span>
              <span className="hidden text-xs text-slate-500 sm:block">
                YES Private Limited
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link href="/jobs" className="transition hover:text-[#0b2d5c]">
              Jobs
            </Link>

            <a href="#services" className="transition hover:text-[#0b2d5c]">
              Services
            </a>

            <a href="#platform" className="transition hover:text-[#0b2d5c]">
              Platform
            </a>

            <a href="#workflow" className="transition hover:text-[#0b2d5c]">
              Workflow
            </a>

            <a href="#contact" className="transition hover:text-[#0b2d5c]">
              Contact
            </a>
          </nav>

          <a
            href="#platform"
            className="rounded-lg bg-[#0b2d5c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123f77]"
          >
            Explore platform
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#071f43]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(41,120,195,0.35),transparent_38%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-blue-100">
              RECRUITMENT • TALENT • TECHNOLOGY
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Connecting the right talent with the right opportunity.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
              YPL Connect brings candidate sourcing, CV management, job
              tracking and recruitment operations into one secure digital
              platform.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/jobs"
                className="rounded-xl bg-[#f5b400] px-6 py-3.5 text-center text-sm font-bold text-[#071f43] transition hover:bg-[#ffc72c]"
              >
                Explore current jobs
              </Link>

              <a
                href="#workflow"
                className="rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                  YPL Connect
                </p>
                <h2 className="mt-2 text-xl font-bold text-white">
                  One connected recruitment system
                </h2>
              </div>

              <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "CV intake",
                "Candidate database",
                "Job pipeline",
                "Client records",
                "Interview tracking",
                "Placement status",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4"
                >
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5b400] text-xs font-bold text-[#071f43]">
                    ✓
                  </div>
                  <p className="text-sm font-medium text-white">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl bg-[#061932] p-5">
              <p className="text-xs uppercase tracking-wider text-blue-300">
                Goal
              </p>
              <p className="mt-2 text-sm leading-6 text-blue-50">
                Replace scattered files, email threads and manual tracking with
                one organized workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f5c9c]">
              Our services
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0b2d5c] sm:text-4xl">
              Recruitment solutions built around people
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Supporting organizations throughout candidate sourcing,
              evaluation, selection and placement.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.number}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <span className="text-sm font-bold text-[#f0a900]">
                  {service.number}
                </span>

                <h3 className="mt-7 text-xl font-bold text-[#0b2d5c]">
                  {service.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="scroll-mt-24 bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f5c9c]">
              The platform
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0b2d5c] sm:text-4xl">
              Move from manual files to structured recruitment
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-slate-600">
              Instead of keeping candidate records across local folders,
              spreadsheets and message threads, YPL Connect provides a single
              system for managing each recruitment activity.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {platformFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-sm font-bold text-[#0b2d5c]">
                  ✓
                </span>

                <span className="text-sm font-semibold text-slate-800">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f5c9c]">
              Recruitment workflow
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0b2d5c] sm:text-4xl">
              From requirement to successful placement
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {workflow.map((item) => (
              <article
                key={item.step}
                className="relative rounded-2xl bg-[#0b2d5c] p-6 text-white"
              >
                <span className="text-4xl font-bold text-white/15">
                  {item.step}
                </span>

                <h3 className="mt-8 text-lg font-bold">{item.title}</h3>

                <p className="mt-4 text-sm leading-7 text-blue-100">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#f5b400] px-6 py-12 sm:px-12 lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0b2d5c]/70">
              Digital recruitment
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#071f43]">
              One platform for YPL’s recruitment operations
            </h2>

            <p className="mt-4 leading-7 text-[#071f43]/75">
              The next stages will add job publishing, CV submission, candidate
              records and the internal recruiter dashboard.
            </p>
          </div>

          <a
            href="#platform"
            className="mt-8 inline-flex rounded-xl bg-[#071f43] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#123f77] lg:mt-0"
          >
            View platform features
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>© 2026 YES Private Limited. All rights reserved.</p>
          <p>YPL Connect — Recruitment Management Platform</p>
        </div>
      </footer>
    </main>
  );
}