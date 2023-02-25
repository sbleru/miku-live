// export {};
import { ComponentProps } from "react";
import { DanceSample } from "./DanceSample";
import {
  Meta as ComponentMeta,
  StoryObj as ComponentStoryObj,
} from "@storybook/react";
import { Center } from "@chakra-ui/react";

type Meta = ComponentMeta<typeof DanceSample>;
type Props = ComponentProps<typeof DanceSample>;
type Story = ComponentStoryObj<typeof DanceSample>;

const componentMeta: Meta = {
  component: DanceSample,
};
export default componentMeta;

const render = (_props: Props) => (
  <Center h={"100vh"}>
    <DanceSample />
  </Center>
);
const Template: Story = { render };

export const Default: Story = {
  ...Template,
};
