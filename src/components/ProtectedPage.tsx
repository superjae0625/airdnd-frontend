import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../lib/useUser";

interface IProtectedPageProps {
    children: React.ReactNode;
}
//Component
export default function ProtectedPage({ children }: IProtectedPageProps) {
    // In Header.tsx, useUser was already called,
    // which means, the data of user is already cahched.
    const { isLoggedIn, userLoading } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
        if (!userLoading) {
            if (!isLoggedIn) {
                navigate("/");
            }
        }
    }, [userLoading, isLoggedIn, navigate]);
    return <>{children}</>;
}
