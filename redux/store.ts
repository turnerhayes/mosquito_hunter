import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, REGISTER, PURGE, PERSIST, PAUSE, REHYDRATE, FLUSH } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { settingsReducer } from "./slices/settings_slice";
import { breedingSitesApi } from "@/app/api/client/breeding_sites";
import { mosquitoTrapsApi } from "@/app/api/client/mosquito_traps";
import { collectionsApi } from "@/app/api/client/collections";


const rootReducer = combineReducers({
  [breedingSitesApi.reducerPath]: breedingSitesApi.reducer,
  [mosquitoTrapsApi.reducerPath]: mosquitoTrapsApi.reducer,
  [collectionsApi.reducerPath]: collectionsApi.reducer,
  settings: settingsReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    breedingSitesApi.reducerPath,
    mosquitoTrapsApi.reducerPath,
    collectionsApi.reducerPath,
  ]
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(breedingSitesApi.middleware, mosquitoTrapsApi.middleware, collectionsApi.middleware)
  });
  return store;
};

export const makeStoreAndPersistor = () => {
  const store = makeStore();
  let persistor = persistStore(store)
  return { store, persistor }
};


type StoreType = ReturnType<typeof makeStore>;
export type RootState = ReturnType<StoreType["getState"]>;
export type AppDispatch = StoreType["dispatch"];
