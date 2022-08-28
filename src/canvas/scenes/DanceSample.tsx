import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useAnimations, useCursor, useProgress } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader";
import { SkinnedMesh } from "three";
import music from "/assets/examples_models_mmd_audios_wavefile_short.mp3";

export const DanceSample = () => (
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
    <Suspense fallback={<Loader />}>
      <Scene />
    </Suspense>
  </Canvas>
);

const Loader = () => {
  const { active, progress, errors, item, loaded, total } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

const Scene = () => {
  const [status, setStatus] = useState("beforePlay");
  const play = useCallback(() => {
    setStatus("playing");
  }, []);
  return (
    <>
      {status === "playing" && (
        <MmdModel
          modelUrl="/assets/miku_v2.pmd"
          vmdUrl="/assets/wavefile_v2.vmd"
        />
      )}

      <PlaySphere startVideo={play} />
    </>
  );
};

/**
 * Read mmd model
 * @see https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models
 */
const MmdModel = ({
  modelUrl,
  vmdUrl,
}: {
  modelUrl: string;
  vmdUrl: string;
}) => {
  const [model, set] = useState<SkinnedMesh>();

  useEffect(
    () =>
      void new MMDLoader().loadWithAnimation(modelUrl, vmdUrl, (model) => {
        console.info(model);
        model.animation.name = "dance";
        model.mesh.animations = [model.animation];
        set(model.mesh);
      }),
    [modelUrl]
  );

  /**
   * useLoader使う方法ないか
   */
  // const loader = new MMDLoader().loadWithAnimation(modelUrl, vmdUrl, (model) => {
  //   model.mesh.animations = [model.animation];
  // })
  // const mmd = useLoader(loader, modelUrl);
  // return model ? <primitive object={model} dispose={null} /> : null;

  return model ? <MmdModelWithAnimation model={model} /> : null;

  // const mmd = useLoader(MMDLoader, url);
  // return <primitive object={mmd} dispose={null} />;
};

const MmdModelWithAnimation = ({ model }: { model: SkinnedMesh }) => {
  const { ref } = useAnimation({ model });
  return <primitive ref={ref} object={model} dispose={null} />;
};

const useAnimation = ({ model }: { model: SkinnedMesh }) => {
  const { ref, mixer, names, actions, clips } = useAnimations(model.animations);
  const [audio] = useState(new Audio(music));
  /**
   * Start animation
   */
  useEffect(() => {
    (actions?.dance as any)?.play();
  });

  /**
   * Start audio
   */
  useEffect(() => {
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, (160 / 30) * 1000));
      await audio.play();
      // audio.volume = 0.01;
    })();
  });

  return {
    ref,
  };
};

const PlaySphere = (props: { startVideo: () => void }) => {
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
