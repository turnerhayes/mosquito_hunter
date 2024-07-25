"use client";

import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { PhotoId } from "./photos.d";
import { getPhoto } from "./photos";

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
    const [photoUrl, setPhotoUrl] = useState<string|null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const close = useCallback((callCloseOnDialog = true) => {
        if (callCloseOnDialog) {
            dialogRef.current?.close();
        }
        if (photoUrl) {
            URL.revokeObjectURL(photoUrl);
        }
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
                        setPhotoUrl(URL.createObjectURL(photo));
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
    }, []);

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
                        X
                    </button>
                </header>
                <div
                    className="flex-1"
                >
                    {
                        photoUrl ? (
                            <img
                                src={photoUrl}
                                alt="Photo being displayed in the dialog"
                            >
                            </img>
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
