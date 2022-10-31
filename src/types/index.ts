import { PointerInfo } from "babylonjs";

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

export interface CursorCallbacks {
  move: (pointerInfo: PointerInfo) => void;
}

export enum CssCursorStyle {
  Standard = "",
  None = "none",
  NotAllowed = "not-allowed",
  Progress = "Progress",
}

export type SetCursorStyle = (style: CssCursorStyle) => void;

export type Cursor = MeshCursor | CssCursorStyle;
