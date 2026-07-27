const MAX_CV_SIZE = 5 * 1024 * 1024;

const allowedCvTypes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const allowedCvExtensions = [".pdf", ".doc", ".docx"];

function getText(formData: FormData, key: string) {
    const value = formData.get(key);

    return typeof value === "string" ? value.trim() : "";
}

function hasAllowedExtension(filename: string) {
    const normalizedFilename = filename.toLowerCase();

    return allowedCvExtensions.some((extension) =>
        normalizedFilename.endsWith(extension),
    );
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const honeypot = getText(formData, "website");

        if (honeypot) {
            return Response.json({
                message: "Application received.",
            });
        }

        const jobSlug = getText(formData, "jobSlug");
        const jobTitle = getText(formData, "jobTitle");
        const fullName = getText(formData, "fullName");
        const email = getText(formData, "email");
        const phone = getText(formData, "phone");
        const location = getText(formData, "location");
        const currentCompany = getText(formData, "currentCompany");
        const experience = getText(formData, "experience");
        const portfolioUrl = getText(formData, "portfolioUrl");
        const coverLetter = getText(formData, "coverLetter");
        const consent = getText(formData, "consent");

        const cvValue = formData.get("cv");
        const cv = cvValue instanceof File ? cvValue : null;

        const errors: string[] = [];

        if (!jobSlug || !jobTitle) {
            errors.push("The selected job is missing.");
        }

        if (fullName.length < 2 || fullName.length > 100) {
            errors.push("Enter a valid full name.");
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            errors.push("Enter a valid email address.");
        }

        if (phone.length < 7 || phone.length > 30) {
            errors.push("Enter a valid phone number.");
        }

        if (location.length < 2 || location.length > 100) {
            errors.push("Enter a valid current location.");
        }

        if (!experience) {
            errors.push("Select your experience.");
        }

        if (
            portfolioUrl &&
            !portfolioUrl.startsWith("https://") &&
            !portfolioUrl.startsWith("http://")
        ) {
            errors.push("Enter a valid portfolio or LinkedIn URL.");
        }

        if (coverLetter.length > 3000) {
            errors.push("The cover letter cannot exceed 3,000 characters.");
        }

        if (consent !== "on" && consent !== "true") {
            errors.push("You must provide consent before applying.");
        }

        if (!cv || cv.size === 0) {
            errors.push("Please upload your CV.");
        } else {
            if (cv.size > MAX_CV_SIZE) {
                errors.push("The CV must not exceed 5 MB.");
            }

            const allowedType =
                allowedCvTypes.has(cv.type) ||
                hasAllowedExtension(cv.name);

            if (!allowedType) {
                errors.push("The CV must be a PDF, DOC or DOCX file.");
            }
        }

        if (errors.length > 0) {
            return Response.json(
                {
                    message: "Please correct the application form.",
                    errors,
                },
                {
                    status: 400,
                },
            );
        }

        const referenceCode = crypto
            .randomUUID()
            .split("-")[0]
            .toUpperCase();

        const applicationId = `YPL-${new Date().getFullYear()}-${referenceCode}`;

        /*
          PostgreSQL insertion and private CV storage will be added
          in the next development stage.
    
          Do not log candidate personal information or CV contents here.
        */

        return Response.json(
            {
                message:
                    "Your application passed validation and was received successfully.",
                applicationId,
                application: {
                    jobSlug,
                    jobTitle,
                    fullName,
                    email,
                    phone,
                    location,
                    currentCompany: currentCompany || null,
                    experience,
                    portfolioUrl: portfolioUrl || null,
                    hasCoverLetter: coverLetter.length > 0,
                    cvFilename: cv?.name,
                    cvSize: cv?.size,
                },
            },
            {
                status: 201,
            },
        );
    } catch {
        return Response.json(
            {
                message:
                    "The server could not process the application. Please try again.",
            },
            {
                status: 500,
            },
        );
    }
}
