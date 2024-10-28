import { useBox } from "@react-three/cannon";

// @ts-ignore
export function Delimiter({ args, position, rotation }) {
  const [ref] = useBox(() => ({
    mass: 0,
    args,
    position,
    rotation,
  }));

  return (
    // @ts-ignore
    <mesh ref={ref} position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="indianred" />
    </mesh>
  );
}
