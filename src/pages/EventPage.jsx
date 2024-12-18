import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
  Tooltip,
  useToast as ChakraUseToast,
} from "@chakra-ui/react";
import { Link, useLoaderData } from "react-router-dom";
import { EditEvent } from "../components/EditEvent";
import { DeleteEvent } from "../components/DeleteEvent";

export const loader = async ({ params }) => {
  try {
    const [eventRes, categoriesRes, usersRes] = await Promise.all([
      fetch(`http://localhost:3000/events/${params.eventId}`),
      fetch("http://localhost:3000/categories"),
      fetch("http://localhost:3000/users"),
    ]);

    if (!eventRes.ok || !categoriesRes.ok || !usersRes.ok) {
      throw new Error("Failed to load event data.");
    }

    return {
      event: await eventRes.json(),
      categories: await categoriesRes.json(),
      users: await usersRes.json(),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const EventPage = () => {
  const { event, categories, users } = useLoaderData();
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [alertDeleteOpen, setAlertDeleteOpen] = useState(false);
  const [updatedEvent, setUpdatedEvent] = useState(event);
  const toast = ChakraUseToast();

  const eventCategories = categories.filter((category) =>
    updatedEvent.categoryIds.includes(category.id)
  );

  const createdBy = users.find((user) => user.id === updatedEvent.createdBy);

  const handleEventUpdate = (updatedEvent) => {
    setUpdatedEvent(updatedEvent);
    toast({
      title: "Event updated",
      description: "The event has been successfully updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Center>
      <Box
        width={["90%", "80%", "60%"]}
        bg="blue.100"
        borderRadius="xl"
        mt={1}
        p={6}
      >
        <Link to="/">
          <Tooltip label="All events">
            <Button fontWeight="bold" textColor="black.400" size="md">
              {"< All events"}
            </Button>
          </Tooltip>
        </Link>

        <Center>
          <Heading fontSize={["xl", "2xl", "3xl"]} fontWeight="bold" pb={6}>
            {updatedEvent.title}
          </Heading>
        </Center>

        <Image
          src={updatedEvent.image}
          alt={updatedEvent.title}
          borderRadius="sm"
          boxSize="100%"
          objectFit="cover"
          objectPosition="center"
          mb={4}
        />

        <SimpleGrid columns={1} spacing={5}>
          <Text
            fontSize={["sm", "lg", "lg"]}
            fontWeight="bold"
            fontStyle="italic"
            color="gray.600"
            textTransform="uppercase"
          >
            {updatedEvent.description}
          </Text>

          <Text fontSize={["sm", "md", "md"]}>
            Start:{" "}
            {new Date(updatedEvent.startTime).toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "short",
              hour24: true,
            })}
          </Text>
          <Text fontSize={["sm", "md", "md"]}>
            End:{" "}
            {new Date(updatedEvent.endTime).toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "short",
              hour24: true,
            })}
          </Text>

          <Flex wrap="wrap" gap={2} justify="center">
            {eventCategories.map((category) => (
              <Text
                key={category.id}
                fontWeight="bold"
                fontSize="xs"
                bg="yellow.300"
                borderRadius="md"
                px={1}
                textTransform="uppercase"
              >
                {category.name}
              </Text>
            ))}
          </Flex>

          {createdBy && (
            <Center>
              <Text fontSize={["sm", "md", "lg"]} fontWeight="bold">
                Created by: {createdBy.name}
              </Text>
              <Image
                src={createdBy.image}
                alt={createdBy.name}
                boxSize={["60px", "80px", "100px"]}
                objectFit="cover"
                borderRadius="full"
                m={2}
              />
            </Center>
          )}

          <Center mt={10}>
            <Button
              w={["80px", "100px", "100px"]}
              mr={8}
              fontWeight="bold"
              fontSize={["md", "lg", "lg"]}
              borderRadius="md"
              backgroundColor="gray.300"
              _hover={{ backgroundColor: "green.300" }}
              onClick={() => setModalEditOpen(true)}
            >
              Edit
            </Button>

            <Button
              w={["80px", "100px", "100px"]}
              fontWeight="bold"
              fontSize={["md", "lg", "lg"]}
              borderRadius="md"
              backgroundColor="gray.300"
              _hover={{ backgroundColor: "red.300" }}
              onClick={() => setAlertDeleteOpen(true)}
            >
              Delete
            </Button>
          </Center>
        </SimpleGrid>

        <EditEvent
          isOpen={modalEditOpen}
          onClose={() => setModalEditOpen(false)}
          mainEvent={updatedEvent}
          setMainEvent={handleEventUpdate}
          categories={categories}
        />

        <DeleteEvent
          isOpen={alertDeleteOpen}
          onClose={() => setAlertDeleteOpen(false)}
          event={updatedEvent}
        />
      </Box>
    </Center>
  );
};
