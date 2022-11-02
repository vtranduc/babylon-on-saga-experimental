import { ElementId } from "./types";
import { DragAndDrop } from "./view";
import "babylonjs-loaders";

function App() {
  return (
    <DragAndDrop
      style={{ border: "solid 5px red", width: "80vw", height: "80vh" }}
      id={ElementId.RenderCanvas}
    />
  );
}

export default App;
