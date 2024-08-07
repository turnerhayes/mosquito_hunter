import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BreedingSite } from "@/app/index";

export const breedingSitesApi = createApi({
    reducerPath: "breedingSites",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/breeding_sites/",
    }),
    tagTypes: ["breeding_sites"],
    endpoints: (builder) => ({
        getAllBreedingSites: builder.query<BreedingSite[], void>({
            query: () => "",
            providesTags: ["breeding_sites"],
        }),

        getBreedingSite: builder.query<BreedingSite, number>({
            query: (id) => `${id}`,
        }),

        addBreedingSite: builder.mutation<
            BreedingSite,
            Omit<BreedingSite, "id"|"photo_id"|"photo_width"|"photo_height"> & {
                photo: File;
            }
        >({
            query: (site) => {
                return {
                    url: "",
                    method: "POST",
                    body: (() => {
                        const fd = new FormData();

                        fd.set("photo", site.photo);
                        fd.set(
                            "location",
                            `[${site.location[0]},${site.location[1]}]`
                        );

                        return fd;
                    })(),
                };
            },
            invalidatesTags: ["breeding_sites"],
        }),
        
        removeBreedingSite: builder.mutation<
            BreedingSite,
            number
        >({
            query: (id) => {
                return {
                    url: `${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["breeding_sites"],
        }),
    }),
});

export const {
    useGetAllBreedingSitesQuery,
    useGetBreedingSiteQuery,
    useAddBreedingSiteMutation,
    useRemoveBreedingSiteMutation,
} = breedingSitesApi;
