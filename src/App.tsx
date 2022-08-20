import { Center, ChakraProvider } from "@chakra-ui/react";
import { RagdollPhysicsCanvas } from "./features/RagdollPhysics";
// import { Sample } from "./features/Sample";
import { SSRTest } from "./features/SSRTest";

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
