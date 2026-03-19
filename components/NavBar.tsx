"use client";

import React, { useState, useRef, useEffect } from "react";
import { CalendarIcon, UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function Navbar() {
    const { user } = useAuth();
    const router = useRouter();

    const [openDropdown, setOpenDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpenDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-6">
            {/* LEFT: Logo */}
            <div className="flex items-center space-x-2 text-indigo-600">
                <CalendarIcon className="w-7 h-7" />
                <span className="text-xl font-bold text-slate-900">
                    ABCLeave
                </span>
            </div>

            {/* RIGHT: User Info */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="flex items-center space-x-2 rounded-lg px-2 py-1 hover:bg-slate-100 transition"
                >
                    <div className="bg-slate-100 p-2 rounded-full">
                        <UserIcon className="w-5 h-5 text-slate-600" />
                    </div>

                    <span className="text-sm font-medium text-slate-700">
                        {user?.name || "User"}
                    </span>
                </button>

                {openDropdown && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-md overflow-hidden">
                        <button
                            onClick={() => {
                                setOpenDropdown(false);
                                router.push("/change-password");
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                            Change Password
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}