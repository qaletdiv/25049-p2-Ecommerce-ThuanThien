import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import cartReducer from "@/app/store/cartSlice";

// A new store for each browser tab (StoreProvider creates it once), never a shared module-level one:
// on the server a shared store would leak one user's cart into another user's page.
export function makeStore() {
  return configureStore({
    reducer: { cart: cartReducer },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Typed versions of useDispatch / useSelector: use these instead of the plain ones.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
