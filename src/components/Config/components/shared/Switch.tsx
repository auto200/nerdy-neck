import {
  FormControl,
  Switch as ChakraSwitch,
  FormLabel,
} from "@chakra-ui/react";

interface Props {
  id: string;
  label: string;
  [rest: string]: any;
}

const Switch = ({ id, label, ...rest }: Props) => {
  return (
    <FormControl display="flex" alignItems="center" mt="6">
      <ChakraSwitch id={id} mr="1" {...rest} />
      <FormLabel htmlFor={id} m="0">
        {label}
      </FormLabel>
    </FormControl>
  );
};

export default Switch;
