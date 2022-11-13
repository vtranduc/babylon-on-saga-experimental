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
  Camera,
  ArcRotateCamera,
  DirectionalLight,
  Light,
  Nullable,
  KeepAssets,
  AssetContainer,
  ContainerAssetTask,
  Engine,
} from "babylonjs";
import { disposeEmitNodes } from "typescript";
import {
  EssentialMeshes,
  MeshCursor,
  MeshCursors,
  Primitive,
  ScenePreset,
  Tree,
  UniqueId,
  XYZ,
} from "../../types";
import { AssetBuilder, transfer123 } from "../assetBuilder";
import { NormalTracerManager } from "../cursorManagers";
import { InfiniteGrid } from "../gridManagers";
//   import { AssetLoader } from "../assetLoader";
//   import { MeshHelper } from "../meshManager";
// import { MeshCreator } from "./MeshCreator";
// import { AssetContainer, KeepAssets, Scene } from "babylonjs";

export class AssetManager2 {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public async setPreset(preset: ScenePreset) {}

  clearAll() {}

  get tree() {
    return [];
  }

  get cursors() {
    return {
      [MeshCursor.NormalTracer]: new NormalTracerManager(
        MeshCursor.NormalTracer,
        this.scene
      ),
    };
  }
}

export class AssetManager {
  private keepAssets = new KeepAssets();
  private scene: Scene;
  private disposeContainer: AssetContainer;
  private meshCursors: MeshCursors;

  constructor(scene: Scene) {
    this.scene = scene;
    this.disposeContainer = new AssetContainer(this.scene);

    const { cursors } = this.createKeepAssets();
    this.meshCursors = cursors;
  }

  public get tree(): Tree[] {
    // console.log("getting tree but also show bones: ", this.scene.skeletons);

    // return this.firstGenerationMeshes.map((mesh) => this.getTree(mesh));

    const keepAssetNodeIds = this.keepAssetNodeUniqueIds;

    return this.scene
      .getNodes()
      .filter((node) => !keepAssetNodeIds.includes(node.uniqueId))
      .map((node) => this.getTree(node, keepAssetNodeIds));
    //   .map((node) => ({
    //     id: node.uniqueId,
    //     name: node.name,
    //     // position: node.po,
    //     children: node
    //       .getChildren()
    //       .filter((child) => !keepAssetNodeIds.includes(child.uniqueId))
    //       .map((child) => this.getTree(child, keepAssetNodeIds)),
    //   }));
  }

  //   private get firstGenerationMeshes(): Node[] {
  //     return this.scene
  //       .getNodes()
  //       .filter((node) => this.isInteractive(node) && !node.parent);
  //   }

  private getTree(node: Node, omits: UniqueId[] = []): Tree {
    return {
      id: node.uniqueId,
      name: node.name,
      children: node
        .getChildren()
        .filter((child) => !omits.includes(child.uniqueId))
        .map((child) => this.getTree(child, omits)),
    };
  }

  private get keepAssetNodeUniqueIds() {
    return this.keepAssets.getNodes().map((node) => node.uniqueId);
  }

  //   private isKeepAssetNode() {
  //     this.keepAssets.getNodes().includes()
  //   }

  public async setPreset(preset: ScenePreset) {
    // this.clearAll();

    switch (preset) {
      case ScenePreset.PrimitiveObjects:
        this.primitivePreset();
        break;
      case ScenePreset.Miqote:
        // await this.miqotePreset();
        break;
      default:
    }
  }

  private primitivePreset() {
    const capsule = AssetBuilder.createPrimitive(Primitive.Capsule, {
      position: [1, 1, 1],
    });
    const box = AssetBuilder.createPrimitive(Primitive.Box, {
      position: [-1, 1, 1],
    });
    const sphere = AssetBuilder.createPrimitive(Primitive.Sphere, {
      position: [-1, 1, -1],
    });
    const icoSphere = AssetBuilder.createPrimitive(Primitive.IcoSphere, {
      position: [1, 1, -1],
    });

    [capsule, box, sphere, icoSphere].forEach((mesh) => {
      //   this.enablePointer(mesh.uniqueId);
    });
  }

  public get cursors() {
    return this.meshCursors;
  }

  public clearAll() {
    console.log(
      "start talking abount ---> ",
      this.keepAssets.meshes,
      this.keepAssets,
      this.scene.meshes.map((node) => node.uniqueId),
      this.disposeContainer.meshes.map((node) => node.uniqueId)
    );

    // this.disposeContainer.addAllToScene();

    this.disposeContainer.moveAllFromScene(this.keepAssets);
    // this.disposeContainer.removeAllFromScene();

    // const keepAsset2 = new KeepAssets();
    // keepAsset2.cameras.push(this.keepAssets.cameras[0]);

    // const karanoContainer = new AssetContainer(this.scene);
    // karanoContainer.moveAllFromScene(keepAsset2);

    // this.disposeContainer.dispose();

    // karanoContainer.addAllToScene();

    // this.scene.addMesh(karanoContainer.meshes[0]);

    // this.scene.addMesh(karanoContainer.meshes[1]);

    // console.log(
    //   "show the karano --------L ",
    //   karanoContainer.meshes.map((mesh) => mesh.isDisposed())
    // );

    // // this.disposeContainer.dispose();

    // // this.disposeContainer.dispose();

    // // this.disposeContainer.

    // // this.disposeContainer.dispose();

    // console.log(
    //   "after",
    //   this.keepAssets.meshes,
    //   this.scene.meshes.map((node) => node.uniqueId),
    //   this.disposeContainer.meshes.map((node) => node.uniqueId)
    // );
  }

  private createKeepAssets() {
    console.log("create asset here");

    const canvas = document.createElement("canvas");
    const engine = new Engine(canvas, false);
    // const scene = this.createScene(this.engine);

    const scene = new Scene(engine);

    const camera = new ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      Math.PI / 4,
      20,
      Vector3.Zero(),
      scene
    );
    const light = new DirectionalLight("light", new Vector3(0, -1, 0), scene);
    const cursors = {
      [MeshCursor.NormalTracer]: new NormalTracerManager(
        MeshCursor.NormalTracer,
        scene
      ),
    };
    const meshes: EssentialMeshes = {
      grid: new InfiniteGrid("infiniteGrid", scene, camera.position),
    };

    // Mesh

    const box = MeshBuilder.CreateBox("", undefined, this.scene);

    const tempContainer = new AssetContainer(this.scene);

    transfer123(tempContainer, this.keepAssets, this.scene);

    // tempContainer.moveAllFromScene(this.keepAssets);

    // this.keepAssets

    // tempContainer.scene = this.scene;

    // this.scene.addMesh(box);

    // tempContainer.addAllToScene();

    this.scene.removeMesh(box);

    console.log(
      "show keep assets ---> ",
      this.keepAssets,
      this.scene.geometries,
      this.scene.meshes
    );

    // this.keepAssets.cameras.push(camera);
    // this.keepAssets.lights.push(light);
    // Object.values({ ...cursors, ...meshes }).forEach((meshCursor) =>
    //   meshCursor.keepAsset(this.keepAssets)
    // );

    return { camera, light, cursors, meshes };
  }
}
