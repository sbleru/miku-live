import { Center, ChakraProvider } from "@chakra-ui/react";
import { RagdollPhysicsCanvas } from "./canvas/scenes/RagdollPhysics";
import { Sample } from "./canvas/scenes/Sample"
import { SSRTest } from "./canvas/scenes/SSRTest";
import { GlitchWallpaper } from "./canvas/scenes/GlitchWallpaper";
import { DanceSample } from "./canvas/scenes/DanceSample";

function App() {
  return (
    <ChakraProvider>
      <Center h={"100vh"}>
        {/* <Sample /> */}
        {/* <SSRTest /> */}
        {/* <RagdollPhysicsCanvas /> */}
        {/* <GlitchWallpaper />  */}
        <DanceSample />
      </Center>
    </ChakraProvider>
  );
  // return <Sample />;
}

export default App;
