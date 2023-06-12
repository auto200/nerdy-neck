import {
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { GITHUB_ISSUES_LINK } from "@utils/constants";

import { MdError } from "react-icons/md";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

type InitialLoaderProps = {
  state: "loading" | "error";
};

export const InitialLoader = ({ state }: InitialLoaderProps) => {
  return (
    <Modal isOpen={true} onClose={noop} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalBody display="flex" alignItems="center" justifyContent="center">
          {state === "loading" && (
            <VStack>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
              <Text fontSize="2xl">Loading pose detection model</Text>
            </VStack>
          )}

          {state === "error" && (
            <VStack>
              <Icon as={MdError} width={36} height={36} />
              <Text textAlign="center">
                Sorry, could not load pose detection model. <br /> Please report
                this problem via{" "}
                <Link
                  href={GITHUB_ISSUES_LINK}
                  isExternal
                  textDecoration="underline"
                >
                  GitHub issues
                </Link>
              </Text>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
