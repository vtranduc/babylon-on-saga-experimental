import { all } from "redux-saga/effects";
import cursorSaga from "./cursorSaga";
import fileSaga from "./fileSaga";
import sceneSaga from "./sceneSaga";
import { ElementId } from "../types";
import SceneManager from "../babylon/sceneManager";
import { loadShaders } from "../utils";

export default function* saga() {
  yield loadShaders();

  const sceneManager = new SceneManager();

  yield setCanvasToContainer(sceneManager);

  yield all([
    sceneSaga(sceneManager),
    cursorSaga(sceneManager),
    fileSaga(sceneManager),
  ]);
}

function setCanvasToContainer(sceneManager: SceneManager): Promise<void> {
  return new Promise((resolve) => {
    const getContainer = () => document.getElementById(ElementId.RenderCanvas);

    const onContainerLoaded = (container: HTMLElement) => {
      sceneManager.setCanvasContainer(container);
      resolve();
    };

    const container = getContainer();
    if (container) onContainerLoaded(container);
    else {
      const observer = new MutationObserver((_, obs) => {
        const container = getContainer();
        if (!container) return;
        obs.disconnect();
        onContainerLoaded(container);
      });

      observer.observe(document, {
        childList: true,
        subtree: true,
      });
    }
  });
}
