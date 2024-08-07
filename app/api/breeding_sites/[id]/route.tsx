import { addBreedingSite, getBreedingSite, removeBreedingSite } from "@/app/server/db";


export const dynamic = 'force-dynamic';

export async function DELETE(
    _request: Request,
    {
        params: {
            id: idString,
        }
    }: {
        params: {
            id: string;
        };
    }
) {
    const id = Number(idString);

    if (Number.isNaN(id)) {
        return new Response(
            `${idString} is not a valid breeding site ID; must be an integer`,
            {
                status: 400,
            }
        );
    }

    try {
        const removed = await removeBreedingSite(id);

        if (!removed) {
            return new Response(`No breeding site with ID ${id} found`, {
                status: 404,
            });
        }

        return new Response(null, {
            status: 204,
        });
    }
    catch (ex) {
        console.error(`DELETE breeding site ${id} error:`, ex);
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message
        });
    }
}

export async function GET(
    _request: Request,
    {
        params: {
            id: idString,
        },
    }: {
        params: {
            id: string;
        };
    }
) {
    const id = Number(idString);

    if (Number.isNaN(id)) {
        return new Response(
            `${idString} is not a valid number`,
            {
                status: 400,
            }
        );
    }

    try {
        const site = await getBreedingSite({
            id,
        });

        return Response.json(site);
    }
    catch (ex) {
        console.error(`GET breeding site ${id} error:`, ex);
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        });
    }
}
