import {
  Engine,
  Scene,
  ArcRotateCamera,
  DirectionalLight,
  Vector3,
  PointerInfo,
  PointerEventTypes,
  AssetContainer,
  MeshBuilder,
  KeepAssets,
} from "babylonjs";
import {
  CssCursorStyle,
  CursorCallbacks,
  ScenePreset,
  SetCursorStyle,
} from "../../types";
import { AssetBuilder } from "../assetBuilder";
import { AssetManager } from "../assetManager";
import { MeshManager } from "../meshManager";

export default class SceneManager {
  private canvas = document.createElement("canvas");
  private engine = new Engine(this.canvas, true);
  private scene = this.createScene(this.engine);
  private camera = new ArcRotateCamera(
    "Camera",
    -Math.PI / 2,
    Math.PI / 4,
    20,
    Vector3.Zero(),
    this.scene
  );
  private resizeObserver = new ResizeObserver(() => this.engine.resize());
  private container: HTMLElement | null = null;
  private cursorCallbacks: CursorCallbacks = this.defaultCursorCallbacks;
  // private meshManager: MeshManager;

  private assetManager: AssetManager;

  constructor() {
    this.canvas.style.width = this.canvas.style.height = "100%";
    // this.camera.attachControl();
    this.engine.runRenderLoop(() => this.scene.render());
    new DirectionalLight("light", new Vector3(0, -1, 0), this.scene);
    this.onPointerObservable = this.onPointerObservable.bind(this);
    this.scene.onPointerObservable.add(this.onPointerObservable);
    // this.meshManager = new MeshManager(this.scene, this.camera.position);

    // const container1 = new AssetContainer(this.scene);

    // // // const container2 = new AssetContainer(this.scene);

    const keepAssets = new KeepAssets();
    // keepAssets.

    // // container1.moveAllFromScene(keepAssets);

    // const box = MeshBuilder.CreateBox("");

    // console.log("show the box ---> ", box, box.geometry);

    // const sphere = MeshBuilder.CreateSphere("");

    // keepAssets.meshes.push(box);

    // // keepAssets.

    // if (box.geometry) keepAssets.geometries.push(box.geometry);

    // // sphere.position.x = 5;

    // container1.moveAllFromScene(keepAssets);

    // container1.dispose();

    // // // container1.unique

    // // console.log(
    // //   "meshes in sscne: ",
    // //   this.scene.getNodes(),
    // //   this.scene.getNodes().map((node) => node.uniqueId),
    // //   this.camera.uniqueId
    // // );
    // // console.log("nodes in container: ", container1.getNodes());

    this.assetManager = new AssetManager(this.scene);
  }

  private createScene(engine: Engine) {
    const scene = new Scene(this.engine);
    AssetBuilder.scene = scene;
    return scene;
  }

  public setPreset(preset: ScenePreset) {
    return this.assetManager.setPreset(preset);
  }

  public clearAllMeshes() {
    this.assetManager.clearAll();
  }

  public get tree() {
    return this.assetManager.tree;
  }

  // Getters and Setters

  public get meshCursors() {
    return this.assetManager.cursors;
  }

  // Public methods

  // Canvas handlers

  public setCanvasContainer(element: HTMLElement) {
    let cursorStyle: string = CssCursorStyle.Standard;
    if (this.container) {
      this.container.removeChild(this.canvas);
      this.resizeObserver.disconnect();
      cursorStyle = this.container.style.cursor;
      this.container.style.cursor = CssCursorStyle.Standard;
    }
    this.container = element;
    this.container.style.cursor = cursorStyle;
    this.resizeObserver.observe(this.container);
    this.container.appendChild(this.canvas);
    this.engine.resize();
  }

  // CursorHandlers

  public loadCursorCallbacks(
    getCallbacks: (setCursorStyle: SetCursorStyle) => Partial<CursorCallbacks>
  ) {
    this.cursorCallbacks = {
      ...this.defaultCursorCallbacks,
      ...getCallbacks(this.setCursorStyle),
    };
  }

  public resetCursor() {
    if (this.container) this.container.style.cursor = CssCursorStyle.Standard;
    this.cursorCallbacks = this.defaultCursorCallbacks;
  }

  // Load all files in the store

  public loadAllFiles() {
    // return this.meshManager.loadAllFiles();
  }

  // Utils

  // Pointer utils

  private get setCursorStyle(): SetCursorStyle {
    return (style: CssCursorStyle) => {
      if (!this.container || this.container.style.cursor === style) return;
      this.container.style.cursor = style;
    };
  }

  private get defaultCursorCallbacks(): CursorCallbacks {
    return {
      move: () => {},
      wheel: () => {},
      dragStart: () => {},
      dragEnd: () => {},
    };
  }

  private onPointerObservable(pointerInfo: PointerInfo) {
    switch (pointerInfo.type) {
      case PointerEventTypes.POINTERDOWN:
        this.onPointerDown(pointerInfo);
        break;
      case PointerEventTypes.POINTERUP:
        this.onPointerUp(pointerInfo);
        break;
      case PointerEventTypes.POINTERWHEEL:
        this.onPointerWheel(pointerInfo);
        break;
      case PointerEventTypes.POINTERMOVE:
        this.onPointerMove(pointerInfo);
        break;
      default:
    }
  }

  private onPointerUp(pointerInfo: PointerInfo) {
    // this.cursorCallbacks.dragEnd(pointerInfo, this.camera.position);
  }

  private onPointerDown(pointerInfo: PointerInfo) {
    // this.cursorCallbacks.dragStart(pointerInfo, this.camera.position);
  }

  private onPointerWheel(pointerInfo: PointerInfo) {
    // this.cursorCallbacks.wheel(pointerInfo, this.camera.position);
  }

  private onPointerMove(pointerInfo: PointerInfo) {
    // this.cursorCallbacks.move(pointerInfo, this.camera.position);
  }
}
