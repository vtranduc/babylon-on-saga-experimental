import { PayloadAction } from "@reduxjs/toolkit";
import { all, takeLatest } from "redux-saga/effects";
import SceneManager from "../babylon/sceneManager";
import { loadAndRevokeBlob } from "../reducer";
import { BlobData } from "../types";

export default function* fileSaga(sceneManager: SceneManager) {
  yield all([
    takeLatest(loadAndRevokeBlob.type, loadAndRevokeBlobSaga(sceneManager)),
  ]);
}

function loadAndRevokeBlobSaga(sceneManager: SceneManager) {
  return function* ({ payload: { blob, ext } }: PayloadAction<BlobData>) {
    try {
      yield sceneManager.loadBlob(blob, ext);
    } catch (error) {
      console.warn("Failed to load the asset inside Saga: ", error);
    } finally {
      window.URL.revokeObjectURL(blob);
    }
  };
}
