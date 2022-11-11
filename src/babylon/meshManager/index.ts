import {
  Scene,
  Vector3,
  AbstractMesh,
  Node,
  SkeletonViewer,
  Skeleton,
  MeshBuilder,
  TransformNode,
  Mesh,
  Bone,
} from "babylonjs";
import {
  EssentialMeshes,
  MeshCursor,
  MeshCursors,
  Primitive,
  ScenePreset,
  Tree,
  UniqueId,
  XYZ,
  MeshCreationOptions,
} from "../../types";
import { NormalTracerManager } from "../cursorManagers";
import { InfiniteGrid } from "../gridManagers";
import { MeshCreator } from "./MeshCreator";

// interface MeshCreationOptions {
//   position?: XYZ;
// }

export class MeshHelper {
  static scene: Scene;
  // private essentialMeshes: EssentialMeshes;
  // private meshCreator: MeshCreator;
  // private cursors: MeshCursors;

  // constructor(scene: Scene) {
  //   this.scene = scene;
  // }

  public static createEssentialMeshes(cameraPosition: Vector3) {
    return {
      grid: new InfiniteGrid("infiniteGrid", this.scene, cameraPosition),
    };
  }

  public static createMeshCursors(): MeshCursors {
    return {
      [MeshCursor.NormalTracer]: new NormalTracerManager(
        MeshCursor.NormalTracer,
        this.scene
      ),
    };
  }

  public static createPrimitive(
    type: Primitive,
    options: MeshCreationOptions = {}
  ) {
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

  private static processMesh(mesh: AbstractMesh, options: MeshCreationOptions) {
    if (options.position) mesh.position.fromArray(options.position);
  }
}

export class MeshManager {
  private scene: Scene;
  private essentialMeshes: EssentialMeshes;
  private meshCreator: MeshCreator;
  private essentialIds: UniqueId[] = [];
  private cursors: MeshCursors;

  constructor(scene: Scene, cameraPosition: Vector3) {
    this.scene = scene;
    this.meshCreator = new MeshCreator(this.scene);
    this.essentialMeshes = this.meshCreator.getEssentialMeshes(cameraPosition);
    this.cursors = this.meshCreator.getMeshCursors();
    this.essentialIds.push(
      ...Object.values(this.essentialMeshes).map((manager) => manager.uniqueId)
    );
    this.essentialIds.push(
      ...Object.values(this.cursors).map((manager) => manager.uniqueId)
    );

    // this.addEssentialIds();
  }

  public addEssentialId(id: UniqueId) {
    this.essentialIds.push(id);
  }

  // Basic public methods

  // public loadAllFiles() {}

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

  public get meshCursors() {
    return this.cursors;
  }

  // Get tree

  public get tree(): Tree[] {
    return this.firstGenerationMeshes.map((mesh) => this.getTree(mesh));
  }

  private get firstGenerationMeshes(): Node[] {
    // return this.scene.meshes.filter(
    //   (mesh) => !mesh.parent && this.isInteractive(mesh)
    // );

    return this.scene.getNodes().filter((node) => !node.parent);
  }

  private getTree(node: Node): Tree {
    return {
      id: node.uniqueId,
      name: node.name,
      children: node.getChildren().map((child) => this.getTree(child)),
    };

    // const abc = new Skeleton("", "", this.scene);

    // const ab2 = MeshBuilder.CreateBox("");

    // // ab2.addChild(abc)

    // const abfdas = new TransformNode("");

    // abfdas.add

    // abc.ad

    // this.scene.addSkeleton(abc)

    // return {
    //   id: mesh.uniqueId,
    //   name: mesh.name,
    //   position: mesh.position.asArray() as XYZ,
    //   children: mesh.getChildMeshes().map((child) => this.getTree(child)),
    // };
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
