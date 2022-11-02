import { ElementId } from "./types";
import "babylonjs-loaders";

function App() {
  return (
    <div
      style={{ border: "solid 5px red", width: "80vw", height: "80vh" }}
      id={ElementId.RenderCanvas}
    />
  );
}

export default App;
