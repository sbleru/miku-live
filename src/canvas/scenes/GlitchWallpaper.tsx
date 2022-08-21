import * as THREE from "three";
import { useEffect, useState } from "react";
import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import { Effects } from "../features/Effects";
import videoSrc from "../../assets/videos/Redial_Final.mp4"

export const GlitchWallpaper = () => (
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
    <color attach="background" args={["#151520"]} />
    <hemisphereLight intensity={0.5} />
    <directionalLight position={[0, 2, 5]} castShadow intensity={1} />
    <group position={[2, -2, 0]}>
      <Transition />
      <Video
        position={[-2, 4, 0]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[17, 10, 1]}
      />
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

function Video(props?: MeshProps) {
  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      src: videoSrc,
      crossOrigin: "Anonymous",
      loop: true,
      muted: true,
    })
  );
  useEffect(() => void video.play(), [video]);
  return (
    <mesh {...props}>
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
