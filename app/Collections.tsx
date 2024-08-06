"use client";

import { useCallback, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { PopupIcon } from "@/app/PopupIcon.svg";
import { PhotoDialog } from "@/app/PhotoDialog";
import { PhotoId } from "@/app/photos.d";
import { Collection } from ".";
import { useGetAllCollectionsQuery } from "./api/client/collections";


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
        collection,
        onClick,
    }: {
        collection: Collection;
        onClick: (collection: Collection) => void;
    }
) => {
    const handleClick = useCallback(() => {
        onClick(collection);
    }, [
        onClick,
        collection,
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
        collections: Collection[];
    }
) => {
    const [selectedPhotoId, setSelectedPhotoId] = useState<PhotoId|null>(null);
    const [
        selectedCollection,
        setSelectedCollection
    ] = useState<Collection|null>(null);

    const handlePopupPhotoClick = useCallback((collection: Collection) => {
        setSelectedCollection(collection);
    }, [
        setSelectedCollection,
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
                                    {collection.mosquito_count}
                                </td>
                                <td className={CELL_CLASSES}>
                                    {
                                        collection.photo_id ? (
                                            <div className="w-full h-full flex justify-center">
                                                <PopupPhotoButton
                                                    collection={collection}
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
                photoId={selectedCollection?.photo_id}
                photoWidth={selectedCollection?.photo_width}
                photoHeight={selectedCollection?.photo_height}
                onClose={handlePhotoDialogClose}
                title="Collection Photo"
            />
        </>
    );
};

export const Collections = () => {
    const {data: collections} = useGetAllCollectionsQuery();

    console.log("collections:", collections);

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
                    collections={collections ?? []}
                />
            </div>
        </div>
    );
};
