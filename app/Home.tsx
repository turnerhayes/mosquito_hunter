"use client";

import { useAppSelector } from "@/redux/hooks";
import { getSetting } from "@/redux/selectors";
import { SettingName } from "@/redux/slices/settings_slice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const Home = () => {
    const router = useRouter();
    const showEducation = useAppSelector(
        (state) => getSetting(state, SettingName.SHOW_EDUCATION)
    );

    useEffect(() => {
        if (showEducation) {
            router.push("/about");
        }
    }, [
        router,
    ]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <ul>
                <li>
                    <Link href="/breeding-sites">
                        <button>
                            <Image
                                src="/standing_water.jpg"
                                alt="Image depicting a source of standing water"
                                width={300}
                                height={200}
                            />
                            Log standing water locations
                        </button>
                    </Link>
                </li>
                <li>
                    <Link href="/traps">
                        <button>
                            <Image
                                src="/mosquito_trap_photo.webp"
                                alt="Image depicting a homemade mosquito trap"
                                width={300}
                                height={200}
                            />
                            Log mosquito traps placed
                        </button>
                    </Link>
                </li>
            </ul>
        </main>
    );
};
