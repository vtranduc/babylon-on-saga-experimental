import {
  Scene,
  MeshBuilder,
  SceneLoader,
  AbstractMesh,
  FilesInputStore,
  ISceneLoaderAsyncResult,
  Vector3,
  Color3,
  Nullable,
  LinesMesh,
} from "babylonjs";
import {
  Asset3DEXT,
  EssentialMeshes,
  EXT,
  MeshCursor,
  MeshCursors,
  Primitive,
  XYZ,
} from "../../types";
import { getEXT, getPathAndName } from "../../utils";
import { NormalTracerManager } from "../cursorManagers";
import { InfiniteGrid } from "../gridManagers";

interface MeshCreationOptions {
  position?: XYZ;
}

export class MeshCreator {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public getEssentialMeshes(cameraPosition: Vector3): EssentialMeshes {
    return {
      grid: new InfiniteGrid("infiniteGrid", this.scene, cameraPosition),
    };
  }

  public getMeshCursors(): MeshCursors {
    return {
      [MeshCursor.NormalTracer]: new NormalTracerManager(
        MeshCursor.NormalTracer,
        this.scene
      ),
    };
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

    console.log("SHOW ALL RESULT!: ");

    // console.log(result.)

    console.log("show for each mesh ----> ", result.animationGroups);
    result.meshes.forEach((mesh) => {
      console.log("scaling: ", mesh.scaling);
    });

    firstGeneration.forEach((mesh) => this.processMesh(mesh, options));
    return firstGeneration;
  }

  private processMesh(mesh: AbstractMesh, options: MeshCreationOptions) {
    if (options.position) mesh.position.fromArray(options.position);
    console.log("show scaling here ---> ", mesh.scaling.z);
    mesh.scaling.z = 1;
    this.removeMesh(mesh);
  }

  private filterFirstGeneration(meshes: AbstractMesh[]) {
    return meshes.filter((mesh) => !mesh.parent);
  }

  private removeMesh(mesh: AbstractMesh) {
    // this.scene.removeMesh(mesh, true);
  }

  public createFaceNormals(
    mesh: AbstractMesh,
    traverse = false,
    size = 0.1,
    color = "#ff00ff"
  ): LinesMesh[] {
    // console.log("creating lines: ", mesh.getface);

    const descendantNormals = traverse
      ? mesh
          .getChildMeshes(false)
          .reduce(
            (acc, descendant) =>
              this.createFaceNormals(descendant, false, size, color).concat(
                acc
              ),
            [] as LinesMesh[]
          )
      : [];
    mesh.updateFacetData();
    const positions = mesh.getFacetLocalPositions();
    if (!positions.length) return descendantNormals;
    const normals = mesh.getFacetLocalNormals();
    const lines: Vector3[][] = [];
    for (let i = 0; i < positions.length; i++) {
      const center = positions[i].add(mesh.position);
      const normal = normals[i].scale(size).add(center);
      lines.push([center, normal]);
    }
    const normalLines = MeshBuilder.CreateLineSystem("", { lines }, this.scene);
    normalLines.color.copyFrom(Color3.FromHexString(color));
    return descendantNormals.concat(normalLines);
  }
}
