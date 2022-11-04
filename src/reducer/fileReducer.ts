import { createSlice } from "@reduxjs/toolkit";

export interface FileState {}

const initialState: FileState = {};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    loadAllFiles() {},

    clearAllFiles() {},
  },
});

export const { loadAllFiles, clearAllFiles } = fileSlice.actions;

export default fileSlice.reducer;
