import {
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export type NumberInputProps = {
  id: string;
  label: string;
  value: number;
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
  const [localVal, setLocalVal] = useState<number | "">(value);

  useEffect(() => {
    if (localVal !== "") {
      onChange(localVal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localVal]);

  return (
    <FormControl>
      <FormLabel htmlFor={id} m="0" mt="2">
        {label}
      </FormLabel>
      <ChakraNumberInput
        id={id}
        value={localVal}
        onChange={(_, numVal) =>
          setLocalVal(Number.isNaN(numVal) ? "" : numVal)
        }
        onBlur={() => localVal === "" && setLocalVal(0)}
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
