"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type { LoginInput, User } from "@/types";
import { loginUser } from "@/services/authService";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginInput) => Promise<User>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("current_user");
            const storedToken = localStorage.getItem("token");

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            if (storedToken) {
                setToken(storedToken);
            }
        } catch (error) {
            console.error("Failed to load auth data:", error);
            localStorage.removeItem("current_user");
            localStorage.removeItem("token");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = async (data: LoginInput): Promise<User> => {
        const result = await loginUser(data);

        setUser(result.user);
        setToken(result.token);

        localStorage.setItem("current_user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);

        return result.user;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("current_user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user && !!token,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}