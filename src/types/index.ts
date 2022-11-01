import { PointerInfo, Vector3 } from "babylonjs";

export enum ElementId {
  RenderCanvas = "render-canvas",
}
export enum Shader {
  SolidFresnel = "solidFresnel",
  InfiniteGrid = "infiniteGrid",
}

export enum MeshCursor {
  NormalTracer = "NormalTracer",
}

type PointerCallback = (
  pointerInfo: PointerInfo,
  cameraPosition: Vector3
) => void;

export interface CursorCallbacks {
  move: PointerCallback;
  wheel: PointerCallback;
  dragStart: PointerCallback;
  dragEnd: PointerCallback;
}

// The values of these enums must match the actual CSS cursor style

export enum CssCursorStyle {
  Standard = "",
  None = "none",
  NotAllowed = "not-allowed",
  Progress = "progress",
  Grabbing = "grabbing",
}

export type SetCursorStyle = (style: CssCursorStyle) => void;

export type Cursor = MeshCursor | CssCursorStyle;

export interface NormalTracerProperties {
  color: string;
  rimColor: string;
  alpha: number;
  size: number;
}
