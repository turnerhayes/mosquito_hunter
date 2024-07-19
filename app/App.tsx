"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStoreAndPersistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { AppHeader } from "./AppHeader";

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
        <main className="flex flex-col h-screen w-screen">
          <AppHeader />
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </PersistGate>
    </Provider>
  );
}
