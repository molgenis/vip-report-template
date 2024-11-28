import { Context, createContext, ParentComponent, useContext } from "solid-js";
import { AppStore } from "../types/store";
import { createAppStore } from "./app.ts";

const StoreContext = createContext<AppStore>() as Context<AppStore>;

export const Provider: ParentComponent = (props) => {
  const store = createAppStore();
  return <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>;
};

export function useStore() {
  return useContext(StoreContext);
}
