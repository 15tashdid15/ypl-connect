export async function GET() {
    return Response.json({
        application: "YPL Connect",
        company: "YES Private Limited",
        service: "web-and-api",
        status: "ok",
        timestamp: new Date().toISOString(),
    });
}