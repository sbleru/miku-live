import { Center, ChakraProvider } from "@chakra-ui/react";
import { RagdollPhysicsCanvas } from "./canvas/scenes/RagdollPhysics";
import { Sample } from "./canvas/scenes/Sample"
import { SSRTest } from "./canvas/scenes/SSRTest";

function App() {
  return (
    <ChakraProvider>
      <Center h={"100vh"}>
        {/* <Sample /> */}
        <SSRTest />
        {/* <RagdollPhysicsCanvas /> */}
      </Center>
    </ChakraProvider>
  );
  // return <Sample />;
}

export default App;
