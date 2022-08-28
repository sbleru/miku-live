import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader";

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
  return <MmdModel url="/assets/miku_v2.pmd" />;
};

/**
 * Read mmd model
 * @see https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models
 */
const MmdModel = ({ url }: { url: string }) => {
  const mmd = useLoader(MMDLoader, url);
  return <primitive object={mmd} dispose={null} />;
};
