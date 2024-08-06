import { addTrap, getTrap, removeMosquitoTrap } from "@/app/server/db";


export const dynamic = 'force-dynamic';

export async function POST(
    _request: Request,
    {
        params: {
            locationOrId: location,
        },
    }: {
        params: {
            locationOrId: string;
        };
    }
) {
    if (!location) {
        return new Response("Empty location for trap", {
            status: 400,
        });
    }

    let locationPair: [number, number]|null = null;

    try {
        locationPair = JSON.parse(location) as [number, number];

        if (
            !Array.isArray(locationPair) ||
            locationPair.length !== 2 ||
            typeof locationPair[0] !== "number" ||
            typeof locationPair[1] !== "number"
        ) {
            return new Response(
                "Invalid location string. Must be of the form [float, float].",
                {
                    status: 400,
                }
            );
        }
    }
    catch (ex) {
        return new Response(
            "Invalid location string. Must be of the form [float, float].",
            {
                status: 400,
            }
        );
    }

    try {
        const id = await addTrap({
            location: locationPair,
        });

        return new Response("Trap added", {
            status: 201,
            headers: {
                "Location": `/api/traps/${id}`,
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

export async function DELETE(
    _response: Response,
    {
        params: {
            locationOrId: idString,
        }
    }: {
        params: {
            locationOrId: string;
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
            locationOrId: id,
        },
    }: {
        params: {
            locationOrId: string;
        };
    }
) {
    const idNum = Number(id);

    if (Number.isNaN(idNum)) {
        return new Response(
            `${id} is not a valid number`,
            {
                status: 400,
            }
        );
    }

    try {
        const trap = await getTrap({
            id: idNum,
        });

        return Response.json(trap);
    }
    catch (ex) {
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        });
    }
}
