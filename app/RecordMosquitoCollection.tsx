"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { addRecord } from "@/redux/slices/collection_records";
import { savePhoto } from "@/app/photos";
import { PhotoId } from "@/app/photos.d";
import { useRouter } from "next/navigation";


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
        photoUrl,
    }: {
        photoUrl: string;
    }
) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapsed = useCallback(() => {
        setIsCollapsed(!isCollapsed);
    }, [
        isCollapsed,
        setIsCollapsed,
    ]);

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
            <img
                src={photoUrl}
                className={`${isCollapsed ? "hidden" : ""}`}
                alt="Uploaded photo of collection"
            />
        </div>
    );
};

export const RecordMosquitoCollection = () => {
    const [collectionDate, setCollectionDate] = useState<Date|null>(new Date());
    const [numMosquitoes, setNumMosquitoes] = useState<number|null>(null);
    const [photoId, setPhotoId] = useState<PhotoId|null>(null);
    const [photoUrl, setPhotoUrl] = useState<string|null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const dispatch = useAppDispatch();

    const isSubmitEnabled = useMemo(() => {
        return Boolean(collectionDate) &&
            Boolean(numMosquitoes) &&
            !isSubmitting;
    }, [
        collectionDate,
        numMosquitoes,
        isSubmitting,
    ]);

    const handleSubmit = useCallback((event: FormEvent) => {
        setIsSubmitting(true);
        event.preventDefault();
        if (!collectionDate || !numMosquitoes) {
            return false;
        }
        dispatch(addRecord({
            timestamp: collectionDate.getTime(),
            numMosquitoes,
            photoId: photoId ?? undefined,
        }));
        setIsSubmitting(false);
        router.push("/collections");
    }, [
        dispatch,
        setIsSubmitting,
        collectionDate,
        numMosquitoes,
        photoId,
        router,
    ]);

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
            if (photoUrl) {
                URL.revokeObjectURL(photoUrl);
                setPhotoUrl(null);
            }
            return;
        }

        const photoId = await savePhoto(file);
        setPhotoId(photoId);
        setPhotoUrl(URL.createObjectURL(file));
    }, [
        setPhotoId,
        setPhotoUrl,
        photoUrl,
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
                        photoUrl ? (
                            <PhotoDisplay
                                photoUrl={photoUrl}
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
