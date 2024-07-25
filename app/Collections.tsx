"use client";

import { useCallback, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { getCollectionRecords } from "@/redux/selectors";
import { CollectionRecord } from "@/redux/slices/collection_records";
import { PopupIcon } from "@/app/PopupIcon.svg";
import { PhotoDialog } from "@/app/PhotoDialog";
import { PhotoId } from "@/app/photos.d";


const formatter = new Intl.DateTimeFormat();

const CELL_CLASSES = "border border-white p-2";

const RecordCollectionLink = (
    {
        children,
    }: {
        children: string;
    }
) => {
    return (
        <Link
            href="/collections/record"
            className="underline text-blue-600"
        >
            {children}
        </Link>
    );
};

const PopupPhotoButton = (
    {
        photoId,
        onClick,
    }: {
        photoId: PhotoId;
        onClick: (photoId: PhotoId) => void;
    }
) => {
    const handleClick = useCallback(() => {
        onClick(photoId);
    }, [
        onClick,
        photoId,
    ]);

    return (
        <button
            onClick={handleClick}
        >
            <PopupIcon
                className="stroke-current w-4 h-4"
            />
        </button>
    );
};

const CollectionsTable = (
    {
        collections,
    }: {
        collections: CollectionRecord[];
    }
) => {
    const [selectedPhotoId, setSelectedPhotoId] = useState<PhotoId|null>(null);

    const handlePopupPhotoClick = useCallback((photoId: PhotoId) => {
        setSelectedPhotoId(photoId);
    }, [
        setSelectedPhotoId,
    ]);

    const handlePhotoDialogClose = useCallback(() => {
        setSelectedPhotoId(null);
    }, [
        setSelectedPhotoId,
    ]);

    if (collections.length === 0) {
        return (
            <h3 className="text-xl">
                No collections are recorded. Record a
                collection <RecordCollectionLink>
                    here
                </RecordCollectionLink>.
            </h3>
        );
    }

    return (
        <>
            <table className="border-collapse">
                <thead>
                    <tr>
                        <td className={CELL_CLASSES}>
                            Date
                        </td>
                        <td className={CELL_CLASSES}>
                            Count
                        </td>
                        <td className={CELL_CLASSES}>
                            Photo
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {
                        collections.map((collection, index) => (
                            <tr
                                key={index}
                            >
                                <td className={CELL_CLASSES}>
                                    {formatter.format(collection.timestamp)}
                                </td>
                                <td className={CELL_CLASSES}>
                                    {collection.numMosquitoes}
                                </td>
                                <td className={CELL_CLASSES}>
                                    {
                                        collection.photoId ? (
                                            <div className="w-full h-full flex justify-center">
                                                <PopupPhotoButton
                                                    photoId={collection.photoId}
                                                    onClick={handlePopupPhotoClick}
                                                />
                                            </div>
                                        ) : null
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <PhotoDialog
                photoId={selectedPhotoId ?? undefined}
                onClose={handlePhotoDialogClose}
                title="Collection Photo"
            />
        </>
    );
};

export const Collections = () => {
    const collections = useAppSelector(getCollectionRecords);

    return (
        <div className="flex flex-col w-4/5 h-full mx-auto">
            <header className="mb-3 flex justify-between items-center">
                <h1 className="mb-8 mt-6 text-3xl">
                    Mosquito collections
                </h1>
                <RecordCollectionLink>
                    Record collection
                </RecordCollectionLink>
            </header>
            <div className="flex-1 flex items-center justify-center">
                <CollectionsTable
                    collections={collections}
                />
            </div>
        </div>
    );
};
