import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Cursor } from "../features/Drag"
import { Guy } from "../features/Guy";
import { Floor } from "../features/Floor";
import { Chair } from "../features/Furnitures";

export const RagdollPhysicsCanvas = () => {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ position: [-40, 40, 40], fov: 25, near: 1, far: 100 }}
    >
      <color attach="background" args={["#171720"]} />
      <fog attach="fog" args={["#171720", 60, 90]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[-20, -5, -20]} color="red" />
      <RagdollPhysics />
    </Canvas>
  );
};

export const RagdollPhysics = () => {
  return (
    <Physics allowSleep={false} iterations={15} gravity={[0, -200, 0]}>
      <Cursor />
      <Guy rotation={[-Math.PI / 3, 0, 0]} />
      <Floor position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Chair position={[0, 0, -2.52]} />
      {/* <Table position={[8, 0, 0]} />
        <Mug position={[8, 3, 0]} />
        <Lamp position={[0, 15, 0]} /> */}
    </Physics>
  );
};
