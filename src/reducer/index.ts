import { combineReducers } from "redux";
import cursorReducer, {
  CursorState,
  setCursor,
  setNormalTracerProperties,
} from "./cursorReducer";
import sceneReducer, {
  SceneState,
  setPreset,
  clearAllMeshes,
  loadAllFiles,
  clearAllFiles,
} from "./sceneReducer";

export default combineReducers({
  cursor: cursorReducer,
  scene: sceneReducer,
});

export interface RootState {
  cursor: CursorState;
  scene: SceneState;
}

export {
  setCursor,
  setNormalTracerProperties,
  setPreset,
  clearAllMeshes,
  loadAllFiles,
  clearAllFiles,
};
