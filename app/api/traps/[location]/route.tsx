import { addTrap } from "@/app/server/db";


export const dynamic = 'force-dynamic';

export async function POST(
    _request: Request,
    {
        params: {
            location,
        },
    }: {
        params: {
            location: string;
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