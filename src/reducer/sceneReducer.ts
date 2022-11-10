import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ScenePreset, Tree } from "../types";

export interface SceneState {
  tree: Tree[];
}

const initialState: SceneState = {
  tree: [],
};

const sceneSlice = createSlice({
  name: "scene",
  initialState,
  reducers: {
    setPreset: (state, action: PayloadAction<ScenePreset>) => {},

    clearAllMeshes: () => {},

    updateTreeState: (state, { payload }: PayloadAction<Tree[]>) => {
      state.tree = payload;
    },

    loadAllFiles: () => {},

    clearAllFiles: () => {},
  },
});

export const {
  setPreset,
  updateTreeState,
  clearAllMeshes,
  loadAllFiles,
  clearAllFiles,
} = sceneSlice.actions;

export default sceneSlice.reducer;
