"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboardIcon,
    UsersIcon,
    CalendarIcon,
    CheckCircleIcon,
    LogOutIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const role = user?.role ?? "employee";
    const basePath = `/dashboard/${role}`;

    const navItems =
        role === "admin"
            ? [
                {
                    path: `${basePath}`,
                    label: "Dashboard",
                    icon: LayoutDashboardIcon,
                },
                {
                    path: `${basePath}/employees`,
                    label: "Employees",
                    icon: UsersIcon,
                },
                {
                    path: `${basePath}/approvals`,
                    label: "Approvals",
                    icon: CheckCircleIcon,
                },
            ]
            : [
                {
                    path: `${basePath}`,
                    label: "Dashboard",
                    icon: LayoutDashboardIcon,
                },
                {
                    path: `${basePath}/request-leave`,
                    label: "Request Leave",
                    icon: CalendarIcon,
                },
                {
                    path: `${basePath}/my-leaves`,
                    label: "My Leaves",
                    icon: CheckCircleIcon,
                },
            ];

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <>
            <aside className="hidden md:flex fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 z-40 flex-col">
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive =
                            item.path === basePath
                                ? pathname === item.path
                                : pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700 font-medium"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOutIcon className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-50 flex items-center justify-around px-2">
                {navItems.map((item) => {
                    const isActive =
                        item.path === basePath
                            ? pathname === item.path
                            : pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full ${
                                isActive
                                    ? "text-indigo-600"
                                    : "text-slate-500 hover:text-slate-900"
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium text-center">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}

                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center justify-center w-full h-full text-red-600"
                >
                    <LogOutIcon className="w-5 h-5" />
                    <span className="text-[10px] font-medium text-center">
                        Logout
                    </span>
                </button>
            </nav>
        </>
    );
}