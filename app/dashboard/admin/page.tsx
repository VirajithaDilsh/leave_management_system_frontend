"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getEmployees } from "@/services/employeeService";
import { getAllLeaves } from "@/services/leaveService";
import type { LeaveRequest, User } from "@/types";
import { StatCard } from "@/components/ui/StatCards";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
    UsersIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
} from "lucide-react";

export default function Page() {
    const { token, user } = useAuth();

    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboardData = async () => {
            if (!token) {
                setLeaves([]);
                setUsers([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const [employeesData, leavesData] = await Promise.all([
                    getEmployees(token),
                    getAllLeaves(token),
                ]);

                setUsers(employeesData);
                setLeaves(leavesData);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to load dashboard data"
                );
                setUsers([]);
                setLeaves([]);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [token]);

    const stats = useMemo(
        () => ({
            employees: users.filter((u) => u.role === "employee").length,
            totalLeaves: leaves.length,
            approved: leaves.filter((l) => l.status === "approved").length,
            pending: leaves.filter((l) => l.status === "pending").length,
        }),
        [users, leaves]
    );

    const recentPending = useMemo(
        () =>
            [...leaves]
                .filter((l) => l.status === "pending")
                .sort(
                    (a, b) =>
                        new Date(b.createdAt || "").getTime() -
                        new Date(a.createdAt || "").getTime()
                )
                .slice(0, 5),
        [leaves]
    );

    const columns: Column<LeaveRequest>[] = [
        {
            header: "Employee",
            accessor: (row) => (
                <span className="font-medium text-slate-900">
                    {row.employee?.name || `Employee #${row.employeeId}`}
                </span>
            ),
        },
        {
            header: "Type",
            accessor: (row) => (
                <span className="capitalize">{row.leaveType}</span>
            ),
        },
        {
            header: "Duration",
            accessor: (row) => `${row.startDate} to ${row.endDate}`,
        },
        {
            header: "Status",
            accessor: (row) => <StatusBadge status={row.status} />,
        },
    ];

    if (!user || user.role !== "admin") {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mt-6">
                        Admin Dashboard
                    </h2>
                </div>

                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    Access denied
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mt-6">
                    Admin Dashboard
                </h2>
            </div>

            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Employees"
                    value={stats.employees}
                    icon={UsersIcon}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-50"
                />
                <StatCard
                    title="Total Leave Requests"
                    value={stats.totalLeaves}
                    icon={CalendarIcon}
                    iconColor="text-indigo-600"
                    iconBgColor="bg-indigo-50"
                />
                <StatCard
                    title="Pending Approvals"
                    value={stats.pending}
                    icon={ClockIcon}
                    iconColor="text-amber-600"
                    iconBgColor="bg-amber-50"
                />
                <StatCard
                    title="Approved Leaves"
                    value={stats.approved}
                    icon={CheckCircleIcon}
                    iconColor="text-emerald-600"
                    iconBgColor="bg-emerald-50"
                />
            </div>

            <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Recent Pending Requests
                    </h3>
                </div>

                {loading ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
                        Loading dashboard data...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={recentPending}
                        keyExtractor={(row) => String(row.id)}
                        emptyMessage="No pending leave requests at the moment."
                    />
                )}
            </div>
        </div>
    );
}