import * as THREE from "three";
import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, useCursor } from "@react-three/drei";
import { Effects } from "./Effects";
import { RagdollPhysics } from "./RagdollPhysics";

export const SSRTest = () => (
  <Canvas
    shadows
    gl={{
      logarithmicDepthBuffer: true,
      antialias: false,
      stencil: false,
      depth: false,
    }}
    camera={{ position: [250, 225, 250], fov: 15 }}
  >
    {/* <PerspectiveCamera makeDefault position={[50, 25, 50]} fov={15} /> */}
    <color attach="background" args={["#151520"]} />
    <hemisphereLight intensity={0.5} />
    <directionalLight position={[0, 2, 5]} castShadow intensity={1} />
    <group position={[2, -2, 0]}>
      {/* <Sphere /> */}
      <Transition />
      <Video />
      <group rotation={[0, -Math.PI / 4, 0]}>
        <RagdollPhysics />
      </group>
    </group>
    <Effects />
  </Canvas>
);

const Transition = () => {
  useFrame((state) => {
    state.camera.position.lerp({ x: 50, y: 25, z: 50 } as any, 0.03);
    state.camera.lookAt(0, 0, 0);
  });
  return <></>;
};

function Sphere() {
  const ref = useRef<any>();
  const [active, setActive] = useState(false);
  const [zoom, set] = useState(true);
  useCursor(active);
  useFrame((state) => {
    ref.current.position.y = Math.sin(state.clock.getElapsedTime() / 2);
    state.camera.position.lerp(
      { x: 50, y: 25, z: zoom ? 50 : -50 } as any,
      0.03
    );
    state.camera.lookAt(0, 0, 0);
  });
  return (
    <mesh
      ref={ref}
      receiveShadow
      castShadow
      onClick={() => set(!zoom)}
      onPointerOver={() => setActive(true)}
      onPointerOut={() => setActive(false)}
    >
      <sphereGeometry args={[0.8, 64, 64]} />
      <meshStandardMaterial
        color={active ? "hotpink" : "lightblue"}
        // clearcoat={1}
        // clearcoatRoughness={0}
        roughness={0}
        metalness={0.25}
      />
    </mesh>
  );
}

const Plane = ({ color, ...props }: any) => (
  <RoundedBox
    receiveShadow
    castShadow
    smoothness={10}
    radius={0.015}
    {...props}
  >
    <meshStandardMaterial
      color={color}
      envMapIntensity={0.5}
      roughness={0}
      metalness={0}
    />
  </RoundedBox>
);

function Video() {
  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      // src: "/drei_r.mp4",
      // src: " https://www.youtube.com/watch?v=SlRfwbD2riE"
      src: "/Redial_Final.mp4",
      crossOrigin: "Anonymous",
      loop: true,
      muted: true,
    })
  );
  useEffect(() => void video.play(), [video]);
  return (
    <mesh
      position={[-2, 4, 0]}
      rotation={[0, Math.PI / 2, 0]}
      scale={[17, 10, 1]}
    >
      <planeGeometry />
      <meshBasicMaterial toneMapped={false}>
        <videoTexture
          attach="map"
          args={[video]}
          encoding={THREE.sRGBEncoding}
        />
      </meshBasicMaterial>
    </mesh>
  );
}
