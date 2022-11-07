import { PayloadAction } from "@reduxjs/toolkit";
import { FilesInputStore } from "babylonjs";
import { all, put, takeLatest } from "redux-saga/effects";
import SceneManager from "../../babylon/sceneManager";
import { clearAllFiles, loadAllFiles, setPreset } from "../../reducer";
import { clearAllMeshes, updateTreeState } from "../../reducer/sceneReducer";
import { ScenePreset } from "../../types";

export default function* sceneSaga(sceneManager: SceneManager) {
  yield onTreeChange(sceneManager);

  yield all([
    takeLatest(setPreset.type, setPresetSaga(sceneManager)),
    takeLatest(clearAllMeshes.type, clearAllMeshesSaga(sceneManager)),
    takeLatest(loadAllFiles.type, loadAllFilesSaga(sceneManager)),
    takeLatest(clearAllFiles.type, clearAllFilesSaga),
  ]);
}

function loadAllFilesSaga(sceneManager: SceneManager) {
  return function* () {
    try {
      yield sceneManager.loadAllFiles();
    } catch (error) {
      console.warn("Error in loading files: ", error);
    } finally {
      yield put(clearAllFiles());
      yield onTreeChange(sceneManager);
    }
  };
}

function clearAllFilesSaga() {
  FilesInputStore.FilesToLoad = {};
}

function setPresetSaga(sceneManager: SceneManager) {
  return function* ({ payload }: PayloadAction<ScenePreset>) {
    yield sceneManager.setPreset(payload);
    yield onTreeChange(sceneManager);
  };
}

function clearAllMeshesSaga(sceneManager: SceneManager) {
  return function* () {
    sceneManager.clearAllMeshes();
    yield onTreeChange(sceneManager);
  };
}

function* onTreeChange(sceneManager: SceneManager) {
  yield put(updateTreeState(sceneManager.tree));
}
