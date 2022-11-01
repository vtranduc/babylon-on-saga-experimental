import { createSlice } from "@reduxjs/toolkit";

export interface SceneState {}

const initialState: SceneState = {};

const sceneSlice = createSlice({
  name: "scene",
  initialState,
  reducers: {},
});

export default sceneSlice.reducer;
