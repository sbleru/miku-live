import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Html,
  MeshReflectorMaterial,
  OrbitControls,
  Sparkles,
  useAnimations,
  useCursor,
  useProgress,
  useTexture,
} from "@react-three/drei";
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader";
import { PerspectiveCamera, RepeatWrapping, SkinnedMesh, Vector3 } from "three";
import music from "/assets/examples_models_mmd_audios_wavefile_short.mp3";
import {
  EffectComposer,
  DepthOfField,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { Vector2 } from "three";
import { useEvent, useKey } from "react-use";

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
  const [status, setStatus] = useState("playing");
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
      <ReflectionFloor position={[0, -11, 0]} />
      <StageSparkles />
      {/* <PlaySphere startVideo={play} /> */}
      <Effects />
      <AnimationCamera />
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

  return model ? <MmdModelWithAnimation model={model} /> : null;

  // const mmd = useLoader(MMDLoader, url);
  // return <primitive object={mmd} dispose={null} />;
};

const MmdModelWithAnimation = ({ model }: { model: SkinnedMesh }) => {
  const { modelRef } = useAnimation({ model });
  return (
    <>
      <primitive ref={modelRef} object={model} dispose={null} />
      {/* <perspectiveCamera ref={cameraRef} /> */}
    </>
  );
};

const useAnimation = ({ model }: { model: SkinnedMesh }) => {
  const modelAnimations = useAnimations(model.animations);
  const [audio] = useState(new Audio(music));
  const [start, setStart] = useState(false);
  const [startSP, setStartSP] = useState(false);

  /**
   * FIXME 初期ポーズを1フレーム目にしたい
   */
  // useEffect(() => {
  //   if (modelAnimations.actions?.dance) {
  //     modelAnimations.actions?.dance?.play();
  //     modelAnimations.actions.dance.paused = true;
  //   }
  // });

  /**
   * Toggle animation and audio
   */
  const togglePlay = useCallback(() => {
    const startAudio = async () => {
      await new Promise((resolve) => setTimeout(resolve, (160 / 30) * 1000));
      await audio.play();
    };
    if (modelAnimations.actions?.dance) {
      if (start) {
        /**
         * Toggle animation
         */
        modelAnimations.actions.dance.paused =
          !modelAnimations.actions.dance.paused;
        /**
         * Toggle audio
         */
        audio.paused ? audio.play() : audio.pause();
      } else {
        startAudio();
        modelAnimations.actions?.dance?.play();
        setStart(true);
      }
    }
  }, [modelAnimations.actions?.dance, start, setStart, audio]);
  /**
   * Can play or pause by pressing space key
   */
  useKey("p", togglePlay, {}, [togglePlay]);

  useEvent("touchstart", (e) => {
    if (startSP) return;
    togglePlay();
    setStartSP(true);
  });

  return {
    modelRef: modelAnimations.ref,
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

const vector3 = (x: number, y: number, z: number) => new Vector3(x, y, z);

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

const StageSparkles = () => {
  const size = 100;
  const amount = 100;
  const sizes = useMemo(() => {
    return new Float32Array(
      Array.from({ length: amount }, () => Math.random() * size)
    );
  }, [size, amount]);
  return (
    <Sparkles
      opacity={1}
      speed={1}
      noise={1}
      size={sizes}
      count={amount}
      scale={[100, 100, 100]}
      color={"lightgreen"}
      matrixWorldAutoUpdate={undefined}
      getObjectsByProperty={undefined}
    />
  );
};

/**
 * @see https://github.com/pmndrs/drei#meshreflectormaterial
 */
const ReflectionFloor = ({
  position,
  blur,
  depthScale,
  distortion,
  normalScale,
  reflectorOffset,
}: {
  position?: [number, number, number];
  blur?: [number, number];
  depthScale?: number;
  distortion?: number;
  normalScale?: number;
  reflectorOffset?: number;
}) => {
  const roughness = useTexture("assets/roughness_floor.jpeg");
  const normal = useTexture("assets/NORM.jpg");
  const distortionMap = useTexture("assets/dist_map.jpeg");
  const _normalScale = useMemo(
    () => new Vector2(normalScale || 0),
    [normalScale]
  );
  useEffect(() => {
    distortionMap.wrapS = distortionMap.wrapT = RepeatWrapping;
    distortionMap.repeat.set(4, 4);
  }, [distortionMap]);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      position={position || [0, 0, 0]}
    >
      <circleGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        resolution={1024}
        mirror={0.75}
        mixBlur={10}
        mixStrength={2}
        blur={blur || [0, 0]}
        minDepthThreshold={0.8}
        maxDepthThreshold={1.2}
        depthScale={depthScale || 0}
        depthToBlurRatioBias={0.2}
        // debug={0}
        distortion={distortion || 0}
        distortionMap={distortionMap}
        color="#a0a0a0"
        metalness={0.5}
        roughnessMap={roughness}
        roughness={1}
        normalMap={normal}
        normalScale={_normalScale}
        reflectorOffset={reflectorOffset}
      />
    </mesh>
  );
};

const AnimationCamera = () => {
  const [pressedKeyCode, setPressedKeyCode] = useState("");
  const [pressedSpaceKey, setPressedSpaceKey] = useState(false);

  useKey(
    (e) => {
      setPressedKeyCode(e.code);
      switch (e.code) {
        case "Space":
          setPressedSpaceKey(true);
          break;
        default:
          break;
      }
      return true;
    },
    void 0,
    {},
    [setPressedKeyCode, setPressedSpaceKey]
  );

  /**
   *
   */
  useEvent("touchstart", (e) => {
    setPressedKeyCode("Space");
    setPressedSpaceKey(true);
  });

  useFrame((state) => {
    switch (pressedKeyCode) {
      case "KeyA":
        state.camera.position.lerp(vector3(0, 0, 90), 0.03);
        break;
      case "KeyS":
        state.camera.position.lerp(vector3(0, 0, 300), 0.03);
        break;
      case "KeyD":
        state.camera.position.lerp(vector3(-80, 80, 80), 0.03);
        break;
      case "KeyF":
        state.camera.position.lerp(vector3(-80, 80, -80), 0.03);
        break;
      case "KeyG":
        state.camera.position.lerp(vector3(80, 80, -80), 0.03);
        break;
      case "KeyH":
        state.camera.position.lerp(vector3(80, 80, 80), 0.03);
        break;
      case "KeyJ":
        state.camera.position.lerp(vector3(80, -20, 90), 0.03);
        break;
      case "KeyK":
        state.camera.position.lerp(vector3(0, 80, 0), 0.03);
        break;
      case "KeyL":
        state.camera.position.lerp(vector3(0, 200, 300), 0.03);
        break;
      case "Space":
        // FIXME Rondom camera work
        state.camera.position.lerp(vector3(30, 30, 90), 0.07);
        break;
      case "KeyP":
        // Do nothing if paused
        break;
      default:
        state.camera.position.lerp(vector3(50, 50, 50), 0.03);
        break;
    }
    state.camera.lookAt(0, 0, 0);
    if (pressedSpaceKey) {
      state.camera.position.set(100, 30, -100);
      setPressedSpaceKey(false);
    }
  });
  return <OrbitControls />;
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
