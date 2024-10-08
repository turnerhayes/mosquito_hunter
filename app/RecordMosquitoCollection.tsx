"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getImageDimensions } from "@/app/photos";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAddCollectionMutation } from "./api/client/collections";
import { PhotoDimensions } from "@/app";


interface PhotoWithDimensions {
    file: File;
    dimensions: PhotoDimensions;
}

const padToTwoDigits = (num: number) => {
    if (num < 10) {
        return "0" + num;
    }

    return "" + num;
};

const getDateString = (date: Date) => {
    return `${
        date.getFullYear()
    }-${
        padToTwoDigits(date.getMonth() + 1)
    }-${
        padToTwoDigits(date.getDate())
    }`;
};

const PhotoDisplay = (
    {
        photo,
    }: {
        photo: PhotoWithDimensions;
    }
) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string|null>(null);
    const prevPhotoRef = useRef<PhotoWithDimensions>();

    const toggleCollapsed = useCallback(() => {
        setIsCollapsed(!isCollapsed);
    }, [
        isCollapsed,
        setIsCollapsed,
    ]);

    useEffect(() => {
        if (photoUrl && prevPhotoRef.current?.file !== photo.file) {
            URL.revokeObjectURL(photoUrl);
        }
        if (photo.file && prevPhotoRef.current?.file !== photo.file) {
            setPhotoUrl(URL.createObjectURL(photo.file));
        }
    }, [
        photo,
        prevPhotoRef,
        photoUrl,
        setPhotoUrl,
    ]);

    useEffect(() => {
        if (prevPhotoRef.current?.file !== photo.file) {
            prevPhotoRef.current = photo;
        }
    }, [
        photo,
        prevPhotoRef,
    ]);

    useEffect(() => {
        return () => {
            if (photoUrl) {
                URL.revokeObjectURL(photoUrl);
            }
        };
    });

    return (
        <div className="px-3">
            <header>
                <button
                    type="button"
                    onClick={toggleCollapsed}
                >
                    {
                        isCollapsed ?
                            "Show image" :
                            "Hide Image"
                    }
                </button>
            </header>
            {
                photo && photoUrl ? (
                    <Image
                        src={photoUrl}
                        className={`${isCollapsed ? "hidden" : ""}`}
                        alt="Uploaded photo of collection"
                        width={photo.dimensions.width}
                        height={photo.dimensions.height}
                    />
                ) : null
            }
        </div>
    );
};

export const RecordMosquitoCollection = () => {
    const [collectionDate, setCollectionDate] = useState<Date|null>(new Date());
    const [numMosquitoes, setNumMosquitoes] = useState<number|null>(null);
    const [photo, setPhoto] = useState<PhotoWithDimensions|null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const isSubmitEnabled = useMemo(() => {
        return Boolean(collectionDate) &&
            Boolean(numMosquitoes) &&
            !isSubmitting;
    }, [
        collectionDate,
        numMosquitoes,
        isSubmitting,
    ]);

    const [addRecord] = useAddCollectionMutation();

    const handleSubmit = useCallback(
        async (event: FormEvent) => {
            setIsSubmitting(true);
            event.preventDefault();
            if (!collectionDate || !numMosquitoes) {
                return false;
            }
            await addRecord({
                timestamp: collectionDate.getTime(),
                mosquito_count: numMosquitoes,
                photo: photo?.file ?? undefined,
            });
            setIsSubmitting(false);
            router.push("/collections");
        }, [
            addRecord,
            setIsSubmitting,
            collectionDate,
            numMosquitoes,
            photo,
            router,
        ]
    );

    const handleCollectionDateChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setCollectionDate(event.target.valueAsDate);
    }, [
        setCollectionDate,
    ]);

    const handleNumMosquitoesChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setNumMosquitoes(event.target.valueAsNumber);
    }, [
        setNumMosquitoes,
    ]);

    const handlePhotoChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            if (photo) {
                setPhoto(null);
            }
            return;
        }

        const dimensions = await getImageDimensions(file);
        setPhoto({
            file,
            dimensions,
        });
    }, [
        setPhoto,
        photo,
    ]);

    return (
        <>
            <form
                method="POST"
                action="/record_mosquitoes"
                onSubmit={handleSubmit}
                className="flex flex-col items-center h-full w-full"
            >
                <p className="mb-8 mt-6 text-xl">
                    Enter information about your captured mosquitoes here.
                </p>
                <div className="flex-1 flex flex-col items-start justify-center w-4/5">
                    <label className="flex flex-col items-start m-4">
                        <div className="mr-3">
                            Date:
                        </div>
                        <input
                            type="date"
                            name="collection_date"
                            className="text-neutral-950"
                            value={collectionDate ? getDateString(collectionDate) : ""}
                            onChange={handleCollectionDateChange}
                            required
                        />
                    </label>
                    <label className="flex flex-col items-start m-4">
                        <div className="mr-3">
                            Number of mosquitoes:
                        </div>
                        <input
                            type="number"
                            name="num_mosquitoes"
                            className="text-neutral-950 w-14"
                            value={numMosquitoes ?? ""}
                            onChange={handleNumMosquitoesChange}
                            min="1"
                            step="1"
                            required
                        />
                    </label>
                    <label className="flex flex-col items-start m-4">
                        <div className="mr-3">
                            Photo of collection (optional):
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            name="photo"
                            onChange={handlePhotoChange}
                        />
                    </label>
                    {
                        photo ? (
                            <PhotoDisplay
                                photo={photo}
                            />
                        ) : null
                    }

                    <button
                        type="submit"
                        disabled={!isSubmitEnabled}
                        className="m-4 bg-lime-600 p-2 rounded self-center disabled:bg-slate-400"
                    >
                        Record collection
                    </button>
                </div>
            </form>
        </>
    );
};
