import React from "react";
import { Link } from "react-router-dom";
import { Button, Center, Flex, Heading } from "@chakra-ui/react";

export const Navigation = () => (
  <Flex direction="column" align="center" p={4} backgroundColor="blue.800">
    <Flex w="full" justify="flex-end">
      <Link to="/new">
        <Button
          w="120px"
          fontSize="lg"
          borderRadius="md"
          backgroundColor="gray.300"
          _hover={{ backgroundColor: "blue.300", color: "white" }}
        >
          Add Event
        </Button>
      </Link>
    </Flex>
    <Heading color="lightgray" fontWeight="semibold" fontSize="5xl" my={3}>
      Winc's Event Planner
    </Heading>
  </Flex>
);
