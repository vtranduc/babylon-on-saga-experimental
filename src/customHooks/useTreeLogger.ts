import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../reducer";

export function useTreeLogger() {
  const tree = useSelector((state: RootState) => state.scene.tree);
  useEffect(() => {
    console.log(`%cTree`, "background: #222; color: #bada55", tree);
  }, [tree]);
}
