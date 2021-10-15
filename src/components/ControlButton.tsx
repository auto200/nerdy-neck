import { Button } from "@chakra-ui/react";

interface Props {
  disabled: boolean;
  onClick: () => void;
  isLoading: boolean;
  running: boolean;
}

const ControlButton: React.FC<Props> = ({
  disabled,
  onClick,
  isLoading,
  running,
}) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      isLoading={isLoading}
      loadingText="Loading"
    >
      {running ? "STOP" : "START"}
    </Button>
  );
};

export default ControlButton;
