import { combineReducers } from "redux";
import cursorReducer, {
  CursorState,
  setCursor,
  setNormalTracerProperties,
} from "./cursorReducer";
import sceneReducer, { SceneState } from "./sceneReducer";
import fileReducer, { FileState, loadAndRevokeBlob } from "./fileReducer";

export default combineReducers({
  cursor: cursorReducer,
  scene: sceneReducer,
  file: fileReducer,
});

export interface RootState {
  cursor: CursorState;
  scene: SceneState;
  file: FileState;
}

export { setCursor, setNormalTracerProperties, loadAndRevokeBlob };
