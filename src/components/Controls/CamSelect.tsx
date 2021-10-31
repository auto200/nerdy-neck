import { Select } from "@chakra-ui/react";
import { Cam } from "utils/interfaces";

interface Props {
  cams: Cam[];
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
      {cams.map(({ label, id }) => (
        <option key={id} value={id}>
          {label}
        </option>
      ))}
    </Select>
  );
};

export default CamSelect;
