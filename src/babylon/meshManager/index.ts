import {
  Engine,
  Scene,
  ArcRotateCamera,
  DirectionalLight,
  Vector3,
  PointerInfo,
  PointerEventTypes,
  MeshBuilder,
  SceneLoader,
  FilesInputStore,
  AbstractMesh,
} from "babylonjs";
import {
  Asset3DEXT,
  CssCursorStyle,
  CursorCallbacks,
  EXT,
  Primitive,
  SetCursorStyle,
} from "../../types";
import { getEXT, getPathAndName } from "../../utils";
import { InfiniteGrid } from "../gridManagers";

interface EssentialMeshes {
  grid: InfiniteGrid;
}

export class MeshManager {
  private scene: Scene;
  private essentialMeshes: EssentialMeshes;
  private renderingMeshes: AbstractMesh[] = [];

  constructor(scene: Scene, cameraPosition: Vector3) {
    this.scene = scene;
    this.essentialMeshes = this.getEssentialMeshes(cameraPosition);
  }

  private getEssentialMeshes(cameraPosition: Vector3) {
    return {
      grid: new InfiniteGrid("infiniteGrid", this.scene, cameraPosition),
    };
  }
}

interface MeshData {
  meshes: [];
}

class MeshCreator {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  private createPrimitive(type: Primitive) {
    switch (type) {
      case Primitive.Sphere:
      case Primitive.Capsule:
      case Primitive.IcoSphere:
      case Primitive.Box:
      default:
    }
  }

  private createCapsule() {
    const mesh = MeshBuilder.CreateCapsule("Capsule");
  }

  private removeMesh(mesh: AbstractMesh) {
    this.scene.removeMesh(mesh);
  }
}
