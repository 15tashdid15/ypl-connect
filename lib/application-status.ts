export const APPLICATION_STATUSES = [
    {
        value: "APPLIED",
        label: "Applied",
    },
    {
        value: "SHORTLISTED",
        label: "Shortlisted",
    },
    {
        value: "SUBMITTED",
        label: "Submitted to client",
    },
    {
        value: "INTERVIEW_SCHEDULED",
        label: "Interview scheduled",
    },
    {
        value: "INTERVIEW_COMPLETED",
        label: "Interview completed",
    },
    {
        value: "SELECTED",
        label: "Selected",
    },
    {
        value: "OFFER_SENT",
        label: "Offer sent",
    },
    {
        value: "JOINED",
        label: "Joined",
    },
    {
        value: "REJECTED",
        label: "Rejected",
    },
    {
        value: "ARCHIVED",
        label: "Archived",
    },
] as const;

export type ApplicationStatusValue =
    (typeof APPLICATION_STATUSES)[number]["value"];

const applicationStatusValues = new Set<string>(
    APPLICATION_STATUSES.map((status) => status.value),
);

export function isApplicationStatus(
    value: unknown,
): value is ApplicationStatusValue {
    return (
        typeof value === "string" &&
        applicationStatusValues.has(value)
    );
}

export function getApplicationStatusLabel(
    value: string,
) {
    return (
        APPLICATION_STATUSES.find(
            (status) => status.value === value,
        )?.label ?? value.replaceAll("_", " ")
    );
}