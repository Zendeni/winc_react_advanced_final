import {
  Card,
  CardBody,
  CardHeader,
  Image,
  Text,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const EventCard = ({ event, categories }) => {
  const eventCategories = categories.filter((category) =>
    event.categoryIds.includes(category.id)
  );

  return (
    <Card
      borderRadius="xl"
      cursor="pointer"
      _hover={{ transform: "scale(1.01)" }}
      bgColor={"gray.200"}
    >
      <Link to={`event/${event.id}`}>
        <CardHeader h={200} p={0}>
          <Image
            src={event.image}
            alt={event.title}
            borderRadius="5% 5% 0% 0%"
            boxSize={"100%"}
            objectFit={"cover"}
            objectPosition={"center"}
          />
        </CardHeader>

        <CardBody textAlign={"center"} color={"black.700"}>
          <Text fontWeight={"bold"} fontSize={"xl"}>
            {event.title}
          </Text>
          <Text fontStyle={"italic"} pt={2}>
            {event.description}
          </Text>
          <Text pt={1}>
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
          <Flex wrap="wrap" gap={2} mr={1} mt={2} justify={"center"}>
            {eventCategories.map((category) => (
              <Text
                key={category.id}
                fontWeight={"bold"}
                fontSize={"xs"}
                backgroundColor={"yellow.300"}
                borderRadius={"md"}
                px={1}
                textTransform={"uppercase"}
              >
                {category.name}
              </Text>
            ))}
          </Flex>
        </CardBody>
      </Link>
    </Card>
  );
};

export default EventCard;
