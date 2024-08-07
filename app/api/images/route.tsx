import { insertPhoto } from "@/app/server/db";


export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const type = request.headers.get("Content-Type");

    if (!type) {
        return new Response("Missing Content-Type header", {
            status: 400,
        });
    }

    try {
        const file = await request.arrayBuffer();

        if (!file || file.byteLength === 0) {
            return new Response("No file uploaded", {
                status: 400,
            });
        }
    
        const id = await insertPhoto({
            file,
            type,
        });

        return new Response("Image uploaded", {
            status: 201,
            headers: {
                "Location": `/api/images/${id}`,
            },
        });
    }
    catch (ex) {
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        });
    }

}