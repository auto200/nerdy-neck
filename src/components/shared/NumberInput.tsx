import {
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";

type NumberInputProps = {
  id: string;
  label: string;
  value: string | number;
  onChange: (valueAsNumber: number) => void;
  stepper?: boolean;
  [rest: string]: any;
};

export const NumberInput = ({
  id,
  label,
  value,
  onChange,
  stepper = true,
  ...rest
}: NumberInputProps) => {
  return (
    <FormControl>
      <FormLabel htmlFor={id} m="0">
        {label}
      </FormLabel>
      <ChakraNumberInput
        id={id}
        mr="1"
        value={value}
        onChange={(_, numVal) => onChange(numVal)}
        onBlur={() => !value && value !== 0 && onChange(0)}
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
