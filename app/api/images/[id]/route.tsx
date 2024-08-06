import { getPhoto } from "@/app/server/db";

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, {params}: {params: {id: string;}}) {
    const photoId = Number(params.id);

    const photo = await getPhoto(photoId);

    const buff = photo.buffer;

    return new Response(buff, {
        headers: {
            "Content-Type": photo.type,
        }
    });
}
