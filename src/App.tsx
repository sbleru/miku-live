import { Center, ChakraProvider } from "@chakra-ui/react";
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
