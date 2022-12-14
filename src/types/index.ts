import { PointerInfo, Vector3 } from "babylonjs";
import { CSSProperties } from "react";
import CursorManager from "../babylon/cursorManagers/CursorManager";
import { InfiniteGrid } from "../babylon/gridManagers";

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
  out: () => void;
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

export interface ContainerProps {
  children?: JSX.Element | JSX.Element[] | null;
  style?: CSSProperties;
  id?: string;
}

export enum ImageEXT {
  JPG = ".jpg",
  PNG = ".png",
  JPEG = ".jpeg",
  WEBP = ".webp",
}

export enum Asset3DEXT {
  FBX = ".fbx",
  OBJ = ".obj",
  GLB = ".glb",
  GLTF = ".gltf",
}

export enum CompressedDirectoryEXT {
  ZIP = ".zip",
}

export type EXT = ImageEXT | Asset3DEXT | CompressedDirectoryEXT;

export enum ScenePreset {
  PrimitiveObjects = "PrimitiveObjects",
  Miqote = "Miqote",
}

export enum Primitive {
  Box = "Box",
  Sphere = "Sphere",
  Capsule = "Capsule",
  IcoSphere = "IcoSphere",
}

export type UniqueId = number;

export type XYZ = [number, number, number];

export interface Tree {
  id: UniqueId;
  name: string;
  children: Tree[];
}

export type MeshCursors = Record<MeshCursor, CursorManager>;

export interface EssentialMeshes {
  grid: InfiniteGrid;
}

export enum Asset {
  AnimationGroup = "AnimationGroup",
  Animation = "Animation",
  Camera = "Camera",
  EffectLayer = "EffectLayer",
  Geometry = "Geometry",
  Layer = "Layer",
  LensFlareSystem = "LensFlareSystem",
  Light = "Light",
  Material = "Material",
  Mesh = "Mesh",
  MorphTargetManager = "MorphTargetManager",
  MultiMaterial = "MultiMaterial",
  ParticleSystem = "ParticleSystem",
  PostProcess = "PostProcess",
  PrePassRenderer = "PrePassRenderer",
  ProceduralTexture = "ProceduralTexture",
  ReflectionProbe = "ReflectionProbe",
  RootNode = "RootNode",
  Skeleton = "Skeleton",
  Sound = "Sound",
  SubSurfaceConfiguration = "SubSurfaceConfiguration",
  Texture = "Texture",
  TransformNode = "TransformNode",
}

export enum LibraryModel {
  Miqote = "Miqote",
}
