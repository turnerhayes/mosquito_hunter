import { getUser } from "@/app/server/db/authentication";

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

    try {
        const user = await getUser({
            username,
            password,
        });

        return Response.json(user, {
            status: 200,
        });
    }
    catch (ex) {
        console.error(ex);
        return new Response(null, {
            status: 500,
        });
    }
}