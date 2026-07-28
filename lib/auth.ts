import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  appName: "YPL Connect",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,

    /*
     * Recruiters cannot create accounts from the public website.
     * The first recruiter will be created through a controlled
     * server-side setup script later.
     */
    disableSignUp: true,

    minPasswordLength: 12,
    maxPasswordLength: 128,
  },

  session: {
    /*
     * Recruiter sessions expire after eight hours.
     */
    expiresIn: 60 * 60 * 8,

    /*
     * Refresh an active session at most once per hour.
     */
    updateAge: 60 * 60,
  },

  advanced: {
    cookiePrefix: "ypl-recruiter",
  },
});