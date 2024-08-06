import { addBreedingSite, getBreedingSite, removeBreedingSite } from "@/app/server/db";


export const dynamic = 'force-dynamic';

export async function POST(
    request: Request,
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
        return new Response("Empty location for breeding site", {
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

    const photoType = request.headers.get("Content-Type");

    if (!photoType) {
        return new Response("Missing Content-Type header", {
            status: 400,
        });
    }

    try {
        const photo = await request.arrayBuffer();

        if (!photo || photo.byteLength === 0) {
            return new Response("No file uploaded", {
                status: 400,
            });
        }
    
        const id = await addBreedingSite({
            photo,
            photoType,
            location: locationPair,
        });

        return new Response("Breeding site added", {
            status: 201,
            headers: {
                "Location": `/api/breeding_sites/${id}`,
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
        const site = await getBreedingSite({
            id: idNum,
        });

        return Response.json(site);
    }
    catch (ex) {
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        });
    }
}
