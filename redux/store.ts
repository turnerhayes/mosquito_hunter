import { configureStore } from "@reduxjs/toolkit";
import { breedingSitesReducer } from "@/redux/slices/breeding_sites";
import { mosquitoTrapsReducer } from "@/redux/slices/mosquito_traps";

export const store = configureStore({
  reducer: {
    breedingSites: breedingSitesReducer,
    mosquitoTraps: mosquitoTrapsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
