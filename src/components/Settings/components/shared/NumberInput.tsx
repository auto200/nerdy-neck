import {
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";

interface Props {
  id: string;
  label: string;
  value: string | number;
  onChange: (valueAsNumber: number) => void;
  addDegreeSign?: boolean;
  stepper?: boolean;
  [rest: string]: any;
}

const NumberInput = ({
  id,
  label,
  value,
  onChange,
  addDegreeSign = true,
  stepper = true,
  ...rest
}: Props) => {
  return (
    <FormControl>
      <FormLabel htmlFor={id} m="0">
        {label}
      </FormLabel>
      <ChakraNumberInput
        id={id}
        mr="1"
        value={value + (addDegreeSign ? "°" : "")}
        onChange={(_, numVal) => onChange(numVal)}
        {...rest}
        min={0}
      >
        <NumberInputField />
        {stepper && (
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        )}
      </ChakraNumberInput>
    </FormControl>
  );
};

export default NumberInput;
