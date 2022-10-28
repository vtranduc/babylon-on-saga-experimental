import { Effect } from "babylonjs";
import { Shader } from "../types";

import solidFresnelVertexMedia from "../glsl/solidFresnel/vertexShader.glsl";
import solidFresnelFragmentMedia from "../glsl/solidFresnel/fragmentShader.glsl";

interface GlslMedia {
  vertex: string;
  fragment: string;
}

type ShaderMedia = Record<Shader, GlslMedia>;

const media: ShaderMedia = {
  [Shader.SolidFresnel]: {
    vertex: solidFresnelVertexMedia,
    fragment: solidFresnelFragmentMedia,
  },
};

export function loadShaders() {
  const promises = (Object.entries(media) as [Shader, GlslMedia][]).map(
    (entry) => {
      return Promise.all([fetch(entry[1].vertex), fetch(entry[1].fragment)])
        .then((res) => Promise.all([res[0].text(), res[1].text()]))
        .then((shader) => {
          console.log("show the shader result here!", shader);

          Effect.ShadersStore[entry[0] + "VertexShader"] = shader[0];
          Effect.ShadersStore[entry[0] + "FragmentShader"] = shader[1];
        });
    }
  );

  return Promise.all(promises);
}
