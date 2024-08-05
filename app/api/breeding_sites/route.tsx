import { getAllBreedingSites } from "@/app/server/db";


export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const sites = await getAllBreedingSites();

        return Response.json(sites);
    }
    catch (ex) {
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        });
    }
}
