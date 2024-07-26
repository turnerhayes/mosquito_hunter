"use client";

import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { PhotoId, PhotoWithDimensions } from "./photos.d";
import { getPhoto } from "./photos";
import { CloseIcon } from "./CloseIcon.svg";
import Image from "next/image";

export const PhotoDialog = (
    {
        photoId,
        title,
        onClose,
    }: {
        photoId?: PhotoId;
        title: string;
        onClose?: () => void;
    }
) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const [photo, setPhoto] = useState<PhotoWithDimensions|null>(null);
    const [photoUrl, setPhotoUrl] = useState<string|null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const close = useCallback((callCloseOnDialog = true) => {
        if (callCloseOnDialog) {
            dialogRef.current?.close();
        }
        if (photoUrl) {
            URL.revokeObjectURL(photoUrl);
        }
        setPhoto(null);
        setPhotoUrl(null);
        setIsOpen(false);
        onClose?.();
    }, [
        dialogRef,
        photoUrl,
        setIsOpen,
        onClose,
    ]);

    useEffect(() => {
        if (photoId) {
            if (!photoUrl) {
                getPhoto(photoId).then((photo) => {
                    if (photo) {
                        setPhoto(photo);
                        setPhotoUrl(URL.createObjectURL(photo.file));
                    }
                });
            }
            if (!isOpen) {
                dialogRef.current?.showModal();
                setIsOpen(true);
            }
        }
        else {
            if (isOpen) {
                close();
            }
        }
    }, [
        setPhotoUrl,
        setIsOpen,
        close,
        dialogRef,
        photoId,
        photoUrl,
        isOpen,
    ]);

    useEffect(() => {
        return () => {
            if (photoUrl) {
                URL.revokeObjectURL(photoUrl);
            }
        };
    });

    const handleCloseClick = useCallback(() => {
        close();
    }, [
        close,
    ]);

    const handleDialogClose = useCallback(() => {
        close(false);
    }, [
        close,
    ]);

    const handleDialogClick = useCallback((event: MouseEvent) => {
        if (!bodyRef.current?.contains(event.target as Element)) {
            close();
        }
    }, [
        bodyRef,
        close,
    ]);

    return (
        <dialog
            className="position-fixed"
            onClick={handleDialogClick}
            onClose={handleDialogClose}
            ref={dialogRef}
        >
            <div
                className="flex flex-col w-full h-full"
                ref={bodyRef}
            >
                <header className="flex justify-between items-center">
                    <h4 className="text-xl ml-2">
                        {title}
                    </h4>
                    <button
                        onClick={handleCloseClick}
                        className="p-2"
                    >
                        <CloseIcon
                            className="w-5 h-5"
                        />
                    </button>
                </header>
                <div
                    className="flex-1"
                >
                    {
                        photo && photoUrl ? (
                            <Image
                                src={photoUrl}
                                width={photo.dimensions.width}
                                height={photo.dimensions.height}
                                alt="Photo being displayed in the dialog"
                            />
                        ) : (
                            <div>
                                Loading...
                            </div>
                        )
                    }
                </div>
            </div>
        </dialog>
    );
};
