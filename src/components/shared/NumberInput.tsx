import {
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputProps as ChakraNumberInputProps,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export type NumberInputProps = {
  label: string;
  value: number;
  onChange: (valueAsNumber: number) => void;
  stepper?: boolean;
} & Omit<ChakraNumberInputProps, "value" | "onChange">;

export const NumberInput = ({
  label,
  value,
  onChange,
  stepper = true,
  ...rest
}: NumberInputProps) => {
  const [localVal, setLocalVal] = useState<number | "">(value);

  useEffect(() => {
    if (localVal !== "") {
      onChange(localVal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localVal]);

  return (
    <FormControl>
      <FormLabel m="0" mt="2">
        {label}
      </FormLabel>
      <ChakraNumberInput
        value={localVal}
        onChange={(_, numVal) =>
          setLocalVal(Number.isNaN(numVal) ? "" : numVal)
        }
        onBlur={() => localVal === "" && setLocalVal(0)}
        min={0}
        {...rest}
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
