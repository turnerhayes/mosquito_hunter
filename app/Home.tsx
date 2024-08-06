"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useAppSelector } from "@/redux/hooks";
import { getSetting } from "@/redux/selectors";
import { SettingName } from "@/redux/slices/settings_slice";
import { useGetAllBreedingSitesQuery } from "./api/client/breeding_sites";
import { useGetAllMosquitoTrapsQuery } from "./api/client/mosquito_traps";


const Map = dynamic(() => import("@/app/Map"), { ssr:false });

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
        showEducation,
    ]);

    const { data: breedingSites } = useGetAllBreedingSitesQuery();
    const { data: mosquitoTraps } = useGetAllMosquitoTrapsQuery();

    return (
        <>
            <Map
                breedingSites={breedingSites ?? []}
                mosquitoTraps={mosquitoTraps ?? []}
            />
            <Script
                stylesheets={[
                    "https://unpkg.com/leaflet@1.6.0/dist/leaflet.css",
                ]}
                src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
            />
        </>
    );
};
