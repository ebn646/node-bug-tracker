import {configureStore} from "@reduxjs/toolkit";
import boardsReducer from "./boards/boardsSlice";
import modalSlice from "./modal/modalSlice";

export const store = configureStore({
    reducer: {
        boards: boardsReducer,
        modal: modalSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;