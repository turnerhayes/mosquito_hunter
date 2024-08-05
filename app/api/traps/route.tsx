import { getAllTraps } from "@/app/server/db";


export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const traps = await getAllTraps();

        return Response.json(traps);
    }
    catch (ex) {
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        });
    }
}
