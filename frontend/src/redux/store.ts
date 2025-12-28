import { configureStore } from "@reduxjs/toolkit";
import groupReducer from "./slices/groupSlice";

export const store = configureStore({
    reducer: {
        // Add your reducers here
        group: groupReducer
    },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;