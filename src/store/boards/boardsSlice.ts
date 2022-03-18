import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BoardState {
    value: string[]
}

const initialState: BoardState = {
    value: []
}

export const boardsSlice = createSlice({
    name: 'boards',
    initialState,
    reducers: {
        addBoard: (state, action: PayloadAction<string>) => {
            console.log(action.payload)
            state.value.push(action.payload)
        }
    }
})

export const { addBoard } = boardsSlice.actions;

export default boardsSlice.reducer;