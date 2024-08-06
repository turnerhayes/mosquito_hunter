import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MosquitoTrap } from "@/app/index";

export const mosquitoTrapsApi = createApi({
    reducerPath: "mosquitoTraps",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/traps/",
    }),
    tagTypes: ["mosquito_traps"],
    endpoints: (builder) => ({
        getAllMosquitoTraps: builder.query<MosquitoTrap[], void>({
            query: () => "",
            providesTags: ["mosquito_traps"],
        }),

        getMosquitoTrap: builder.query<MosquitoTrap, number>({
            query: (id) => `${id}`,
        }),

        addMosquitoTrap: builder.mutation<
            MosquitoTrap,
            Omit<MosquitoTrap, "id">
        >({
            query: (site) => {
                return {
                    url: `/[${site.location[0]},${site.location[1]}]`,
                    method: "POST",
                };
            },
            invalidatesTags: ["mosquito_traps"],
        }),
        
        removeMosquitoTrap: builder.mutation<
            MosquitoTrap,
            number
        >({
            query: (id) => {
                return {
                    url: `${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["mosquito_traps"],
        }),
    }),
});

export const {
    useGetAllMosquitoTrapsQuery,
    useGetMosquitoTrapQuery,
    useAddMosquitoTrapMutation,
    useRemoveMosquitoTrapMutation,
} = mosquitoTrapsApi;
