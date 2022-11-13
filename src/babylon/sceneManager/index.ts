import { Engine, Scene, PointerInfo, PointerEventTypes } from "babylonjs";
import {
  CssCursorStyle,
  CursorCallbacks,
  ScenePreset,
  SetCursorStyle,
} from "../../types";
import { SceneAssetManager } from "../SceneAssetManager";

export default class SceneManager {
  private canvas = document.createElement("canvas");
  private engine = new Engine(this.canvas, true);
  private scene = new Scene(this.engine);
  private resizeObserver = new ResizeObserver(() => this.engine.resize());
  private container: HTMLElement | null = null;
  private cursorCallbacks: CursorCallbacks = this.defaultCursorCallbacks;
  private assetManager: SceneAssetManager;

  constructor() {
    this.canvas.style.width = this.canvas.style.height = "100%";
    this.engine.runRenderLoop(() => this.scene.render());
    this.onPointerObservable = this.onPointerObservable.bind(this);
    this.scene.onPointerObservable.add(this.onPointerObservable);
    this.assetManager = new SceneAssetManager(this.scene);
  }

  public loadLibrary() {
    return this.assetManager.loadLibrary();
  }

  public keepAllAssets() {
    this.assetManager.keepAllAssets();
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
    return this.assetManager.loadAllFiles();
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
    this.cursorCallbacks.dragEnd(pointerInfo, this.assetManager.cameraPosition);
  }

  private onPointerDown(pointerInfo: PointerInfo) {
    this.cursorCallbacks.dragStart(
      pointerInfo,
      this.assetManager.cameraPosition
    );
  }

  private onPointerWheel(pointerInfo: PointerInfo) {
    this.cursorCallbacks.wheel(pointerInfo, this.assetManager.cameraPosition);
  }

  private onPointerMove(pointerInfo: PointerInfo) {
    this.cursorCallbacks.move(pointerInfo, this.assetManager.cameraPosition);
  }
}
