import { useBox } from "@react-three/cannon";
import { useRef } from "react";
import { Mesh } from "three";

export function Delimeter({ boxGeometryArgs, ...props }: any) {
  const [ref] = useBox(
    () => ({ type: "Static", args: boxGeometryArgs, ...props }),
    useRef<Mesh>(null),
    [boxGeometryArgs, props],
  );

  return (
    <mesh castShadow receiveShadow ref={ref}>
      <boxGeometry args={boxGeometryArgs} />
      <meshStandardMaterial color="indianred" />
    </mesh>
  );
}
