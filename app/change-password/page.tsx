"use client";

import React, { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function ChangePasswordPage() {
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!token) {
            setError("You are not authenticated");
            return;
        }

        if (
            !formData.currentPassword ||
            !formData.newPassword ||
            !formData.confirmPassword
        ) {
            setError("Fill all fields");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError("New password must be different from current password");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch(`${API_URL}/auth/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(result?.error || "Failed to update password");
            }

            setSuccess("Password updated successfully");

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setTimeout(() => {
                router.back(); // or /dashboard/admin or employee
            }, 800);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update password"
            );
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <LockKeyhole className="w-7 h-7 text-white" />
                    </div>
                </div>

                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Change Password
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-600">
                                {success}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="currentPassword"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Current Password
                            </label>

                            <div className="mt-1">
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    required
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                                    placeholder="Enter current password"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-slate-700"
                            >
                                New Password
                            </label>

                            <div className="mt-1">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Confirm Password
                            </label>

                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98]"
                            >
                                {isSubmitting ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}