import { combineReducers } from "redux";
import cursorReducer, { setCursor } from "./cursorReducer";
import sceneReducer from "./sceneReducer";

export default combineReducers({
  cursor: cursorReducer,
  scene: sceneReducer,
});

export { setCursor };
