import {
  Scene,
  Vector3,
  MeshBuilder,
  SceneLoader,
  AbstractMesh,
  FilesInputStore,
  ISceneLoaderAsyncResult,
} from "babylonjs";

import {
  Asset3DEXT,
  EXT,
  Primitive,
  ScenePreset,
  Tree,
  UniqueId,
  XYZ,
} from "../../types";
import { getEXT, getPathAndName } from "../../utils";
import { InfiniteGrid } from "../gridManagers";

interface EssentialMeshes {
  grid: InfiniteGrid;
}

interface MeshCreationOptions {
  position?: XYZ;
}

export class MeshManager {
  private scene: Scene;
  private essentialMeshes: EssentialMeshes;
  private essentialIds: UniqueId[] = [];
  private meshCreator: MeshCreator;

  constructor(scene: Scene, cameraPosition: Vector3) {
    this.scene = scene;
    this.meshCreator = new MeshCreator(this.scene);
    this.essentialMeshes = this.getEssentialMeshes(cameraPosition);
    this.essentialIds.push(this.essentialMeshes.grid.uniqueId);
  }

  private getEssentialMeshes(cameraPosition: Vector3) {
    return {
      grid: new InfiniteGrid("infiniteGrid", this.scene, cameraPosition),
    };
  }

  // Basic public methods

  public remove(id: UniqueId) {
    const mesh = this.scene.getMeshByUniqueId(id);
    if (!mesh) return;
    this.scene.removeMesh(mesh, true);
    mesh.dispose(true, true);
  }

  public clearAll() {
    this.firstGenerationMeshes.forEach((mesh) => this.remove(mesh.uniqueId));
  }

  public enablePointer(id: UniqueId) {
    const mesh = this.scene.getMeshByUniqueId(id);
    if (!mesh) return;
    mesh.enablePointerMoveEvents = true;
    mesh
      .getChildMeshes()
      .forEach((child) => (child.enablePointerMoveEvents = true));
  }

  public setPosition(id: UniqueId, position: XYZ) {
    const mesh = this.scene.getMeshByUniqueId(id);
    if (!mesh) return;
    mesh.position.fromArray(position);
  }

  public async loadAllFiles() {
    const meshes = await this.meshCreator.loadAllFiles();
    meshes.forEach((mesh) => {
      this.add(mesh);
      this.enablePointer(mesh.uniqueId);
    });
  }

  public categorizeMeshAsEssential(id: UniqueId) {
    this.essentialIds.push(id);
  }

  // Get tree

  public get tree(): Tree[] {
    return this.firstGenerationMeshes.map((mesh) => this.getTree(mesh));
  }

  private get firstGenerationMeshes() {
    return this.scene.meshes.filter(
      (mesh) => !mesh.parent && this.isInteractive(mesh)
    );
  }

  private getTree(mesh: AbstractMesh): Tree {
    return {
      id: mesh.uniqueId,
      name: mesh.name,
      position: mesh.position.asArray() as XYZ,
      children: mesh.getChildMeshes().map((child) => this.getTree(child)),
    };
  }

  private isInteractive(mesh: AbstractMesh) {
    return !this.essentialIds.includes(mesh.uniqueId);
  }

  // Presets

  public async setPreset(preset: ScenePreset) {
    this.clearAll();

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

  private async miqotePreset() {
    const meshes = await this.meshCreator.loadProjectAsset(
      "./models/cat-girl-ffxiv/",
      "scene.gltf"
    );
    meshes.forEach((mesh) => {
      this.add(mesh);
      this.enablePointer(mesh.uniqueId);
    });
  }

  private primitivePreset() {
    const capsule = this.meshCreator.createPrimitive(Primitive.Capsule, {
      position: [1, 1, 1],
    });
    const box = this.meshCreator.createPrimitive(Primitive.Box, {
      position: [-1, 1, 1],
    });
    const sphere = this.meshCreator.createPrimitive(Primitive.Sphere, {
      position: [-1, 1, -1],
    });
    const icoSphere = this.meshCreator.createPrimitive(Primitive.IcoSphere, {
      position: [1, 1, -1],
    });

    [capsule, box, sphere, icoSphere].forEach((mesh) => {
      this.add(mesh);
      this.enablePointer(mesh.uniqueId);
    });
  }

  /**
   * To be used after mesh is created by MeshCreator
   * @param mesh created by MeshCreator
   */

  private add(mesh: AbstractMesh) {
    this.scene.addMesh(mesh, true);
  }
}

class MeshCreator {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public createPrimitive(type: Primitive, options: MeshCreationOptions = {}) {
    let mesh: AbstractMesh;
    switch (type) {
      case Primitive.Sphere:
        mesh = MeshBuilder.CreateSphere("", undefined, this.scene);
        break;
      case Primitive.Capsule:
        mesh = MeshBuilder.CreateCapsule("", undefined, this.scene);
        break;
      case Primitive.IcoSphere:
        mesh = MeshBuilder.CreateIcoSphere("", undefined, this.scene);
        break;
      case Primitive.Box:
        mesh = MeshBuilder.CreateBox("", undefined, this.scene);
        break;
      default:
        throw new Error(`There is not handler for ${type}`);
    }
    this.processMesh(mesh, options);
    return mesh;
  }

  public async loadAllFiles() {
    const pathNameCombined = Object.keys(FilesInputStore.FilesToLoad);
    const loadedMeshes: AbstractMesh[] = [];
    for (let i = pathNameCombined.length - 1; i >= 0; i--) {
      const fullPath = pathNameCombined[i];
      const ext = getEXT(fullPath);
      if (!ext || !([Asset3DEXT.GLB, Asset3DEXT.GLTF] as EXT[]).includes(ext))
        continue;
      const { path, name } = getPathAndName(fullPath);
      try {
        const result = await SceneLoader.ImportMeshAsync(
          "",
          `file:${path}`,
          name,
          this.scene,
          null,
          ext
        );
        loadedMeshes.push(...this.processSceneLoaderResult(result, {}));
      } catch {
        throw new Error("Encountered error in loading " + fullPath);
      }
    }
    return loadedMeshes;
  }

  public async loadProjectAsset(
    url: string,
    name: string,
    options: MeshCreationOptions = {}
  ) {
    const result = await SceneLoader.ImportMeshAsync("", url, name, this.scene);
    return this.processSceneLoaderResult(result, options);
  }

  private processSceneLoaderResult(
    result: ISceneLoaderAsyncResult,
    options: MeshCreationOptions
  ) {
    const firstGeneration = this.filterFirstGeneration(result.meshes);
    firstGeneration.forEach((mesh) => this.processMesh(mesh, options));
    return firstGeneration;
  }

  private processMesh(mesh: AbstractMesh, options: MeshCreationOptions) {
    if (options.position) mesh.position.fromArray(options.position);
    this.removeMesh(mesh);
  }

  private filterFirstGeneration(meshes: AbstractMesh[]) {
    return meshes.filter((mesh) => !mesh.parent);
  }

  private removeMesh(mesh: AbstractMesh) {
    this.scene.removeMesh(mesh, true);
  }
}
