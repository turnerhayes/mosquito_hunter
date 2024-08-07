import { addTrap, getAllTraps } from "@/app/server/db";


export const dynamic = 'force-dynamic';


export async function POST(request: Request) {
    const fd = await request.formData();

    const locationString = fd.get("location") as string|undefined;

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
        return new Response("Empty location for mosquito trap", {
            status: 400,
        });
    }

    try {
        const id = await addTrap({
            location,
        });

        return new Response("Trap added", {
            status: 201,
            headers: {
                "Location": `/api/traps/${id}`,
            },
        });
    }
    catch (ex) {
        console.error("POST trap error:", ex);
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        });
    }
}

export async function GET() {
    try {
        const traps = await getAllTraps();

        return Response.json(traps);
    }
    catch (ex) {
        console.error("GET all traps error:", ex);
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        });
    }
}
