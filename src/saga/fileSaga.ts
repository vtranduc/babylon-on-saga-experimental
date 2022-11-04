import { FilesInputStore } from "babylonjs";
import { all, put, takeLatest } from "redux-saga/effects";
import SceneManager from "../babylon/sceneManager";
import { clearAllFiles, loadAllFiles } from "../reducer";

export default function* fileSaga(sceneManager: SceneManager) {
  yield all([
    takeLatest(loadAllFiles.type, loadAllFilesSaga(sceneManager)),
    takeLatest(clearAllFiles.type, clearAllFilesSaga),
  ]);
}

function loadAllFilesSaga(sceneManager: SceneManager) {
  return function* () {
    try {
      yield sceneManager.loadAllFiles();
    } catch (e) {
      console.warn("Failed to load file: ", e);
    } finally {
      yield put(clearAllFiles());
    }
  };
}

function clearAllFilesSaga() {
  FilesInputStore.FilesToLoad = {};
}
