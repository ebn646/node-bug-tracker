import {configureStore} from "@reduxjs/toolkit";
import boardsReducer from "./boards/boardsSlice";

export const store = configureStore({
    reducer: {
        boards: boardsReducer,
    }
});

export type RooState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;