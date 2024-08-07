import { getCollection, removeCollection } from "@/app/server/db";


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
            `${idString} is not a valid collection ID; must be an integer`,
            {
                status: 400,
            }
        );
    }

    try {
        const removed = await removeCollection(id);

        if (!removed) {
            return new Response(`No collection with ID ${id} found`, {
                status: 404,
            });
        }

        return new Response(null, {
            status: 204,
        });
    }
    catch (ex) {
        console.error(`DELETE collection ${id} error:`, ex);
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
            `${id} is not a valid number`,
            {
                status: 400,
            }
        );
    }
    
    try {
        const collection = await getCollection(id);
        
        if (!collection) {
            return new Response(`No collection with ID ${id} found`, {
                status: 404,
            });
        }
        
        return Response.json(collection);
    }
    catch (ex) {
        console.error(`GET collection ${id} error:`, ex);
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        });
    }
}
