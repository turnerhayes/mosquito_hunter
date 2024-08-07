"use client";

import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { PhotoId } from "@/app";
import { CloseIcon } from "./CloseIcon.svg";
import Image from "next/image";

export const PhotoDialog = (
    {
        photoId,
        photoWidth,
        photoHeight,
        title,
        onClose,
    }: {
        photoId?: PhotoId;
        photoWidth?: number;
        photoHeight?: number;
        title: string;
        onClose?: () => void;
    }
) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const close = useCallback((callCloseOnDialog = true) => {
        if (callCloseOnDialog) {
            dialogRef.current?.close();
        }
        setIsOpen(false);
        onClose?.();
    }, [
        dialogRef,
        setIsOpen,
        onClose,
    ]);

    useEffect(() => {
        if (photoId) {
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
        setIsOpen,
        close,
        dialogRef,
        photoId,
        isOpen,
    ]);

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
                        photoId ? (
                            <Image
                                src={`/api/images/${photoId}`}
                                width={photoWidth}
                                height={photoHeight}
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
