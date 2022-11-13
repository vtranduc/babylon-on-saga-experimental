import {
  ArcRotateCamera,
  Camera,
  DirectionalLight,
  Light,
  Scene,
  Vector3,
} from "babylonjs";
import { MeshCursor, MeshCursors } from "../../types";
import { NormalTracerManager } from "../cursorManagers";
import { InfiniteGrid } from "../gridManagers";

export class UtilityAssetManager {
  private scene: Scene;
  private grid: InfiniteGrid;
  private camera: Camera;
  private lights: Light[] = [];
  private meshCursors: MeshCursors;

  // Basic initial set ups inside constructor

  constructor(scene: Scene) {
    this.scene = scene;
    this.camera = new ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      Math.PI / 4,
      20,
      Vector3.Zero(),
      this.scene
    );
    this.camera.attachControl();
    this.grid = new InfiniteGrid("", this.scene, this.camera.position);
    this.lights.push(
      new DirectionalLight("light", new Vector3(0, -1, 0), this.scene)
    );

    this.meshCursors = {
      [MeshCursor.NormalTracer]: new NormalTracerManager(
        MeshCursor.NormalTracer,
        this.scene
      ),
    };
  }

  public get cursors() {
    return this.meshCursors;
  }

  public get cameraPosition() {
    return this.camera.position;
  }
}
