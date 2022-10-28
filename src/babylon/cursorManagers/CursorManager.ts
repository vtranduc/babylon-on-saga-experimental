import { Mesh, Scene } from "babylonjs";

export default abstract class CursorManager {
  protected abstract mesh: Mesh;

  protected name: string;
  protected scene: Scene;

  constructor(name: string, scene: Scene) {
    this.name = name;
    this.scene = scene;
  }

  get position() {
    return this.mesh.position;
  }
}
