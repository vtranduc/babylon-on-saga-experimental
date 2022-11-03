import SceneManager from "../babylon/sceneManager";
import { NormalTracerManager } from "../babylon/cursorManagers";
import { MeshCursor, NormalTracerProperties } from "../types";
import { RootState, setNormalTracerProperties } from "../reducer";
import { all, put, select, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { updateNormalTracerState } from "../reducer/cursorReducer";

export default function* cursorSaga(sceneManager: SceneManager) {
  const normalTracerManager = new NormalTracerManager(
    MeshCursor.NormalTracer,
    sceneManager.renderScene
  );
  sceneManager.loadCursorCallbacks(normalTracerManager.getCursorCallbacks);
  const normalTracerProperties: NormalTracerProperties = yield select(
    (state: RootState) => state.cursor.properties[MeshCursor.NormalTracer]
  );
  const updates = updateNormalTracerProperties(
    normalTracerManager,
    normalTracerProperties
  );
  yield put(updateNormalTracerState(updates));

  yield all([
    takeEvery(
      setNormalTracerProperties,
      setNormalTracerPropertiesSaga(normalTracerManager)
    ),
  ]);
}

function setNormalTracerPropertiesSaga(manager: NormalTracerManager) {
  return function* ({
    payload,
  }: PayloadAction<Partial<NormalTracerProperties>>) {
    const updatedProperties = updateNormalTracerProperties(manager, payload);
    yield put(updateNormalTracerState(updatedProperties));
  };
}

function updateNormalTracerProperties(
  manager: NormalTracerManager,
  updates: Partial<NormalTracerProperties>
) {
  return (Object.keys(updates) as (keyof NormalTracerProperties)[]).reduce(
    (acc: Partial<NormalTracerProperties>, propertyType) => {
      switch (propertyType) {
        case "alpha":
          manager.alpha = updates.alpha as number;
          break;
        case "color":
          manager.color = updates.color as string;
          break;
        case "rimColor":
          manager.rimColor = updates.rimColor as string;
          break;
        case "size":
          manager.size = updates.size as number;
          break;
        default:
      }
      return { ...acc, [propertyType]: manager[propertyType] };
    },
    {}
  );
}
