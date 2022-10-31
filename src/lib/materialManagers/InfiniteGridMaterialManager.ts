import { Color3, Scene, ShaderMaterial, Vector2, Vector3 } from "babylonjs";
import { Shader } from "../../types";
import MaterialManager from "./MaterialManager";

/**
 * For an infinite grid material to work correct to scale, a plane mesh centered
 * at (0, 0, 0) with the dimension of 2 x 2 must be used.
 */

export class InfiniteGridMaterialManager extends MaterialManager<ShaderMaterial> {
  constructor(name: string, scene: Scene, center: Vector3) {
    const material = new ShaderMaterial(
      name,
      scene,
      {
        vertex: Shader.InfiniteGrid,
        fragment: Shader.InfiniteGrid,
      },
      {
        attributes: ["position", "normal", "uv"],
        uniforms: [
          "world",
          "worldView",
          "worldViewProjection",
          "view",
          "projection",
          "time",
        ],
        needAlphaBlending: true,
      }
    );

    material.backFaceCulling = false;

    material.setVector3("uCenter", center);
    material.setColor3("uMajorColor", new Color3(0, 1, 0));
    material.setColor3("uMinorColor", new Color3(0, 0, 1));
    material.setVector2("uFadeRange", new Vector2(50, 100));
    material.setVector2("uSpacing", new Vector2(0.1, 1));

    super(material);
  }
}
