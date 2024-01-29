import {
    Box,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock, FaUserAlt, FaUserSecret } from "react-icons/fa";
import { SignUp } from "../api";

interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IForm {
    name: string;
    email: string;
    username: string;
    password: string;
    currency: string;
    gender: string;
    language: string;
}

export default function SignUpModal({ onClose, isOpen }: SignUpModalProps) {
    const { register, handleSubmit, reset } = useForm<IForm>();
    const toast = useToast();
    const queryClient = useQueryClient();
    const mutation = useMutation(SignUp, {
        onSuccess: () => {
            toast({ title: "Welcome!", status: "success" });
            onClose();
            queryClient.refetchQueries(["me"]);
        },
        onError: () => {
            reset();
        },
    });

    const onSubmit = ({
        username,
        password,
        name,
        email,
        currency,
        gender,
        language,
    }: IForm) => {
        mutation.mutate({
            username,
            email,
            name,
            password,
            currency,
            gender,
            language,
        });
    };

    return (
        <Modal onClose={onClose} isOpen={isOpen}>
            {/* ModalOverlay makes background page darker that stands out Modal */}
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Sign up</ModalHeader>
                <ModalCloseButton />
                <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
                    <VStack>
                        <InputGroup>
                            <InputLeftElement
                                children={
                                    <Box color="gray.500">
                                        <FaUserSecret />
                                    </Box>
                                }
                            />
                            <Input
                                {...register("name", { required: true })}
                                placeholder="name"
                                variant="filled"
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement
                                children={
                                    <Box color="gray.500">
                                        <FaEnvelope />
                                    </Box>
                                }
                            />
                            <Input
                                {...register("email", { required: true })}
                                placeholder="email"
                                variant="filled"
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement
                                children={
                                    <Box color="gray.500">
                                        <FaUserAlt />
                                    </Box>
                                }
                            />
                            <Input
                                {...register("username", { required: true })}
                                placeholder="username"
                                variant="filled"
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement
                                children={
                                    <Box color="gray.500">
                                        <FaLock />
                                    </Box>
                                }
                            />
                            <Input
                                {...register("password", { required: true })}
                                placeholder="password"
                                variant="filled"
                                type="password"
                            />
                        </InputGroup>
                    </VStack>
                    <Button
                        isLoading={mutation.isLoading}
                        w="full"
                        colorScheme="red"
                        mt={4}
                        type="submit"
                    >
                        Sign Up
                    </Button>
                    {/* <SocialLogin /> */}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
