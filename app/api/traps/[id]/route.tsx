import { getTrap, removeMosquitoTrap } from "@/app/server/db";


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
            `${idString} is not a valid mosquito trap ID; must be an integer`,
            {
                status: 400,
            }
        );
    }

    try {
        const removed = await removeMosquitoTrap(id);

        if (!removed) {
            return new Response(`No trap with id ${id} found`, {
                status: 404,
            });
        }
        return new Response(null, {
            status: 204,
        });
    }
    catch (ex) {
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
        const trap = await getTrap({
            id,
        });

        return Response.json(trap);
    }
    catch (ex) {
        console.error(`GET trap ${id} error:`, ex);
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        });
    }
}
