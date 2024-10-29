import { Text, Heading, Center, Flex, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const NotFound = () => (
  <Box h="100vh" display="flex" justifyContent="center" alignItems="center">
    <Center>
      <Flex direction="column" align="center">
        <Heading mb={6}>This page cannot be found</Heading>
        <Link to="/">
          <Text fontSize="lg" color="blue.300" fontWeight="semibold">
            Click here to return to the homepage
          </Text>
        </Link>
      </Flex>
    </Center>
  </Box>
);
