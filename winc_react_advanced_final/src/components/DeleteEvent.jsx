import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const DeleteEvent = ({ isOpen, onClose, event }) => {
  const cancelRef = useRef();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const deleteEvent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete event");

      toast({
        id: "delete-event-toast",
        title: "Event deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        id: "delete-event-toast",
        description: "Error while deleting event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent backgroundColor="green.50">
          <AlertDialogHeader
            fontSize="xl"
            fontWeight="bold"
            color="red.600"
            textAlign="center"
          >
            Delete Event
          </AlertDialogHeader>

          <AlertDialogBody fontWeight="semibold" textAlign="center">
            Are you sure you want to delete this event?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              colorScheme="red"
              onClick={deleteEvent}
              isLoading={loading}
              w="100px"
              fontWeight="bold"
            >
              Delete
            </Button>
            <Button
              ref={cancelRef}
              onClick={onClose}
              ml={3}
              w="100px"
              fontWeight="bold"
            >
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
