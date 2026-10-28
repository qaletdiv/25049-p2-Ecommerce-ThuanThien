import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import cartReducer from "@/app/store/cartSlice";

// Mỗi tab trình duyệt có một store mới (StoreProvider tạo một lần), không bao giờ dùng store chung ở cấp module:
// trên server, store dùng chung sẽ làm lộ giỏ hàng của người này sang trang của người khác.
export function makeStore() {
  return configureStore({
    reducer: { cart: cartReducer },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Phiên bản có kiểu của useDispatch / useSelector: dùng các hàm này thay cho bản thường.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
