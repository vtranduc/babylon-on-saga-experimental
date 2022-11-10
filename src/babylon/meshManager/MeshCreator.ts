import {
  Scene,
  MeshBuilder,
  SceneLoader,
  AbstractMesh,
  FilesInputStore,
  ISceneLoaderAsyncResult,
  Vector3,
  BoundingInfo,
  Mesh,
  VertexBuffer,
  VertexData,
  StandardMaterial,
} from "babylonjs";
import {
  Asset3DEXT,
  EssentialMeshes,
  EXT,
  MeshCursor,
  MeshCursors,
  MeshType,
  Primitive,
  XYZ,
} from "../../types";
import { getEXT, getPathAndName } from "../../utils";
import { NormalTracerManager } from "../cursorManagers";
import { InfiniteGrid } from "../gridManagers";
import { createVertexNormals } from "../utils";

interface MeshCreationOptions {
  position?: XYZ;
}

let a = 0;
// a = "dfadfa";

export class MeshCreator {
  private scene: Scene;
  private maxLength = 2;
  private utils = {
    boundingDimensions: new Vector3(),
  };

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

  // private get phongMat() {
  //   return new Phong
  // }

  public createPrimitive(type: Primitive, options: MeshCreationOptions = {}) {
    let mesh: Mesh;
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

    // console.log(
    //   type,
    //   mesh.getBoundingInfo().boundingBox.maximum,
    //   mesh.getBoundingInfo().boundingBox.minimum
    // );

    // mesh.scaling.set(2, 2, 2);

    // Vector3.Maximize()

    // mesh.showBoundingBox = true;

    // const { maximum, minimum } = mesh.getBoundingInfo().boundingBox;

    // const originalMaxLength = Math.max(
    //   ...this.utils.boundingDimensions
    //     .copyFrom(maximum)
    //     .subtract(minimum)
    //     .asArray()
    // );

    // const scale = this.maxLength /originalMaxLength;

    // // mesh.scaling.set(scale, scale, scale);
    // // mesh.bakeTransformIntoVertices();

    // console.log("show the max dim ---> ", originalMaxLength);

    // const boundingInfo = new BoundingInfo(
    //   new Vector3(-10, -10, -10),
    //   new Vector3(10, 10, 10)
    // );

    // mesh.setBoundingInfo(boundingInfo);

    this.scaleAndBake(mesh);

    // mesh.getClassName()

    // console.log("karano!", mesh.getClassName(), mesh.material);

    this.processMesh(mesh, options);
    // this.processMesh(mesh, {});
    return mesh;
  }

  private scaleAndBake(mesh: Mesh) {
    const { maximum, minimum } = mesh.getBoundingInfo().boundingBox;

    const originalMaxLength = Math.max(
      ...this.utils.boundingDimensions
        .copyFrom(maximum)
        .subtract(minimum)
        .asArray()
    );

    console.log("humility ---> ", mesh.getHierarchyBoundingVectors());

    const scale = this.maxLength / originalMaxLength;

    // mesh.scaling.set(scale, scale, scale);

    mesh.bakeCurrentTransformIntoVertices();

    // const

    // createVertexNormals(mesh, this.scene);

    const indices = mesh.getIndices();
    const normals = mesh.getVerticesData(VertexBuffer.NormalKind);
    const positions = mesh.getVerticesData(VertexBuffer.PositionKind);
    VertexData.ComputeNormals(positions, indices, normals);
    mesh.updateVerticesData(VertexBuffer.NormalKind, normals, false, false);
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
    console.log("loaded results: ", result);

    const mat = new StandardMaterial("");
    // mat.cullBackFaces = false;

    mat.backFaceCulling = false;

    // result.meshes.forEach((mesh) => (mesh.material = mat));

    result.meshes.forEach((mesh) => createVertexNormals(mesh, this.scene));

    const firstGeneration = this.filterFirstGeneration(result.meshes);
    firstGeneration.forEach((mesh) => this.processMesh(mesh, options));

    console.log("show the first generation! ---> ", firstGeneration);

    // this.testScale(firstGeneration);

    // -----

    return firstGeneration;
  }

  private testScale(meshes: AbstractMesh[]) {
    meshes.forEach((mesh) => {
      if (mesh.getClassName() !== MeshType.Mesh) return;

      const abs = new AbstractMesh("");

      // const getGet = abs.getClassName()

      console.log(
        "show this here ----> ",
        abs.getClassName() === MeshType.AbstractMesh
      );
      // mesh.scaling.set()

      const { maximum, minimum } = mesh.getBoundingInfo().boundingBox;

      const { max, min } = mesh.getHierarchyBoundingVectors(true);

      console.log(
        "actual: ",
        max,
        min,
        this.utils.boundingDimensions.copyFrom(max).subtract(min).asArray()
      );

      console.log("max and min: ", maximum, minimum);

      const originalMaxLength = Math.max(
        ...this.utils.boundingDimensions.copyFrom(max).subtract(min).asArray()
      );

      const scale = this.maxLength / originalMaxLength;

      console.log("show the scale: ", this.maxLength, originalMaxLength, scale);

      // mesh.scaling.set(scale, scale, scale);

      // (mesh as Mesh).bakeCurrentTransformIntoVertices(false);

      // // const

      const indices = mesh.getIndices();
      const normals = mesh.getVerticesData(VertexBuffer.NormalKind);
      // const positions = mesh.getVerticesData(VertexBuffer.PositionKind);
      // VertexData.ComputeNormals(positions, indices, normals);
      // mesh.updateVerticesData(VertexBuffer.NormalKind, normals, false, false);
    });
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
