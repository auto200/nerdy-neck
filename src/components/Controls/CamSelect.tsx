import { Select } from "@chakra-ui/react";
import { Cam } from "utils/interfaces";

interface Props {
  cams: Cam[];
  selectedCamId: string;
  setSelectedCamId: (id: string) => void;
}

const CamSelect: React.FC<Props> = ({
  cams,
  selectedCamId,
  setSelectedCamId,
}) => {
  return (
    <Select
      w="60"
      value={selectedCamId}
      onChange={(e) => setSelectedCamId(e.target.value)}
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
