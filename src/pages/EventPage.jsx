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
  const toast = ChakraUseToast();

  const eventCategories = categories.filter((category) =>
    event.categoryIds.includes(category.id)
  );

  const createdBy = users.find((user) => user.id === event.createdBy);

  const handleEventUpdate = (updatedEvent) => {
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
      <Box width="60%" bg="blue.100" borderRadius="xl" mt={1} p={6}>
        <Link to="/">
          <Tooltip label="All events">
            <Button fontWeight="bold" textColor="gray.400" size="md">
              {"< All events"}
            </Button>
          </Tooltip>
        </Link>

        <Center>
          <Heading fontSize="2xl" fontWeight="bold" pb={6}>
            {event.title}
          </Heading>
        </Center>

        <Image
          src={event.image}
          alt={event.title}
          borderRadius="sm"
          boxSize="100%"
          objectFit="cover"
          objectPosition="center"
          mb={4}
        />

        <SimpleGrid columns={1} spacing={5}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            fontStyle="italic"
            color="gray.600"
            textTransform="uppercase"
          >
            {event.description}
          </Text>

          <Text>
            Start:{" "}
            {new Date(event.startTime).toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "short",
              hour24: true,
            })}
          </Text>
          <Text>
            End:{" "}
            {new Date(event.endTime).toLocaleString([], {
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
              <Text fontSize="sm" fontWeight="bold">
                Created by: {createdBy.name}
              </Text>
              <Image
                src={createdBy.image}
                alt={createdBy.name}
                boxSize="80px"
                objectFit="cover"
                borderRadius="full"
                m={2}
              />
            </Center>
          )}

          <Center mt={10}>
            <Button
              w="100px"
              mr={8}
              fontWeight="bold"
              fontSize="lg"
              borderRadius="md"
              backgroundColor="gray.300"
              _hover={{ backgroundColor: "green.300" }}
              onClick={() => setModalEditOpen(true)}
            >
              Edit
            </Button>

            <Button
              w="100px"
              fontWeight="bold"
              fontSize="lg"
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
          mainEvent={event}
          setMainEvent={handleEventUpdate}
          categories={categories}
        />

        <DeleteEvent
          isOpen={alertDeleteOpen}
          onClose={() => setAlertDeleteOpen(false)}
          event={event}
        />
      </Box>
    </Center>
  );
};
