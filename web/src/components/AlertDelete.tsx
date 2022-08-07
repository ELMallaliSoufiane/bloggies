import { DeleteIcon } from "@chakra-ui/icons";
import {
  useDisclosure,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  IconButton,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useDeletePostMutation } from "../generated/graphql";

interface AlertProps {
  id: number;
}

export function AlertDelete({ id }: AlertProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const [error, setError] = useState(false);

  const [deletePost] = useDeletePostMutation();

  const handleDelete = async () => {
    const isDelete = await deletePost({
      variables: { id },
      update: (cache, data) => {
        cache.evict({ fieldName: "posts" });
      },
    });
    if (isDelete) {
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        aria-label="delete post"
        icon={<DeleteIcon />}
      />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef.current}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            {error ? (
              <Alert status="error">
                <AlertIcon />
                There was an error processing your request
              </Alert>
            ) : (
              ""
            )}

            <AlertDialogFooter>
              <Button ref={cancelRef.current} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => handleDelete()} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
