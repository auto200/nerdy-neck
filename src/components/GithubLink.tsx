import { Link } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { GITHUB_LINK } from "@utils/constants";

const GithubLink = () => {
  return (
    <Link
      href={GITHUB_LINK}
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
