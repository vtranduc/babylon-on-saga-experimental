import SceneManager from "../babylon/sceneManager";
import { NormalTracerManager } from "../babylon/cursorManagers";
import { MeshCursor } from "../types";

export default function cursorSaga(sceneManager: SceneManager) {
  const manager = new NormalTracerManager(
    MeshCursor.NormalTracer,
    sceneManager.renderScene,
    { sphereDiameter: 1 }
  );

  manager.position.y = 2;
}
