import { Select } from "@chakra-ui/react";

interface Props {
  cams: MediaDeviceInfo[];
  currentCamIndex: number;
  setCurrentCamIndex: (num: number) => void;
}

const CamSelect: React.FC<Props> = ({
  cams,
  currentCamIndex,
  setCurrentCamIndex,
}) => {
  return (
    <Select
      w="60"
      value={cams[currentCamIndex]?.deviceId}
      onChange={(e) => {
        const camIndex = cams.findIndex(
          ({ deviceId }) => deviceId === e.target.value
        );
        camIndex > -1 && setCurrentCamIndex(camIndex);
      }}
    >
      {cams.map(({ label, deviceId }) => (
        <option key={deviceId} value={deviceId}>
          {label}
        </option>
      ))}
    </Select>
  );
};

export default CamSelect;
