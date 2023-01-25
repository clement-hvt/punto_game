import React from "react";
import { useAuth } from "./hooks/use-auth";
import { Navigate } from "react-router-dom";

export const RequireAuth = ({ children }) => {
    const auth = useAuth()

    return auth.user ? (
        children
    ) : (
        <Navigate to="/connexion"/>
    );
};