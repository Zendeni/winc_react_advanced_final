import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Stack,
  Textarea,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";

export const EditEvent = ({
  isOpen,
  onClose,
  mainEvent,
  setMainEvent,
  categories,
}) => {
  const toast = useToast();
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    imageUrl: "",
    categoryIds: [],
    location: "",
    startDateTime: "",
    endDateTime: "",
  });
  const [loading, setLoading] = useState(false);

  const modalSize = useBreakpointValue({ base: "full", md: "xl" });

  useEffect(() => {
    if (isOpen && mainEvent) {
      const startDate = new Date(mainEvent.startTime);
      const endDate = new Date(mainEvent.endTime);

      setFormState({
        title: mainEvent.title,
        description: mainEvent.description,
        imageUrl: mainEvent.image,
        categoryIds: mainEvent.categoryIds,
        location: mainEvent.location,
        startDateTime: startDate.toISOString().slice(0, 16),
        endDateTime: endDate.toISOString().slice(0, 16),
      });
    }
  }, [isOpen, mainEvent]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formState.categoryIds.length < 1)
      return alert("Select at least one category.");
    if (formState.endDateTime <= formState.startDateTime)
      return alert("End time must be later than start time.");

    const eventData = {
      ...mainEvent,
      ...formState,
      startTime: new Date(formState.startDateTime).toISOString(),
      endTime: new Date(formState.endDateTime).toISOString(),
    };

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/events/${mainEvent.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        }
      );
      if (response.ok) {
        setMainEvent(eventData);
        toast({ title: "Update success", status: "success", duration: 3000 });
        onClose();
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      toast({
        title: "Update failed",
        status: "error",
        description: error.message,
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
      <ModalOverlay />
      <ModalContent
        backgroundColor="blue.50"
        borderRadius={useBreakpointValue({ base: "0", md: "md" })}
        p={useBreakpointValue({ base: "4", md: "6" })}
      >
        <ModalHeader fontSize={useBreakpointValue({ base: "lg", md: "xl" })}>
          Edit Event
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormLabel
                fontSize={useBreakpointValue({ base: "sm", md: "md" })}
              >
                Title
              </FormLabel>
              <Input
                name="title"
                value={formState.title}
                onChange={handleFormChange}
                required
                size={useBreakpointValue({ base: "sm", md: "md" })}
              />
              <FormLabel
                fontSize={useBreakpointValue({ base: "sm", md: "md" })}
              >
                Description
              </FormLabel>
              <Textarea
                name="description"
                value={formState.description}
                onChange={handleFormChange}
                required
                size={useBreakpointValue({ base: "sm", md: "md" })}
              />
              <FormLabel
                fontSize={useBreakpointValue({ base: "sm", md: "md" })}
              >
                Image URL
              </FormLabel>
              <Input
                name="imageUrl"
                value={formState.imageUrl}
                onChange={handleFormChange}
                required
                size={useBreakpointValue({ base: "sm", md: "md" })}
              />
              <FormLabel
                fontSize={useBreakpointValue({ base: "sm", md: "md" })}
              >
                Location
              </FormLabel>
              <Input
                name="location"
                value={formState.location}
                onChange={handleFormChange}
                size={useBreakpointValue({ base: "sm", md: "md" })}
              />
              <FormLabel
                fontSize={useBreakpointValue({ base: "sm", md: "md" })}
              >
                Start Time
              </FormLabel>
              <Input
                type="datetime-local"
                name="startDateTime"
                value={formState.startDateTime}
                onChange={handleFormChange}
                required
                size={useBreakpointValue({ base: "sm", md: "md" })}
              />
              <FormLabel
                fontSize={useBreakpointValue({ base: "sm", md: "md" })}
              >
                End Time
              </FormLabel>
              <Input
                type="datetime-local"
                name="endDateTime"
                value={formState.endDateTime}
                onChange={handleFormChange}
                required
                size={useBreakpointValue({ base: "sm", md: "md" })}
              />
              <FormLabel
                fontSize={useBreakpointValue({ base: "sm", md: "md" })}
              >
                Categories
              </FormLabel>
              <Stack spacing={1}>
                {categories.map((category) => (
                  <Checkbox
                    key={category.id}
                    id={category.id.toString()}
                    isChecked={formState.categoryIds.includes(category.id)}
                    onChange={handleCheckboxChange}
                    size={useBreakpointValue({ base: "sm", md: "md" })}
                  >
                    {category.name}
                  </Checkbox>
                ))}
              </Stack>
            </Stack>
            <ModalFooter>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={loading}
                size={useBreakpointValue({ base: "sm", md: "md" })}
              >
                Save
              </Button>
              <Button
                onClick={onClose}
                ml={3}
                size={useBreakpointValue({ base: "sm", md: "md" })}
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
