import { Effect } from "babylonjs";
import { Shader } from "../types";

import solidFresnelVertexMedia from "../glsl/solidFresnel/vertexShader.glsl";
import solidFresnelFragmentMedia from "../glsl/solidFresnel/fragmentShader.glsl";

import infiniteGridVertexMedia from "../glsl/infiniteGrid/vertexShader.glsl";
import infiniteGridFragmentMedia from "../glsl/infiniteGrid/fragmentShader.glsl";

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
  [Shader.InfiniteGrid]: {
    vertex: infiniteGridVertexMedia,
    fragment: infiniteGridFragmentMedia,
  },
};

export function loadShaders() {
  const promises = (Object.entries(media) as [Shader, GlslMedia][]).map(
    (entry) => {
      return Promise.all([fetch(entry[1].vertex), fetch(entry[1].fragment)])
        .then((res) => Promise.all([res[0].text(), res[1].text()]))
        .then((shader) => {
          Effect.ShadersStore[entry[0] + "VertexShader"] = shader[0];
          Effect.ShadersStore[entry[0] + "FragmentShader"] = shader[1];
        });
    }
  );

  return Promise.all(promises);
}
