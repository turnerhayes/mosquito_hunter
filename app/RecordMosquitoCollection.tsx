"use client";

import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { addRecord } from "@/redux/slices/collection_records";
import { savePhoto } from "@/app/photos";
import { PhotoId } from "@/app/photos.d";


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

export const RecordMosquitoCollection = () => {
    const [collectionDate, setCollectionDate] = useState<Date|null>(new Date());
    const [numMosquitoes, setNumMosquitoes] = useState<number|null>(null);
    const [photoId, setPhotoId] = useState<PhotoId|null>(null);

    const dispatch = useAppDispatch();

    const handleSubmit = useCallback((event: FormEvent) => {
        event.preventDefault();
        if (!collectionDate || !numMosquitoes) {
            return false;
        }
        dispatch(addRecord({
            timestamp: collectionDate.getTime(),
            numMosquitoes,
            photoId: photoId ?? undefined,
        }));
    }, [
        dispatch,
        collectionDate,
        numMosquitoes,
        photoId,
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
            return;
        }

        const photoId = await savePhoto(file);
        setPhotoId(photoId);
    }, [
        setPhotoId,
    ]);

    return (
        <>
            <form
                method="POST"
                action="/record_mosquitoes"
                onSubmit={handleSubmit}
                className="flex flex-col items-start"
            >
                <p className="mb-4">
                    Enter information about your captured mosquitoes here.
                </p>
                <label className="flex m-2">
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
                <label className="flex m-2">
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
                <label className="flex m-2">
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

                <button
                    type="submit"
                    className="m-4 bg-lime-600 p-2 rounded"
                >
                    Record collection
                </button>
            </form>
        </>
    );
};
