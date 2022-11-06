import { PayloadAction } from "@reduxjs/toolkit";
import { all, takeLatest } from "redux-saga/effects";
import SceneManager from "../../babylon/sceneManager";
import { setPreset } from "../../reducer";
import { ScenePreset } from "../../types";

export default function* sceneSaga(sceneManager: SceneManager) {
  yield all([takeLatest(setPreset.type, setPresetSaga(sceneManager))]);
}

function setPresetSaga(sceneManager: SceneManager) {
  return function ({ payload }: PayloadAction<ScenePreset>) {
    console.log("show ---> ", payload);
  };
}
