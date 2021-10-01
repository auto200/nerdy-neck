import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";

const PanicButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [wipingData, setWipingData] = useState<boolean>(false);

  return (
    <>
      <Portal>
        <Button pos="absolute" right="0" bottom="0" onClick={onOpen}>
          Something is broken HELP ME!!1!1
        </Button>
      </Portal>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>EXTERMINATE 🤖 EXTERMINATE 🤖</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              Oh no 😢 Note that this app is just a fun project and breaking
              changes may be happening
            </Box>
            <Box mt="1">
              Best you can do is wipe all locally stored data and cross your
              fingers 🤞
            </Box>
          </ModalBody>

          <ModalFooter display="flex" justifyContent="space-evenly">
            <Box fontWeight="bold">You can do it by pressing 👉</Box>
            <Button
              colorScheme="red"
              isLoading={wipingData}
              loadingText="Reloading"
              onClick={() => {
                setWipingData(true);
                window.localStorage.clear();
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }}
            >
              This button
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PanicButton;
