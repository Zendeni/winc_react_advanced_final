import { Box, Center, Flex, Text, Heading } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();

  return (
    <Box
      h="100vh"
      backgroundColor="blue.400"
      display="flex"
      alignItems="center"
    >
      <Center w="full">
        <Flex direction="column" align="center">
          <Heading mb={6}>A serious error has occurred!</Heading>
          {error && (
            <>
              <Text fontWeight="bold" fontStyle="italic" color="red.500">
                {error?.status || "Unknown Status"}
              </Text>
              <Text fontWeight="bold" fontStyle="italic" mt={2}>
                {error?.message || "An unexpected error occurred"}
              </Text>
              <Text mt={4}>
                Please contact your helpdesk and report this error.
              </Text>
            </>
          )}
          <Link to="/">
            <Text mt={10} fontSize="lg" color="blue.300" fontWeight="semibold">
              Click here to return to the homepage
            </Text>
          </Link>
        </Flex>
      </Center>
    </Box>
  );
};
