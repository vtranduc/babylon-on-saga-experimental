import { Material, Mesh } from "babylonjs";

export default abstract class MaterialManager<T extends Material> {
  protected material: T;

  constructor(material: T) {
    this.material = material;
  }

  public get alpha() {
    return this.material.alpha;
  }

  public set alpha(input: number) {
    this.material.alpha = Math.max(0, Math.min(1, input));
  }

  public apply(mesh: Mesh) {
    mesh.material = this.material;
  }
}
