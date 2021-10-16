import { Select } from "@chakra-ui/react";

interface Props {
  cams: MediaDeviceInfo[];
  currentCamId: string;
  setCurrentCamId: (id: string) => void;
}

const CamSelect: React.FC<Props> = ({
  cams,
  currentCamId,
  setCurrentCamId,
}) => {
  return (
    <Select
      w="60"
      value={currentCamId}
      onChange={(e) => setCurrentCamId(e.target.value)}
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
