import * as THREE from "three";
import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import { EffectGlitch } from "../features/EffectGlitch";
import videoSrc from "../../assets/videos/Redial_Final.mp4";
import blackInVideoSrc from "../../assets/videos/black_in.mp4";
import { useCursor } from "@react-three/drei";

type VideoStatus = "beforeStart" | "blackIn" | "playing";

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
    <Scene />
  </Canvas>
);

const Scene = () => {
  const [zoom, set] = useState(true);
  const [videoStatus, setVideoStatus] = useState<VideoStatus>("beforeStart");
  const startVideo = useCallback(() => {
    setVideoStatus("blackIn");
  }, [zoom, set]);
  return (
    <>
      <color attach="background" args={["#151520"]} />
      <hemisphereLight intensity={0.5} />
      <directionalLight position={[0, 2, 5]} castShadow intensity={1} />
      <group position={[2, -2, 0]}>
        <Transition zoom={zoom} />
        {videoStatus === "playing" && (
          <Video
            position={[-2, 2, 0]}
            rotation={[0, Math.PI / 4, 0]}
            scale={[17, 10, 1]}
          />
        )}
        {(videoStatus === "beforeStart" || videoStatus === "blackIn") && (
          <BlackIn
            meshProps={{
              position: [-2, 2, 0],
              rotation: [0, Math.PI / 4, 0],
              scale: [17, 10, 1],
            }}
            isStart={videoStatus === "blackIn"}
            onEnd={() => setVideoStatus("playing")}
          />
        )}
      </group>
      <Sphere
        startVideo={startVideo}
        isStartVideo={videoStatus === "playing"}
      />
      <EffectGlitch />
    </>
  );
};

const Transition = (props: { zoom: boolean }) => {
  useFrame((state) => {
    state.camera.position.lerp(
      // { x: 50, y: 25, z: props.zoom ? -50 : 50 } as any,
      { x: 50, y: 25, z: 50 } as any,
      0.03
    );
    state.camera.lookAt(0, 0, 0);
  });
  return <></>;
};

function Video(props?: MeshProps) {
  const ref = useRef<THREE.Mesh>(null);
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
    <mesh ref={ref} {...props}>
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

const BlackIn = (props: {
  meshProps: MeshProps;
  isStart: boolean;
  onEnd: () => void;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      src: blackInVideoSrc,
      crossOrigin: "Anonymous",
      loop: false,
      muted: true,
    })
  );
  useEffect(() => {
    /**
     * @see https://developer.mozilla.org/ja/docs/Web/API/HTMLMediaElement/ended_event
     */
    video.onended = (event) => {
      props.onEnd();
    };
    console.info(props.isStart);
    if (props.isStart) {
      void video.play();
    }
  }, [video, props.isStart]);
  return (
    <mesh ref={ref} {...props.meshProps}>
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
};

const Sphere = (props: { startVideo: () => void; isStartVideo: boolean }) => {
  const ref = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);
  useCursor(active);
  useFrame((state) => {
    if (!ref.current?.position) return;
    ref.current.position.y = -7.5 + Math.sin(state.clock.getElapsedTime() / 2);
  });
  return (
    <mesh
      ref={ref}
      receiveShadow
      castShadow
      // onClick={() => set(!zoom)}
      onClick={props.startVideo}
      onPointerOver={() => setActive(true)}
      onPointerOut={() => setActive(false)}
    >
      <sphereGeometry args={[0.8, 64, 64]} />
      <meshStandardMaterial
        color={active ? "lightgreen" : "lightblue"}
        roughness={0}
        metalness={0.25}
      />
    </mesh>
  );
};
