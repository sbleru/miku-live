/**
 * @see https://docs.pmnd.rs/react-postprocessing/introduction
 */
import {
  EffectComposer,
  // SSR,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
  /**
   * @see https://docs.pmnd.rs/react-postprocessing/effects/glitch
   */
  Glitch,
} from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import { Vector2 } from "three";

const vector2 = (x: number, y: number) => new Vector2(x, y);

export const EffectGlitch = () => {
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
      <Glitch
        delay={vector2(1.5, 3.5)} // min and max glitch delay
        duration={vector2(0.6, 1.0)} // min and max glitch duration
        strength={vector2(0.3, 1.0)} // min and max glitch strength
        mode={GlitchMode.SPORADIC} // glitch mode
        active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
        ratio={0.85} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
      />
    </EffectComposer>
  );
};
