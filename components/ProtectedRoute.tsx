"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
    children: React.ReactNode;
    allowedRoles?: ("admin" | "employee")[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const isUnauthorized =
        !isLoading &&
        (!isAuthenticated ||
            !user ||
            (allowedRoles ? !allowedRoles.includes(user.role) : false));

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated || !user) {
            router.replace("/login");
            return;
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
            router.replace(`/dashboard/${user.role}`);
        }
    }, [isAuthenticated, user, isLoading, router, allowedRoles]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isUnauthorized) {
        return null;
    }

    return <>{children}</>;
}