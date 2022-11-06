import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ScenePreset } from "../types";

export interface SceneState {}

const initialState: SceneState = {};

const sceneSlice = createSlice({
  name: "scene",
  initialState,
  reducers: {
    setPreset: (state, action: PayloadAction<ScenePreset>) => {},
  },
});

export const { setPreset } = sceneSlice.actions;

export default sceneSlice.reducer;
