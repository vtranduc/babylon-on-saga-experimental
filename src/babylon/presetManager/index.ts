import { MeshBuilder, Scene } from "babylonjs";
import { LibraryModel, ScenePreset } from "../../types";
import { AssetLibraryManager } from "../assetLibraryManager.ts";

export class PresetManager {
  private scene: Scene;
  private library: AssetLibraryManager;

  constructor(scene: Scene, library: AssetLibraryManager) {
    this.scene = scene;
    this.library = library;
  }

  public async set(preset: ScenePreset) {
    switch (preset) {
      case ScenePreset.PrimitiveObjects:
        this.primitivePreset();
        break;
      case ScenePreset.Miqote:
        await this.miqotePreset();
        break;
      default:
    }
  }

  private primitivePreset() {
    const capsule = MeshBuilder.CreateCapsule("", undefined, this.scene);
    const box = MeshBuilder.CreateBox("", undefined, this.scene);
    const sphere = MeshBuilder.CreateSphere("", undefined, this.scene);
    const icosphere = MeshBuilder.CreateIcoSphere("", undefined, this.scene);

    capsule.position.set(1, 1, 1);
    box.position.set(-1, 1, 1);
    sphere.position.set(-1, 1, -1);
    icosphere.position.set(1, 1, -1);
  }

  private async miqotePreset() {
    this.library.addModel(LibraryModel.Miqote);
  }
}
