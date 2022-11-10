import {
  Engine,
  Scene,
  ArcRotateCamera,
  DirectionalLight,
  Vector3,
  PointerInfo,
  PointerEventTypes,
  HemisphericLight,
  SpotLight,
} from "babylonjs";
import {
  CssCursorStyle,
  CursorCallbacks,
  ScenePreset,
  SetCursorStyle,
} from "../../types";
import { MeshManager } from "../meshManager";

export default class SceneManager {
  private canvas = document.createElement("canvas");
  private engine = new Engine(this.canvas, true);
  private scene = new Scene(this.engine);
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
  private meshManager: MeshManager;

  constructor() {
    this.canvas.style.width = this.canvas.style.height = "100%";
    this.camera.attachControl();
    this.engine.runRenderLoop(() => this.scene.render());
    // new DirectionalLight(
    //   "light",
    //   new Vector3(0, -1, -1).normalize(),
    //   this.scene
    // );

    var light = new HemisphericLight(
      "HemiLight",
      new Vector3(0, 1, 0),
      this.scene
    );
    // new SpotLight(
    //   "",
    //   new Vector3(0, 1, 0),
    //   new Vector3(0, -1, 0),
    //   0,
    //   0,
    //   this.scene
    // );

    this.onPointerObservable = this.onPointerObservable.bind(this);
    this.scene.onPointerObservable.add(this.onPointerObservable);
    this.meshManager = new MeshManager(this.scene, this.camera.position);
  }

  public setPreset(preset: ScenePreset) {
    return this.meshManager.setPreset(preset);
  }

  public clearAllMeshes() {
    this.meshManager.clearAll();
  }

  public get tree() {
    return this.meshManager.tree;
  }

  // Getters and Setters

  public get meshCursors() {
    return this.meshManager.meshCursors;
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
    return this.meshManager.loadAllFiles();
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
    this.cursorCallbacks.dragEnd(pointerInfo, this.camera.position);
  }

  private onPointerDown(pointerInfo: PointerInfo) {
    this.cursorCallbacks.dragStart(pointerInfo, this.camera.position);
  }

  private onPointerWheel(pointerInfo: PointerInfo) {
    this.cursorCallbacks.wheel(pointerInfo, this.camera.position);
  }

  private onPointerMove(pointerInfo: PointerInfo) {
    this.cursorCallbacks.move(pointerInfo, this.camera.position);
  }
}
