import { combineReducers } from "redux";
import cursorReducer from "./cursorReducer";
import sceneReducer from "./sceneReducer";

export default combineReducers({
  cursor: cursorReducer,
  scene: sceneReducer,
});

export {};
