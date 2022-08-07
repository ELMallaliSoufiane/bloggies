import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import {
  useToggleUserEnabilityMutation,
  useUpdateUserMutation,
  useMeQuery,
  MeQuery,
  MeDocument,
} from "../generated/graphql";
import { InputField } from "./InputField";

interface EditProps {
  label: "username" | "email" | "password";
  currentValue: string;
}

const EditModal = ({ label, currentValue }: EditProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [useUpdateUser] = useUpdateUserMutation();
  const [useToggleEnability] = useToggleUserEnabilityMutation();
  const MeData = useMeQuery({});
  return (
    <>
      <Button
        colorScheme={label === "password" ? "red" : "gray"}
        onClick={onOpen}
        mr={5}
      >
        {label === "password"
          ? MeData.data?.me?.active
            ? "Disable your account"
            : "Enable your account"
          : "Edit"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`${
            label === "password"
              ? MeData.data?.me?.active
                ? "Disable your account"
                : "Enable your account"
              : "Change your " + label
          }`}</ModalHeader>
          <ModalCloseButton />

          <Formik
            initialValues={{ [label]: currentValue }}
            onSubmit={async (values, { setErrors }) => {
              if (label === "password") {
                const disable = await useToggleEnability({
                  variables: {
                    password: values.password,
                  },
                  update: (cache, { data }) => {
                    const old = cache.readQuery<MeQuery>({ query: MeDocument });
                    cache.updateQuery({ query: MeDocument }, (data) => ({
                      __typename: "Query",
                      me: { ...old!.me, active: !old!.me?.active },
                    }));
                  },
                });
                if (disable) {
                  onClose();
                } else {
                  setErrors({
                    [label]: "Already taken, choose another username please!",
                  });
                }
              } else {
                const changed = await useUpdateUser({
                  variables: { updateInput: values },
                  update: (cache, { data }) => {
                    cache.writeQuery<MeQuery>({
                      query: MeDocument,
                      data: {
                        __typename: "Query",
                        me: data?.updateUser,
                      },
                    });
                  },
                });
                if (changed.data?.updateUser) {
                  onClose();
                } else {
                  console.log(changed);
                  setErrors({
                    [label]: changed.errors?.toString(),
                  });
                }
              }
            }}
          >
            {({ values, isSubmitting }) => (
              <Form>
                <ModalBody>
                  <InputField
                    style={{ marginBottom: "20px" }}
                    label={label}
                    name={label}
                    value={values[label]}
                  />{" "}
                </ModalBody>
                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    colorScheme="blue"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Done
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditModal;
