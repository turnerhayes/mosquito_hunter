import { addBreedingSite, getAllBreedingSites } from "@/app/server/db";


export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const sites = await getAllBreedingSites();

        return Response.json(sites);
    }
    catch (ex) {
        console.error("GET all breeding sites error:", ex);
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        });
    }
}

export async function POST(request: Request) {
    const fd = await request.formData();

    const locationString = fd.get("location") as string|undefined;
    const photo = fd.get("photo") as File|undefined;

    if (!photo) {
        return new Response("Missing photo", {
            status: 400,
        });
    }

    if (!(photo instanceof File)) {
        return new Response("Photo is not a file", {
            status: 400,
        });
    }

    if (!locationString) {
        return new Response("Location is missing", {
            status: 400,
        });
    }

    let location: [number, number]|undefined;
    try {
        location = JSON.parse(locationString);
        if (
            !Array.isArray(location) ||
            location.length !== 2 ||
            typeof location[0] !== "number" ||
            typeof location[1] !== "number"
        ) {
            throw new Error("Invalid location");
        }
    }
    catch (ex) {
        return new Response(
            `Location string ${
                locationString
            } is invalid; needs to be of the form [number, number]`,
            {
                status: 400,
            }
        );
    }

    if (!location) {
        return new Response("Empty location for breeding site", {
            status: 400,
        });
    }

    try {
        const id = await addBreedingSite({
            photo,
            location,
        });

        return new Response("Breeding site added", {
            status: 201,
            headers: {
                "Location": `/api/breeding_sites/${id}`,
            },
        });
    }
    catch (ex) {
        console.error("POST breeding site error:", ex);
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        });
    }
}
