import { Button } from "@chakra-ui/react";

interface Props {
  onClick: () => void;
  isLoading: boolean;
  running: boolean;
}

const ControlButton: React.FC<Props> = ({ onClick, isLoading, running }) => {
  return (
    <Button onClick={onClick} isLoading={isLoading} loadingText="Loading">
      {running ? "STOP" : "START"}
    </Button>
  );
};

export default ControlButton;
