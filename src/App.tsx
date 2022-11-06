import { ElementId, ScenePreset } from "./types";
import { DragAndDrop } from "./view";
import "babylonjs-loaders";
import { useDispatch } from "react-redux";
import { setPreset } from "./reducer";

function App() {
  const dispatch = useDispatch();

  return (
    <>
      <DragAndDrop
        style={{ border: "solid 5px red", width: "80vw", height: "80vh" }}
        id={ElementId.RenderCanvas}
      />

      <button onClick={() => dispatch(setPreset(ScenePreset.Miqote))}>
        Change preset
      </button>

      <p>
        Drag and drop and glb file or folder containing gltf and all of its
        dependencies to view them!
      </p>
    </>
  );
}

export default App;
