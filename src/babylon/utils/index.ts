import { AbstractMesh } from "babylonjs";
import { UniqueId } from "../../types";

export function hasShape(mesh: AbstractMesh) {
  return !!mesh.getFacetLocalPositions().length;
}

interface MeshTree {
  id: UniqueId;
  name: string;
  mesh: AbstractMesh;
  children: MeshTree[];
}

export function getMeshTree(mesh: AbstractMesh): MeshTree {
  return {
    id: mesh.uniqueId,
    name: mesh.name,
    mesh,
    children: mesh.getChildMeshes(true).map((child) => getMeshTree(child)),
  };
}
