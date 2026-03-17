"use client";

import { Provider } from "react-redux";
import { store, persistor } from "@/redux/Store";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
