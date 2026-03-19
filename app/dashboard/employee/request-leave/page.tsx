"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createLeave } from "@/services/leaveService";
import { LeaveType } from "@/types";

export default function ApplyLeave() {
    const { user, token } = useAuth();
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        leaveType: "annual" as LeaveType,
        startDate: "",
        endDate: "",
        reason: "",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!user || !token) {
            setError("User not authenticated.");
            return;
        }

        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            setError("End date cannot be before start date.");
            return;
        }

        try {
            setIsSubmitting(true);

            await createLeave(token, {
                leaveType: formData.leaveType,
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason,
            });

            setSuccess(true);

            setTimeout(() => {
                router.push("/dashboard/employee/my-leaves");
            }, 1500);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to submit leave request."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-2">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Apply for Leave</h2>
                <p className="text-slate-500 mt-1">
                    Submit a new leave request for approval.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
                {success ? (
                    <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-emerald-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>

                        <h3 className="text-xl font-medium text-slate-900 mb-2">
                            Request Submitted!
                        </h3>

                        <p className="text-slate-500">
                            Your leave request has been sent for approval.
                        </p>

                        <p className="text-sm text-slate-400 mt-4">
                            Redirecting to your leaves...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-200">
                                {error}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="leaveType"
                                className="block text-sm font-medium text-slate-700 mb-1"
                            >
                                Leave Type
                            </label>
                            <select
                                id="leaveType"
                                name="leaveType"
                                required
                                value={formData.leaveType}
                                onChange={handleChange}
                                className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                            >
                                <option value="annual">Annual Leave</option>
                                <option value="sick">Sick Leave</option>
                                <option value="personal">Personal Leave</option>
                                <option value="maternity">Maternity Leave</option>
                                <option value="paternity">Paternity Leave</option>
                                <option value="unpaid">Unpaid Leave</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="startDate"
                                    className="block text-sm font-medium text-slate-700 mb-1"
                                >
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    required
                                    min={new Date().toISOString().split("T")[0]}
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="endDate"
                                    className="block text-sm font-medium text-slate-700 mb-1"
                                >
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    required
                                    min={
                                        formData.startDate || new Date().toISOString().split("T")[0]
                                    }
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="reason"
                                className="block text-sm font-medium text-slate-700 mb-1"
                            >
                                Reason
                            </label>
                            <textarea
                                id="reason"
                                name="reason"
                                rows={4}
                                required
                                value={formData.reason}
                                onChange={handleChange}
                                placeholder="Please provide a brief reason for your leave..."
                                className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
                            />
                        </div>

                        <div className="pt-2 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => router.push("/dashboard/employee")}
                                className="px-4 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Request"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}