import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Html,
  OrbitControls,
  useAnimations,
  useCursor,
  useProgress,
} from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader";
import { AnimationClip, PerspectiveCamera, SkinnedMesh } from "three";
import music from "/assets/examples_models_mmd_audios_wavefile_short.mp3";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
  Glitch,
} from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import { Vector2 } from "three";

export const DanceSample = () => (
  <Canvas
    shadows
    gl={{
      logarithmicDepthBuffer: true,
      antialias: false,
      stencil: false,
      depth: false,
    }}
    camera={{ position: [100, 100, 100], fov: 15 }}
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
      <color attach="background" args={["#151520"]} />
      <hemisphereLight intensity={0.5} />
      <directionalLight position={[0, 2, 5]} castShadow intensity={1} />
      <group position={[0, -10, 0]}>
        {status === "playing" && (
          <MmdModel
            modelUrl="/assets/miku_v2.pmd"
            vmdUrl="/assets/wavefile_v2.vmd"
          />
        )}
      </group>
      <PlaySphere startVideo={play} />
      <Effects />
      <OrbitControls />
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
  const [camera] = useState(
    new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)
  );

  useEffect(
    () =>
      void new MMDLoader().loadWithAnimation(modelUrl, vmdUrl, (model) => {
        model.animation.name = "dance";
        model.mesh.animations = [model.animation];
        set(model.mesh);
      }),
    [modelUrl]
  );

  useEffect(
    () =>
      void new MMDLoader().loadAnimation(
        "/assets/wavefile_camera.vmd",
        camera,
        (object: any) => {
          object.name = "camera";
          camera.animations = [object];
        }
      ),
    [camera]
  );

  /**
   * useLoader使う方法ないか
   */
  // const loader = new MMDLoader().loadWithAnimation(modelUrl, vmdUrl, (model) => {
  //   model.mesh.animations = [model.animation];
  // })
  // const mmd = useLoader(loader, modelUrl);
  // return model ? <primitive object={model} dispose={null} /> : null;

  return model ? <MmdModelWithAnimation model={model} camera={camera} /> : null;

  // const mmd = useLoader(MMDLoader, url);
  // return <primitive object={mmd} dispose={null} />;
};

const MmdModelWithAnimation = ({
  model,
  camera,
}: {
  model: SkinnedMesh;
  camera: PerspectiveCamera;
}) => {
  const { modelRef, cameraRef } = useAnimation({ model, camera });
  return (
    <>
      <primitive ref={modelRef} object={model} dispose={null} />
      {/* <perspectiveCamera ref={cameraRef} /> */}
    </>
  );
};

const useAnimation = ({
  model,
  camera,
}: {
  model: SkinnedMesh;
  camera: PerspectiveCamera;
}) => {
  const modelAnimations = useAnimations(model.animations);
  const cameraAnimations = useAnimations(camera.animations);
  const [audio] = useState(new Audio(music));
  /**
   * Start animation
   */
  useEffect(() => {
    modelAnimations.actions?.dance?.play();
  });

  useEffect(() => {
    cameraAnimations.actions?.camera?.play();
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
    modelRef: modelAnimations.ref,
    cameraRef: cameraAnimations.ref,
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
    <group position={[0, -15, 0]}>
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
    </group>
  );
};

const vector2 = (x: number, y: number) => new Vector2(x, y);

export const Effects = () => {
  return (
    <EffectComposer disableNormalPass>
      <DepthOfField
        focusDistance={0}
        focalLength={0.02}
        bokehScale={2}
        height={480}
      />
      {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} /> */}
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
      {/* <Glitch
        delay={vector2(1.5, 3.5)} // min and max glitch delay
        duration={vector2(0.6, 1.0)} // min and max glitch duration
        strength={vector2(0.3, 1.0)} // min and max glitch strength
        mode={GlitchMode.SPORADIC} // glitch mode
        active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
        ratio={0.85} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
      /> */}
    </EffectComposer>
  );
};

// export const Setup = ({
//   children,
//   cameraFov = 75,
//   cameraPosition = new Vector3(-5, 5, 5),
//   controls = true,
//   lights = true,
//   ...restProps
// }: Props) => (
//   <Canvas shadows camera={{ position: cameraPosition, fov: cameraFov }} {...restProps}>
//     {children}
//     {lights && (
//       <>
//         <ambientLight intensity={0.8} />
//         <pointLight intensity={1} position={[0, 6, 0]} />
//       </>
//     )}
//     {controls && <OrbitControls />}
//   </Canvas>
// )
