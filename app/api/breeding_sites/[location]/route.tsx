import { addBreedingSite } from "@/app/server/db";


export const dynamic = 'force-dynamic';

export async function POST(
    request: Request,
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