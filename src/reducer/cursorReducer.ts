import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cursor } from "../types";

const cursorSlice = createSlice({
  name: "cursor",
  initialState: {},
  reducers: {
    setCursor(state, action: PayloadAction<Cursor>) {},
  },
});

export const { setCursor } = cursorSlice.actions;

export default cursorSlice.reducer;
