"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getSetting } from "@/redux/selectors";
import { SettingName, updateSettings } from "@/redux/slices/settings_slice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { BASE_PATH } from "./path";

export const About = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const showEducation = useAppSelector((state) => getSetting(state, SettingName.SHOW_EDUCATION));

    const handleButtonClick = useCallback(() => {
        dispatch(updateSettings({
            [SettingName.SHOW_EDUCATION]: false,
        }));
        router.push("/");
    }, [
        dispatch,
        router,
    ]);

    return (
        <div className="flex justify-center">
            <div className="w-4/5">
                <header className="flex justify-center py-4">
                    <h1 className="text-2xl">
                        Climate Change and Malaria
                    </h1>
                </header>
                <div>
                    <p>
                        Malaria is caused by the <em>Plasmodium</em> parasite that
                        infects humans and other animals when they are bitten by an 
                        infected mosquito. 
                    </p>
                    <figure className="p-1 m-2 float-right border rounded">
                        <Image
                            src={`${BASE_PATH}/plasmodium.jpg`}
                            alt="Imaage of a Plasmodium parasite"
                            width={160}
                            height={160}
                        />
                        <figcaption className="text-xs w-full">
                            <em>Plasmodium</em> parasite
                        </figcaption>
                    </figure>
                    <p className="mt-4">
                        Both <em>Plasmodium</em> and their hosts, mosquitoes,
                        survive best when the temperature is around 25℃. They
                        need lay their eggs in still water, so places with 
                        plenty of still, undisturbed water are their ideal
                        homes. This can be natural bodies of water, such as
                        lakes and ponds, as well as water that has built up in
                        wells, buckets, tires, discarded trash, etc.
                    </p>
                    <figure className="p-1 m-2 clear-right float-left border rounded">
                        <Image
                            src={`${BASE_PATH}/mosquito_larvae.png`}
                            alt="Photo of mosquito larvae"
                            width={160}
                            height={97}
                        />
                        <figcaption className="text-xs w-40">
                            Mosquito larvae under the surface of water
                        </figcaption>
                    </figure>
                    <p className="mt-4">
                        Climate change has made the environment more suitable
                        for <em>
                            Plasmodium
                        </em> in sub-Saharan Africa in a few main ways:
                    </p>
                    <ul className="list-disc list-inside clear-left">
                        <li className="py-2">
                            The temperature has increased, making a more 
                            hospitable environment for mosquitoes.
                        </li>
                        <li className="py-2">
                            The changes in weather have caused a longer wet
                            season. This leads to more standing water, and
                            more mosquitoes breeding.
                        </li>
                        <li className="py-2">
                            Due to climate change, severe storms such as
                            tropical cyclones have become more frequent and
                            intense. This, again, leads to more standing water,
                            and more mosquitoes breeding.
                        </li>
                    </ul>

                    {
                        showEducation ? (
                            <div className="w-full flex justify-center">
                                <button
                                    type="button"
                                    className="m-4 bg-lime-600 p-2 rounded self-center"
                                    onClick={handleButtonClick}
                                >
                                    Let&apos;s go!
                                </button>
                            </div>
                        ) : null
                    }
                </div>
            </div>
        </div>
    );
};
