"use client";

import { useCallback, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { getCollectionRecords } from "@/redux/selectors";
import { CollectionRecord } from "@/redux/slices/collection_records";
import { PopupIcon } from "@/app/PopupIcon";
import { PhotoDialog } from "@/app/PhotoDialog";
import { PhotoId } from "@/app/photos.d";


const formatter = new Intl.DateTimeFormat();

const CELL_CLASSES = "border border-white p-2";

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
            <div>
                <h3 className="text-xl">
                    No collections are recorded. Record a
                    collection <Link href="/collections/record">
                        here
                    </Link>.
                </h3>
            </div>
        );
    }

    return (
        <>
            <table className="border-collapse">
                <thead>
                    <tr>
                        <td className={`${CELL_CLASSES}`}>
                            Collection Date
                        </td>
                        <td className={`${CELL_CLASSES}`}>
                            Number of mosquitoes collected
                        </td>
                        <td className={`${CELL_CLASSES}`}>
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
                                <td className={`${CELL_CLASSES}`}>
                                    {formatter.format(collection.timestamp)}
                                </td>
                                <td className={`${CELL_CLASSES}`}>
                                    {collection.numMosquitoes}
                                </td>
                                <td className={`${CELL_CLASSES}`}>
                                    {
                                        collection.photoId ? (
                                            <PopupPhotoButton
                                                photoId={collection.photoId}
                                                onClick={handlePopupPhotoClick}
                                            />
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
        <>
            <header className="mb-3 flex justify-between items-center">
                <h1 className="text-3xl">
                    Mosquito collections
                </h1>
                <Link href="/collections/record">
                    Record collection
                </Link>
            </header>
            <CollectionsTable
                collections={collections}
            />
        </>
    );
};
