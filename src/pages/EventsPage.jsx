import React, { useState } from "react";
import { Box, Center, Flex, Input, SimpleGrid, Text } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import EventCard from "../components/EventCard";
import CategoryFilter from "../components/CategoryFilter";

export const loader = async () => {
  try {
    const [eventsRes, categoriesRes] = await Promise.all([
      fetch("http://localhost:3000/events"),
      fetch("http://localhost:3000/categories"),
    ]);

    if (!eventsRes.ok || !categoriesRes.ok) {
      throw new Error("Failed to load data.");
    }

    return {
      events: await eventsRes.json(),
      categories: await categoriesRes.json(),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const EventsPage = () => {
  const { events, categories } = useLoaderData();
  const [searchField, setSearchField] = useState("");
  const [radioValue, setRadioValue] = useState("0");

  const handleChange = (event) => setSearchField(event.target.value);
  const matchedEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchField.toLowerCase())
  );
  const selectedEvents = matchedEvents.filter((event) =>
    radioValue === "0" ? true : event.categoryIds.includes(Number(radioValue))
  );

  return (
    <Box>
      <Center>
        <Flex flexDir="column" wrap="wrap" w="full" align="center">
          <Input
            placeholder="Search event"
            textAlign="left"
            fontStyle="italic"
            backgroundColor="white"
            textColor="gray.800"
            fontWeight="semibold"
            onChange={handleChange}
            w={["90%", "500px", "500px"]}
            mt={1}
            mb={3}
          />
        </Flex>
      </Center>

      <Center>
        <CategoryFilter
          categories={categories}
          value={radioValue}
          onChange={setRadioValue}
        />
      </Center>

      {selectedEvents.length > 0 ? (
        <SimpleGrid columns={[1, 2, 3]} gap={6} p={3}>
          {selectedEvents.map((event) => (
            <EventCard key={event.id} event={event} categories={categories} />
          ))}
        </SimpleGrid>
      ) : (
        <Center mt={12} mb={12}>
          <Text fontWeight="semibold" fontStyle="italic" fontSize="2xl">
            No events found
          </Text>
        </Center>
      )}
    </Box>
  );
};
