import { auth } from "@/lib/auth";

export async function getRecruiterSession(
    request: Request,
) {
    return auth.api.getSession({
        headers: request.headers,
    });
}