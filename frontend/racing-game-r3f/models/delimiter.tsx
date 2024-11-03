import { useBox, useCylinder } from "@react-three/cannon";

function LineBarrier({ args, position, rotation }: any) {
  const [ref] = useBox(() => ({
    mass: 0,
    args,
    position,
    rotation,
  }));
  return (
    // @ts-ignore
    <mesh ref={ref} position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="indianred" />
    </mesh>
  );
}

function CurvedBarrier({ position, args }: any) {
  const [ref] = useCylinder(() => ({ mass: 0, position, args }));
  return (
    // @ts-ignore
    <mesh position={position} ref={ref}>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color="indianred" />
    </mesh>
  );
}

export function Delimiter() {
  return (
    <>
      <LineBarrier
        args={[450, 2, 2]}
        position={[-95, 0, 200]}
        rotation={[0, Math.PI / 7, 0]}
      />

      {/* <LineBarrier
        args={[100, 2, 2]}
        position={[-50, 0, 182]}
        rotation={[0, Math.PI / 8, 0]}
      /> */}

      <CurvedBarrier
        position={[105, 0, 80]}
        // args={[20, 20, 25, 32, 8, false, 0]}
      />

      {/* --- debug from plane  --- */}

      {/* <LineBarrier
        args={[50, 500, 2]}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />

      <LineBarrier
        args={[50, 500, 2]}
        position={[-70, 0, 200]}
        rotation={[0, Math.PI / 7, 0]}
      /> */}
    </>
  );
}
