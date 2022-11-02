import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BlobData } from "../types";

export interface FileState {}

const initialState: FileState = {};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    loadBlob(state, action: PayloadAction<BlobData>) {},
  },
});

export const { loadBlob } = fileSlice.actions;

export default fileSlice.reducer;
