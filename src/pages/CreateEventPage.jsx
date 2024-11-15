import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Flex,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";

export const loader = async () => {
  const categories = await fetch("http://localhost:3000/categories");
  if (!categories.ok) {
    throw new Error(
      `Error while fetching the categories: ${categories.status} ${categories.statusText}`
    );
  }
  const users = await fetch("http://localhost:3000/users");
  if (!users.ok) {
    throw new Error(
      `Error while fetching the users: ${users.status} ${users.statusText}`
    );
  }
  return {
    categories: await categories.json(),
    users: await users.json(),
  };
};

export const CreateEventPage = () => {
  const { categories, users } = useLoaderData();
  const navigate = useNavigate();
  const toast = useToast();
  const toastId = "create-event-toast";

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    imageUrl: "",
    location: "",
    startDateTime: "",
    endDateTime: "",
    categoryIds: [],
    userId: "",
  });

  const [loading, setLoading] = useState(false);
  const [keyForm, setKeyForm] = useState(0);

  const getCurrentDateTime = () => {
    let date = new Date();
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const convertLocalToUTC = (localDateString) => {
    let date = new Date(localDateString);
    return new Date(date.getTime()).toISOString();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      categoryIds: checked
        ? [...prevState.categoryIds, Number(id)]
        : prevState.categoryIds.filter((catId) => catId !== Number(id)),
    }));
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleResetButton = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to reset the form? This will remove all entered data."
    );
    if (isConfirmed) {
      setFormState({
        title: "",
        description: "",
        imageUrl: "",
        location: "",
        startDateTime: "",
        endDateTime: "",
        categoryIds: [],
        userId: "",
      });
      setKeyForm((prev) => prev + 1);
    }
  };

  const addEvent = async (event) => {
    event.preventDefault();

    if (formState.categoryIds.length < 1) {
      window.alert("One or more categories are required!");
      return;
    }
    if (formState.endDateTime <= formState.startDateTime) {
      window.alert("The end date/time must be after the start date/time!");
      return;
    }

    setLoading(true);

    const startDateTimeUTC = convertLocalToUTC(formState.startDateTime);
    const endDateTimeUTC = convertLocalToUTC(formState.endDateTime);

    const newEvent = {
      id: undefined,
      createdBy: formState.userId,
      title: formState.title,
      description: formState.description,
      image: formState.imageUrl,
      categoryIds: formState.categoryIds,
      location: formState.location,
      startTime: startDateTimeUTC,
      endTime: endDateTimeUTC,
    };

    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      body: JSON.stringify(newEvent),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (response.ok) {
      toast({
        toastId,
        title: "Added successfully",
        description: "The event has been successfully added",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      const newEventId = (await response.json()).id;
      navigate(`/event/${newEventId}`);
    } else {
      console.error(`Error adding event: ${response.statusText}`);
      toast({
        toastId,
        title: "Not added successfully",
        description: "The event has not been added, an error has occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Center fontSize={"3xl"} fontWeight={"medium"} pt={1} pb={2}>
        Create a new Event:
      </Center>
      <Center>
        <form id="form-create-event" key={keyForm} onSubmit={addEvent}>
          <Flex direction="column">
            <Input
              name="title"
              value={formState.title}
              onChange={handleInputChange}
              required
              placeholder="Title of the event"
              backgroundColor={"gray.100"}
              textColor={"black"}
              mt={2}
            />
            <Textarea
              name="description"
              value={formState.description}
              onChange={handleInputChange}
              rows={4}
              required
              placeholder="Description"
              backgroundColor={"gray.100"}
              mt={2}
            />
            <Input
              name="imageUrl"
              value={formState.imageUrl}
              onChange={handleInputChange}
              required
              placeholder="Image URL"
              backgroundColor={"gray.100"}
              mt={2}
            />
            <Input
              name="location"
              value={formState.location}
              onChange={handleInputChange}
              required
              placeholder="Location"
              backgroundColor={"gray.100"}
              mt={2}
            />
            <Text mt={2} ml={2} fontWeight={"semibold"} textColor={"gray.800"}>
              Start Date/time:
            </Text>
            <Input
              name="startDateTime"
              type="datetime-local"
              required
              value={formState.startDateTime}
              onChange={handleInputChange}
              min={getCurrentDateTime()}
              backgroundColor={"gray.100"}
              color={"gray.600"}
              fontWeight={"semibold"}
              mt={0}
            />
            <Text mt={2} ml={2} fontWeight={"semibold"} textColor={"gray.800"}>
              End Date/time:
            </Text>
            <Input
              name="endDateTime"
              type="datetime-local"
              required
              value={formState.endDateTime}
              onChange={handleInputChange}
              min={getCurrentDateTime()}
              backgroundColor={"gray.100"}
              color={"gray.600"}
              fontWeight={"semibold"}
              mt={0}
            />
            <CheckboxGroup colorScheme="blue" isRequired>
              <Text
                mt={3}
                ml={2}
                fontWeight={"semibold"}
                textColor={"gray.800"}
              >
                Select categories:
              </Text>
              <Stack spacing={7} direction={"row"} ml={2}>
                {categories.map((category) => (
                  <Checkbox
                    key={category.id}
                    fontWeight={"medium"}
                    fontStyle={"italic"}
                    textColor={"gray.900"}
                    id={category.id}
                    onChange={handleCheckboxChange}
                    isChecked={formState.categoryIds.includes(category.id)}
                  >
                    {category.name}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
            <Select
              name="userId"
              placeholder="Select user"
              backgroundColor={"gray.100"}
              textColor={"grey.600"}
              fontWeight={"semibold"}
              onChange={handleInputChange}
              value={formState.userId}
              isRequired
              mt={5}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </Flex>
          <Center>
            <Button
              type="button"
              form="form-create-event"
              onClick={handleCancel}
              mt={10}
              mb={5}
              fontWeight={"bold"}
              fontSize={"lg"}
              textTransform={"uppercase"}
              width="150px"
              borderRadius={"md"}
              backgroundColor={"gray.200"}
              _hover={{ backgroundColor: "red.300" }}
              isLoading={loading}
            >
              Cancel
            </Button>
            <Button
              type="reset"
              form="form-create-event"
              onClick={handleResetButton}
              mt={10}
              mb={5}
              ml={5}
              fontWeight={"bold"}
              fontSize={"lg"}
              textTransform={"uppercase"}
              width="150px"
              borderRadius={"md"}
              backgroundColor={"gray.200"}
              _hover={{ backgroundColor: "blue.300" }}
              isLoading={loading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="form-create-event"
              mt={10}
              mb={5}
              ml={5}
              fontWeight={"bold"}
              fontSize={"lg"}
              textTransform={"uppercase"}
              width="150px"
              borderRadius={"md"}
              backgroundColor={"gray.200"}
              _hover={{ backgroundColor: "green.300" }}
              isLoading={loading}
            >
              Add
            </Button>
          </Center>
        </form>
      </Center>
    </>
  );
};
