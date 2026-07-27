export type Job = {
    id: number;
    slug: string;
    title: string;
    department: string;
    category: string;
    location: string;
    type: "Full-time" | "Part-time" | "Contract" | "Internship";
    workplace: "On-site" | "Hybrid" | "Remote";
    experience: string;
    education: string;
    vacancy: number;
    salary: string;
    postedAt: string;
    deadline: string;
    summary: string;
    responsibilities: string[];
    requirements: string[];
};

export const jobs: Job[] = [
    {
        id: 1,
        slug: "senior-software-engineer",
        title: "Senior Software Engineer",
        department: "Technology",
        category: "Software Development",
        location: "Dhaka, Bangladesh",
        type: "Full-time",
        workplace: "Hybrid",
        experience: "4–6 years",
        education: "BSc in Computer Science or a related field",
        vacancy: 2,
        salary: "Negotiable",
        postedAt: "July 25, 2026",
        deadline: "August 20, 2026",
        summary:
            "We are seeking an experienced software engineer to design and develop reliable web applications and business systems.",
        responsibilities: [
            "Develop and maintain scalable web applications.",
            "Collaborate with product, design and engineering teams.",
            "Review code and support junior developers.",
            "Improve system performance, security and reliability.",
            "Prepare technical documentation when required.",
        ],
        requirements: [
            "Strong knowledge of JavaScript, TypeScript and React.",
            "Experience with Node.js or another backend framework.",
            "Experience working with SQL databases.",
            "Understanding of REST APIs and Git workflows.",
            "Strong communication and problem-solving skills.",
        ],
    },
    {
        id: 2,
        slug: "recruitment-consultant",
        title: "Recruitment Consultant",
        department: "Recruitment",
        category: "Human Resources",
        location: "Dhaka, Bangladesh",
        type: "Full-time",
        workplace: "On-site",
        experience: "2–4 years",
        education: "Bachelor’s degree in any discipline",
        vacancy: 3,
        salary: "Negotiable",
        postedAt: "July 24, 2026",
        deadline: "August 18, 2026",
        summary:
            "The Recruitment Consultant will manage candidate sourcing, screening, shortlisting and client communication.",
        responsibilities: [
            "Source suitable candidates for active vacancies.",
            "Review CVs and conduct initial screening interviews.",
            "Maintain candidate and client records.",
            "Coordinate interviews between clients and candidates.",
            "Track recruitment progress and placement outcomes.",
        ],
        requirements: [
            "Previous recruitment or HR experience.",
            "Strong communication and interpersonal skills.",
            "Ability to manage several vacancies simultaneously.",
            "Good knowledge of Microsoft Office and online tools.",
            "Strong attention to detail.",
        ],
    },
    {
        id: 3,
        slug: "business-development-executive",
        title: "Business Development Executive",
        department: "Business Development",
        category: "Sales and Marketing",
        location: "Dhaka, Bangladesh",
        type: "Full-time",
        workplace: "On-site",
        experience: "1–3 years",
        education: "Bachelor’s degree in Business or Marketing",
        vacancy: 2,
        salary: "Negotiable",
        postedAt: "July 23, 2026",
        deadline: "August 15, 2026",
        summary:
            "This position will identify new clients and support the growth of YPL’s recruitment and HR consulting services.",
        responsibilities: [
            "Identify and approach prospective corporate clients.",
            "Prepare proposals and service presentations.",
            "Maintain client relationships and follow-up records.",
            "Work with recruitment teams to understand client needs.",
            "Support revenue and business growth targets.",
        ],
        requirements: [
            "Experience in business development or corporate sales.",
            "Excellent presentation and negotiation abilities.",
            "Strong written and spoken communication skills.",
            "Ability to work independently and meet targets.",
            "Knowledge of HR or recruitment services is preferred.",
        ],
    },
    {
        id: 4,
        slug: "human-resources-intern",
        title: "Human Resources Intern",
        department: "Human Resources",
        category: "Internship",
        location: "Dhaka, Bangladesh",
        type: "Internship",
        workplace: "On-site",
        experience: "Fresh graduate",
        education: "Current student or recent graduate",
        vacancy: 4,
        salary: "Monthly allowance",
        postedAt: "July 22, 2026",
        deadline: "August 12, 2026",
        summary:
            "The HR Intern will assist with candidate records, CV processing, recruitment coordination and administrative activities.",
        responsibilities: [
            "Assist with candidate information entry.",
            "Organize CVs and recruitment documents.",
            "Support interview scheduling and communication.",
            "Update recruitment tracking records.",
            "Assist the HR and recruitment team as needed.",
        ],
        requirements: [
            "Interest in human resources and recruitment.",
            "Basic Microsoft Office knowledge.",
            "Good communication and organization skills.",
            "Ability to maintain confidentiality.",
            "Willingness to learn and work in a team.",
        ],
    },
    {
        id: 5,
        slug: "accounts-officer",
        title: "Accounts Officer",
        department: "Finance and Accounts",
        category: "Accounting",
        location: "Dhaka, Bangladesh",
        type: "Full-time",
        workplace: "On-site",
        experience: "2–3 years",
        education: "BBA or MBA in Accounting or Finance",
        vacancy: 1,
        salary: "Negotiable",
        postedAt: "July 21, 2026",
        deadline: "August 10, 2026",
        summary:
            "The Accounts Officer will support invoicing, payment tracking, financial documentation and regular account reconciliation.",
        responsibilities: [
            "Prepare invoices and payment records.",
            "Maintain financial documents and transaction history.",
            "Support bank and account reconciliation.",
            "Track client payments and outstanding balances.",
            "Assist with financial and management reports.",
        ],
        requirements: [
            "Knowledge of basic accounting principles.",
            "Experience using spreadsheets or accounting software.",
            "Strong numerical and analytical skills.",
            "Attention to detail and document accuracy.",
            "Ability to maintain confidential records.",
        ],
    },
    {
        id: 6,
        slug: "data-entry-executive",
        title: "Data Entry Executive",
        department: "Operations",
        category: "Administration",
        location: "Dhaka, Bangladesh",
        type: "Full-time",
        workplace: "On-site",
        experience: "1–2 years",
        education: "Bachelor’s degree in any discipline",
        vacancy: 3,
        salary: "Negotiable",
        postedAt: "July 20, 2026",
        deadline: "August 8, 2026",
        summary:
            "The Data Entry Executive will maintain accurate candidate, client and job information in the recruitment system.",
        responsibilities: [
            "Enter and update candidate information.",
            "Upload and organize CV documents.",
            "Verify information before saving records.",
            "Identify duplicate or incomplete profiles.",
            "Support reporting and document management.",
        ],
        requirements: [
            "Fast and accurate typing skills.",
            "Good Microsoft Office knowledge.",
            "Strong attention to detail.",
            "Ability to work with confidential information.",
            "Previous data-entry experience is preferred.",
        ],
    },
];

export function getJobBySlug(slug: string) {
    return jobs.find((job) => job.slug === slug);
}