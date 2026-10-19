import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";

import { ThunkAction, Action } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export default store;

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// 定义 AppThunk 类型，这是用于异步 action 的类型
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
