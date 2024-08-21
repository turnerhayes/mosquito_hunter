import { usernameExists } from "@/app/server/db/authentication";

export async function GET(
    req: Request,
    {
        params: {
            username,
        },
    }: {
        params: {
            username: string;
        };
    }
) {
    try {
        const exists = await usernameExists(username);

        if (!exists) {
            return new Response(null, {
                status: 404,
            });
        }

        return new Response(null, {
            status: 200,
        });
    }
    catch (ex) {
        console.error(ex);
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        });
    }
}
