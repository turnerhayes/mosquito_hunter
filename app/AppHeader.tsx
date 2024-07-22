import Image from "next/image";
import Link from "next/link";
import { HouseIcon } from "./HouseIcon";

export const AppHeader = () => {
    return (
        <header className="h-11 from-slate-700 bg-gradient-to-t pl-2">
            <nav className="h-full">
                <ul className="h-full flex items-center">
                    <li>
                        <Link href="/">
                            <HouseIcon
                                className="w-8"
                            />
                        </Link>
                    </li>
                    <div className="m-1">
                        |
                    </div>
                    <li>
                        <Link
                            href="/breeding-sites"
                        >
                            Breeding Sites
                        </Link>
                    </li>
                    <div className="m-1">
                        |
                    </div>
                    <li>
                        <Link
                            href="/traps"
                        >
                            Traps
                        </Link>
                    </li>
                    <div className="m-1">
                        |
                    </div>
                    <li>
                        <Link
                            href="/collections"
                        >
                            Collected Specimens
                        </Link>
                    </li>
                    <div className="m-1">
                        |
                    </div>
                    <li>
                        <Link
                            href="/traps/how-to"
                        >
                            Make a Trap
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};
