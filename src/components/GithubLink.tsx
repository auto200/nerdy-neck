import { Link } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const GithubLink = () => {
  return (
    <Link
      href="https://github.com/auto200/nerdy-neck"
      target="_blank"
      pos="absolute"
      top="0"
      right="0"
      m="3"
      zIndex="10"
      fontSize="4xl"
    >
      <FaGithub />
    </Link>
  );
};

export default GithubLink;
