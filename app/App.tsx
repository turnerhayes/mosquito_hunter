"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStoreAndPersistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

const {store, persistor} = makeStoreAndPersistor();

export default function App(
  {
    children,
  }: {
    children: ReactNode;
  }
) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
