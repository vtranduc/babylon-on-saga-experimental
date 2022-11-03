import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BlobData } from "../types";

export interface FileState {}

const initialState: FileState = {};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    loadAndRevokeBlob(state, action: PayloadAction<BlobData>) {},
  },
});

export const { loadAndRevokeBlob } = fileSlice.actions;

export default fileSlice.reducer;
