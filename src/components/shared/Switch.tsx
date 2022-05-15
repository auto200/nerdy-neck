import {
  FormControl,
  FormLabel,
  Switch as ChakraSwitch,
  SwitchProps as ChakraSwitchProps,
} from "@chakra-ui/react";

type SwitchProps = {
  label: string;
} & ChakraSwitchProps;

export const Switch = ({ label, ...rest }: SwitchProps) => {
  return (
    <FormControl display="flex" alignItems="center" mt="6">
      <ChakraSwitch mr="1" {...rest} />
      <FormLabel m="0">{label}</FormLabel>
    </FormControl>
  );
};
