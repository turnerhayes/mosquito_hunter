import Link from "next/link";
import { HouseIcon } from "./HouseIcon.svg";
import { Fragment, ReactElement } from "react";


type NavLink = {
    url: string;
} & (
    {
        text: string;
        icon?: never;
    } | {
        text?: never;
        icon: ReactElement;
    }
);

export const AppHeader = () => {
    const links: readonly NavLink[] = [
        {
            url: "/",
            icon: (
                <HouseIcon
                    className="w-8"
                />
            ),
        },
        {
            url: "/collections",
            text: "Collected Specimens",
        },
        {
            url: "/traps/how-to",
            text: "Make a Trap",
        },
        {
            url: "/about",
            text: "About",
        },
    ];

    return (
        <header className="h-11 from-slate-700 bg-gradient-to-t pl-2">
            <nav className="h-full">
                <ul className="h-full flex items-center">
                    {
                        links.map((link, index) => (
                            <Fragment key={link.url}>
                                <Link href={link.url}>
                                    {
                                        link.icon ? link.icon : link.text
                                    }
                                </Link>
                                {
                                    index < links.length - 1 ? (
                                        <div className="m-1">
                                            |
                                        </div>
                                    ) : null
                                }
                            </Fragment>
                        ))
                    }
                </ul>
            </nav>
        </header>
    );
};
