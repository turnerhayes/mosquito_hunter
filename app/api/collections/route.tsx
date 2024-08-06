import { addCollection, CollectionAddArgs, getAllCollections } from "@/app/server/db";


export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const collections = await getAllCollections();

        return Response.json(collections);
    }
    catch (ex) {
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        });
    }
}

export async function POST(request: Request) {
    const fd = await request.formData();

    const mosquitoCount = Number(fd.get("mosquito_count") as string);
    const timestamp = Number(fd.get("timestamp") as string);
    const trapIdString = fd.get("trap_id") as string|undefined;
    const trapId = trapIdString ? Number(trapIdString) : undefined;
    const photo = fd.get("photo") as File|undefined;

    let photoBuffer: ArrayBuffer|undefined;
    let photoType: string|undefined;

    let args: CollectionAddArgs = {
        timestamp,
        mosquitoCount,
        trapId,
    }

    if (photo) {
        const photoBuffer = await photo.arrayBuffer();
        args = {
            ...args,
            photoType: photo.type,
            photoBuffer,
        }
    }

    if (photoBuffer && !photoType) {
        return new Response("Photo file submitted without a MIME type", {
            status: 400,
        });
    }

    try {
        const id = await addCollection(args);
        return new Response(null, {
            status: 201,
            headers: {
                location: `/api/collections/${id}`,
            },
        });
    }
    catch (ex) {
        return new Response(null, {
            status: 500,
            statusText: (ex as Error).message,
        })
    }
}
