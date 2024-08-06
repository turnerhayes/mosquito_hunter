import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, REGISTER, PURGE, PERSIST, PAUSE, REHYDRATE, FLUSH } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { breedingSitesReducer } from "@/redux/slices/breeding_sites";
import { mosquitoTrapsReducer } from "@/redux/slices/mosquito_traps";
import { collectionRecordsReducer } from "./slices/collection_records";
import { settingsReducer } from "./slices/settings_slice";
import { breedingSitesApi } from "@/app/api/client/breeding_sites";


const rootReducer = combineReducers({
  [breedingSitesApi.reducerPath]: breedingSitesApi.reducer,
  mosquitoTraps: mosquitoTrapsReducer,
  collectionRecords: collectionRecordsReducer,
  settings: settingsReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      }
    }).concat(breedingSitesApi.middleware)
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
