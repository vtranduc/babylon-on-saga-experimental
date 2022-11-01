import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cursor, MeshCursor, NormalTracerProperties } from "../types";

export interface CursorState {
  properties: {
    [MeshCursor.NormalTracer]: NormalTracerProperties;
  };
}

const initialState: CursorState = {
  properties: {
    [MeshCursor.NormalTracer]: {
      color: "#eeeeee",
      rimColor: "#7f7f7f",
      alpha: 0.8,
      size: 0.1,
    },
  },
};

const cursorSlice = createSlice({
  name: "cursor",
  initialState,
  reducers: {
    setCursor(state, action: PayloadAction<Cursor>) {},

    setNormalTracerProperties(
      state,
      action: PayloadAction<Partial<NormalTracerProperties>>
    ) {},

    updateNormalTracerState(
      state,
      { payload }: PayloadAction<Partial<NormalTracerProperties>>
    ) {
      Object.assign(state.properties[MeshCursor.NormalTracer], payload);
    },
  },
});

export const { setCursor, setNormalTracerProperties, updateNormalTracerState } =
  cursorSlice.actions;

export default cursorSlice.reducer;
