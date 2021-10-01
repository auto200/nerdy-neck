import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from "@chakra-ui/react";

interface Props {
  tooltip: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const ModelDetectionThreshold = ({
  tooltip,
  label,
  value,
  onChange,
}: Props) => {
  return (
    <>
      <Tooltip label={tooltip}>
        <Box>
          {label}{" "}
          <Box as="span" fontWeight="bold">
            | {value}
          </Box>
        </Box>
      </Tooltip>
      <Slider
        value={value}
        onChange={onChange}
        min={0}
        max={1}
        step={0.05}
        aria-label={`${label} slider`}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </>
  );
};

export default ModelDetectionThreshold;
