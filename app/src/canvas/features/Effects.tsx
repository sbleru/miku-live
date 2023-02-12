/**
 * @see https://docs.pmnd.rs/react-postprocessing/introduction
 */
import {
  EffectComposer,
  SSR,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { ComponentProps } from "react";
// react 18の依存解決がだるいのでやめ
// import { useControls } from "leva";

export const Effects = () => {
  const props: ComponentProps<typeof SSR> = {
    temporalResolve: true,
    STRETCH_MISSED_RAYS: true,
    USE_MRT: true,
    USE_NORMALMAP: true,
    USE_ROUGHNESSMAP: true,
    ENABLE_JITTERING: true,
    ENABLE_BLUR: true,
    temporalResolveMix: 0.9,
    temporalResolveCorrectionMix: 0.25,
    maxSamples: 0,
    // resolutionScale: 1,
    blurMix: 0.5,
    blurKernelSize: 8,
    blurSharpness: 0.5,
    rayStep: 0.3,
    intensity: 1,
    maxRoughness: 0.1,
    jitter: 0.7,
    jitterSpread: 0.45,
    jitterRough: 0.1,
    // roughnessFadeOut: 1,
    // rayFadeOut: 0,
    MAX_STEPS: 20,
    NUM_BINARY_SEARCH_STEPS: 5,
    maxDepthDifference: 3,
    maxDepth: 1,
    thickness: 10,
    ior: 1.45,
  };
  return (
    <EffectComposer disableNormalPass>
      <DepthOfField
        focusDistance={0}
        focalLength={0.02}
        bokehScale={2}
        height={480}
      />
      <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
      <SSR {...props} />
    </EffectComposer>
  );
};
