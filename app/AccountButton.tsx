import { useCallback, useMemo } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Session } from "@/app";
import { UserIcon } from "./UserIcon.svg";
import { LogInIcon } from "./LogInIcon.svg";

export const AccountButton = (
    {
        className,
    }: {
        className?: string;
    }
) => {
    const {
        data,
        status,
    } = useSession();

    const session = data as Session|undefined;

    const handleLoginClick = useCallback(() => {
        signIn();
    }, []);

    const handleLogoutClick = useCallback(() => {
        signOut();
    }, []);

    const handleClick = useCallback(() => {
        if (status === "unauthenticated") {
            signIn();
        }
        else if (status === "authenticated") {
            signOut();
        }
    }, [
        status,
    ]);

    const title = useMemo(
        () => status === "authenticated" ?
            "Log out" :
            "Log in",
        [
            status,
        ]
    );

    const name = useMemo(
        () => session?.user?.name ?? session?.user?.username,
        [
            session,
        ]
    );

    return (
        <button
            className={`text-black ${className}`}
            type="button"
            onClick={handleClick}
            title={title}
        >
            {
                status === "unauthenticated" ? (
                    <LogInIcon
                        className="w-5 h-5"
                    />
                ) : (
                    <div
                        className="text-xs flex"
                    >
                        <span>
                            {name}
                        </span>
                        <UserIcon
                            className="w-5 h-5 ml-1"
                        />
                    </div>
                )
            }
        </button>
    );
};