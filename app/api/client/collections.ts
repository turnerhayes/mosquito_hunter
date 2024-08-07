import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Collection } from "@/app/index";


const transformCollection = (collection: Collection) => {
    return {
        ...collection,
        timestamp: collection.timestamp * 1000.0,
    };
};

export const collectionsApi = createApi({
    reducerPath: "collections",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/collections/",
    }),
    tagTypes: ["collections"],
    endpoints: (builder) => ({
        getAllCollections: builder.query<Collection[], void>({
            query: () => "",
            providesTags: ["collections"],
            transformResponse: (response: Collection[]) => {
                return response.map(transformCollection);
            },
        }),

        getCollection: builder.query<Collection, number>({
            query: (id) => `${id}`,
            providesTags: ["collections"],
            transformResponse: transformCollection,
        }),

        addCollection: builder.mutation<
            Collection,
            Omit<Collection, "id"> & {
                photo?: File;
            }
        >({
            query: (collection) => {
                return {
                    url: "",
                    method: "POST",
                    body: (() => {
                        const fd = new FormData();
                        fd.set("mosquito_count", `${collection.mosquito_count}`);
                        // JS milliseconds -> seconds
                        fd.set("timestamp", `${collection.timestamp / 1000.0}`);
                        if (collection.trap_id != undefined) {
                            fd.set("trap_id", `${collection.trap_id}`);
                        }
                        if (collection.photo) {
                            fd.set("photo", collection.photo);
                        }
                        return fd;
                    })(),
                };
            },
            invalidatesTags: ["collections"],
        }),
        
        removeCollection: builder.mutation<
            Collection,
            number
        >({
            query: (id) => {
                return {
                    url: `${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["collections"],
        }),
    }),
});

export const {
    useGetAllCollectionsQuery,
    useGetCollectionQuery,
    useAddCollectionMutation,
    useRemoveCollectionMutation,
} = collectionsApi;
