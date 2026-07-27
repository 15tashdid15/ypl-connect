import "dotenv/config";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "../lib/prisma";

function getRequiredVariable(name: string) {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`${name} is required.`);
    }

    return value;
}

async function main() {
    const name = getRequiredVariable(
        "BOOTSTRAP_RECRUITER_NAME",
    );

    const email = getRequiredVariable(
        "BOOTSTRAP_RECRUITER_EMAIL",
    ).toLowerCase();

    const password = getRequiredVariable(
        "BOOTSTRAP_RECRUITER_PASSWORD",
    );

    if (name.length < 2 || name.length > 100) {
        throw new Error(
            "Recruiter name must contain between 2 and 100 characters.",
        );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        throw new Error("Enter a valid recruiter email.");
    }

    if (password.length < 12 || password.length > 128) {
        throw new Error(
            "Recruiter password must contain between 12 and 128 characters.",
        );
    }

    const existingUserCount = await prisma.user.count();

    if (existingUserCount > 0) {
        throw new Error(
            "Bootstrap stopped because a recruiter account already exists.",
        );
    }

    const bootstrapAuth = betterAuth({
        appName: "YPL Connect Bootstrap",

        baseURL: getRequiredVariable("BETTER_AUTH_URL"),
        secret: getRequiredVariable("BETTER_AUTH_SECRET"),

        database: prismaAdapter(prisma, {
            provider: "postgresql",
        }),

        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            autoSignIn: false,
            minPasswordLength: 12,
            maxPasswordLength: 128,
        },
    });

    await bootstrapAuth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        },
    });

    console.log(
        `First recruiter account created successfully for ${email}.`,
    );
}

main()
    .catch((error) => {
        console.error(
            error instanceof Error
                ? error.message
                : "The recruiter account could not be created.",
        );

        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });