import {
  FormControl,
  FormLabel,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";

type SwitchProps = {
  id: string;
  label: string;
} & any;

export const Switch = ({ id, label, ...rest }: SwitchProps) => {
  return (
    <FormControl display="flex" alignItems="center" mt="6">
      <ChakraSwitch id={id} mr="1" {...rest} />
      <FormLabel htmlFor={id} m="0">
        {label}
      </FormLabel>
    </FormControl>
  );
};
