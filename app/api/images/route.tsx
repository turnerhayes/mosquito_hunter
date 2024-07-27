import { insertPhoto } from "@/app/server/db";

export const dynamic = 'force-dynamic';


export async function POST(request: Request) {
    const {
        file,
        filename,
        type,
    } = request.body?.values();

    try {
        const photo = await insertPhoto({
            file,
            filename,
            type,
        });

        return new Response("", {
            headers: {
                "Content-Type": type,
                "X-Filename": filename,
            }
        });
    }
    catch (ex) {
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        });
    }

}