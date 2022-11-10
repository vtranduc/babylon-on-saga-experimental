import { ElementId, ScenePreset } from "./types";
import { DragAndDrop } from "./view";
import "babylonjs-loaders";
import { useDispatch } from "react-redux";
import { clearAllMeshes, setPreset } from "./reducer";
import { CSSProperties } from "react";

// import * as AdobeViewer from "@dimension/adobe-3d-viewer";

const buttonStyle: CSSProperties = { margin: "10px 10px" };

function App() {
  const dispatch = useDispatch();

  return (
    <>
      <DragAndDrop
        style={{ border: "solid 5px red", width: "80vw", height: "80vh" }}
        id={ElementId.RenderCanvas}
      />

      <div style={{ margin: "10px 0px" }}>
        <button onClick={() => dispatch(clearAllMeshes())} style={buttonStyle}>
          CLEAR ALL
        </button>
        <button
          onClick={() => dispatch(setPreset(ScenePreset.PrimitiveObjects))}
          style={buttonStyle}
        >
          Primitive preset
        </button>
        <button
          onClick={() => dispatch(setPreset(ScenePreset.Miqote))}
          style={buttonStyle}
        >
          Miqo'te preset
        </button>

        <h3>How to use</h3>

        <p>
          Drag and drop and glb file or folder containing gltf and all of its
          dependencies to view them!
        </p>
      </div>
    </>
  );
}

export default App;
