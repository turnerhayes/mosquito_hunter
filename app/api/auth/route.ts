import { insertUser } from "@/app/server/db/authentication";

export async function POST(request: Request) {
    const fd = await request.formData();

    const username = fd.get("username") as string|undefined;
    const password = fd.get("password") as string|undefined;

    if (!username) {
        return new Response("Missing username", {
            status: 400,
        });
    }

    if (!password) {
        return new Response("Missing password", {
            status: 400,
        });
    }

    const userId = await insertUser({
        username,
        password,
    });

    return new Response(null, {
        status: 201,
        headers: {
            "Location": `/api/auth/${userId}`,
        },
    });
}
