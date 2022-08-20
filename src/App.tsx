import { Center, ChakraProvider } from "@chakra-ui/react";
// import { Sample } from "./features/Sample";
import { SSRTest } from "./features/SSRTest";

function App() {
  return (
    <ChakraProvider>
      <Center h={"100vh"}>
        {/* <Sample /> */}
        <SSRTest />
      </Center>
    </ChakraProvider>
  );
  // return <Sample />;
}

export default App;
