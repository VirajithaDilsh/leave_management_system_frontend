"use client";

import React, { useEffect, useMemo, useState } from "react";
import { UsersIcon, Trash2Icon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
    getEmployees,
    createEmployee,
    deleteEmployee,
} from "@/services/employeeService";
import type { Role, User } from "@/types";

type EmptyStateProps = {
    title: string;
    description: string;
    icon: React.ElementType;
};

function EmptyState({ title, description, icon: Icon }: EmptyStateProps) {
    return (
        <div className="px-6 py-12 text-center">
            <Icon className="w-10 h-10 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-slate-500 mt-2">{description}</p>
        </div>
    );
}

export default function Page() {
    const { token, user, isLoading } = useAuth();

    const [employees, setEmployees] = useState<User[]>([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [filterRole, setFilterRole] = useState<"all" | Role>("all");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        jobTitle: "",
        role: "" as Role | "",
        password: "",
    });

    const loadEmployees = async () => {
        if (!token) return;

        try {
            setLoadingEmployees(true);
            setError("");

            const data = await getEmployees(token);
            setEmployees(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load employees");
        } finally {
            setLoadingEmployees(false);
        }
    };

    useEffect(() => {
        if (!isLoading && token) {
            loadEmployees();
        }
    }, [isLoading, token]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!token) {
            setError("You are not authenticated");
            return;
        }

        try {
            setError("");
            setSuccess("");

            const newEmployee = await createEmployee(token, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role as Role,
                jobTitle: formData.jobTitle || undefined,
            });

            setEmployees((prev) => [...prev, newEmployee]);

            setFormData({
                name: "",
                email: "",
                jobTitle: "",
                role: "",
                password: "",
            });

            setSuccess("Employee added successfully");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add employee");
        }
    };

    const handleDelete = async (id: number) => {
        if (!token) {
            setError("You are not authenticated");
            return;
        }

        try {
            setError("");
            setSuccess("");

            await deleteEmployee(token, id);
            setEmployees((prev) => prev.filter((employee) => employee.id !== id));
            setSuccess("Employee deleted successfully");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete employee");
        }
    };

    const filteredEmployees = useMemo(() => {
        if (filterRole === "all") return employees;
        return employees.filter((employee) => employee.role === filterRole);
    }, [employees, filterRole]);

    if (isLoading || loadingEmployees) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mt-2">Employees</h1>
                <h2 className="mt-2 text-gray-500">Manage your Employees</h2>

                <div className="bg-white rounded-xl border border-slate-200 p-6 mt-4 shadow-sm">
                    <p className="text-slate-500">Loading employees...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== "admin") {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mt-2">Employees</h1>
                <div className="bg-white rounded-xl border border-slate-200 p-6 mt-4 shadow-sm">
                    <p className="text-red-500">Access denied</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mt-2">Employees</h1>
            <h2 className="mt-2 text-gray-500">Manage your Employees</h2>

            <div className="bg-white rounded-xl border border-slate-200 p-6 mt-4 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Add New Employee
                </h2>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-600">
                        {success}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                >
                    <div>
                        <label className="block mb-1 font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Enter name"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Enter email"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Job Title</label>
                        <input
                            type="text"
                            name="jobTitle"
                            required
                            value={formData.jobTitle}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Enter job title"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Enter at least 6 characters"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Role</label>
                        <select
                            name="role"
                            required
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="">Select role</option>
                            <option value="admin">Admin</option>
                            <option value="employee">Employee</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg h-[42px]"
                    >
                        Add Employee
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mt-6">
                <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                        <UsersIcon className="w-5 h-5 mr-2 text-slate-500" />
                        Employees
                    </h2>

                    <div className="flex items-center">
                        <label className="text-sm font-medium text-slate-700 mr-2">
                            Filter by role
                        </label>

                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value as "all" | Role)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="all">All</option>
                            <option value="admin">Admin</option>
                            <option value="employee">Employee</option>
                        </select>
                    </div>
                </div>

                {filteredEmployees.length === 0 ? (
                    <EmptyState
                        title="No employees found"
                        description="No employees match the selected role."
                        icon={UsersIcon}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Job Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-slate-200">
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                        {employee.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {employee.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {employee.jobTitle || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 capitalize">
                                        {employee.role}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(employee.id)}
                                            className="text-rose-600 hover:text-rose-900 p-2 hover:bg-rose-50 rounded-lg"
                                        >
                                            <Trash2Icon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}