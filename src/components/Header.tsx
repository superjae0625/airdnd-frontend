import { FaHotel, FaMoon, FaSun } from "react-icons/fa";
import {
    Avatar,
    Box,
    Button,
    HStack,
    IconButton,
    LightMode,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
    ToastId,
    useColorMode,
    useColorModeValue,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import useUser from "../lib/useUser";
import { logOut } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

export default function Header() {
    const { userLoading, isLoggedIn, user } = useUser();
    const {
        //Login
        isOpen: isLoginOpen,
        onClose: onLoginClose, //function to turn false
        onOpen: onLoginOpen, //function to turn true
    } = useDisclosure();
    const {
        //Sign up
        isOpen: isSignUpOpen,
        onClose: onSignUpClose,
        onOpen: onSignUpOpen,
    } = useDisclosure();
    const { toggleColorMode } = useColorMode();
    const logoColor = useColorModeValue("red.500", "red.200");
    const Icon = useColorModeValue(FaMoon, FaSun);
    // first arg -> light mode , second arg -> dark mode
    // no need to use if - else statment
    // above settings are stored in local storage
    const toast = useToast();
    const queryClient = useQueryClient();
    //useRef is not to save value into state
    //value will be still there after re-render
    const toastId = useRef<ToastId>();
    const mutation = useMutation(logOut, {
        onMutate: () => {
            toastId.current = toast({
                title: "Login out...",
                description: "Sad to see you go...",
                status: "loading",
                duration: 10000,
                position: "bottom-right",
            });
        },
        onSuccess: () => {
            if (toastId.current) {
                // Without refreshing or chaning page,
                // it will refetch and change the UI
                queryClient.refetchQueries(["me"]);
                toast.update(toastId.current, {
                    status: "success",
                    title: "Done!",
                    description: "See you later!",
                });
            }
        },
    });
    const onLogOut = async () => {
        mutation.mutate();
    };
    return (
        <Stack
            justifyContent={"space-between"}
            alignItems="center"
            py={5}
            px={40}
            direction={{
                sm: "column",
                md: "row",
            }}
            spacing={{
                sm: 4,
                md: 0,
            }}
            borderBottomWidth={1}
        >
            <Box color={logoColor}>
                <Link to={"/"}>
                    <FaHotel size={"48"} />
                </Link>
            </Box>
            <HStack spacing={2}>
                <IconButton
                    onClick={toggleColorMode}
                    variant={"ghost"}
                    aria-label="Toggle dark mode"
                    icon={<Icon />}
                />
                {!userLoading ? (
                    !isLoggedIn ? (
                        <>
                            <Button onClick={onLoginOpen}>Log in</Button>
                            <LightMode>
                                <Button
                                    onClick={onSignUpOpen}
                                    colorScheme={"red"}
                                >
                                    Sign up
                                </Button>
                            </LightMode>
                        </>
                    ) : (
                        <Menu>
                            <MenuButton>
                                <Avatar
                                    name={user?.name}
                                    src={user?.avatar}
                                    size={"md"}
                                />
                            </MenuButton>
                            <MenuList>
                                {user?.is_host ? (
                                    <Link to="/rooms/upload">
                                        <MenuItem>Upload room</MenuItem>
                                    </Link>
                                ) : null}
                                <MenuItem onClick={onLogOut}>Log out</MenuItem>
                            </MenuList>
                        </Menu>
                    )
                ) : null}
            </HStack>
            <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
            <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
        </Stack>
    );
}
