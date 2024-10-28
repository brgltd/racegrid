import { useBox } from "@react-three/cannon";
import { useRef } from "react";
import type { Mesh } from "three";

// import type { BoxProps } from '@react-three/cannon'

// export function Goal({ args = [1, 1, 1], ...props }: BoxProps): null {
//   useBox(() => ({ isTrigger: true, args, userData: { trigger: true }, ...props }), undefined, [args, props])
//   return null
// }

export function Goal({ args, ...props }: BoxProps) {
  const [ref] = useBox(
    () => ({ type: "Static", args, ...props }),
    useRef<Mesh>(null),
    [args, props],
  );

  return (
    <mesh castShadow receiveShadow ref={ref}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="indianred" />
    </mesh>
  );
}
