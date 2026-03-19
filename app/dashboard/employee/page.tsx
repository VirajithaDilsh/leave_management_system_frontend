"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMyLeaves } from "@/services/leaveService";
import type { LeaveRequest } from "@/types";
import { StatCard } from "@/components/ui/StatCards";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
} from "lucide-react";

export default function Page() {
    const { user, token } = useAuth();
    const [myLeaves, setMyLeaves] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadLeaves = async () => {
            if (!user || !token) {
                setMyLeaves([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data = await getMyLeaves(token);
                setMyLeaves(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to load leave data"
                );
                setMyLeaves([]);
            } finally {
                setLoading(false);
            }
        };

        loadLeaves();
    }, [user, token]);

    const stats = useMemo(
        () => ({
            total: myLeaves.length,
            approved: myLeaves.filter((leave) => leave.status === "approved").length,
            pending: myLeaves.filter((leave) => leave.status === "pending").length,
            rejected: myLeaves.filter((leave) => leave.status === "rejected").length,
        }),
        [myLeaves]
    );

    const recentLeaves = useMemo(
        () =>
            [...myLeaves]
                .sort(
                    (a, b) =>
                        new Date(b.createdAt || "").getTime() -
                        new Date(a.createdAt || "").getTime()
                )
                .slice(0, 5),
        [myLeaves]
    );

    const columns: Column<LeaveRequest>[] = [
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
            header: "Applied On",
            accessor: (row) =>
                row.createdAt
                    ? new Date(row.createdAt).toLocaleDateString()
                    : "-",
        },
        {
            header: "Status",
            accessor: (row) => <StatusBadge status={row.status} />,
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">
                    Welcome back, {user?.name?.split(" ")[0] || "User"}!
                </h2>
                <p className="mt-1 text-slate-500">
                    Here is a summary of your leave requests.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Leaves"
                    value={stats.total}
                    icon={CalendarIcon}
                    iconColor="text-indigo-600"
                    iconBgColor="bg-indigo-50"
                />
                <StatCard
                    title="Approved"
                    value={stats.approved}
                    icon={CheckCircleIcon}
                    iconColor="text-emerald-600"
                    iconBgColor="bg-emerald-50"
                />
                <StatCard
                    title="Pending"
                    value={stats.pending}
                    icon={ClockIcon}
                    iconColor="text-amber-600"
                    iconBgColor="bg-amber-50"
                />
                <StatCard
                    title="Rejected"
                    value={stats.rejected}
                    icon={XCircleIcon}
                    iconColor="text-rose-600"
                    iconBgColor="bg-rose-50"
                />
            </div>

            <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Recent Leave Requests
                    </h3>
                </div>

                {loading ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
                        Loading leave requests...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={recentLeaves}
                        keyExtractor={(row) => String(row.id)}
                        emptyMessage="You haven't applied for any leaves yet."
                    />
                )}
            </div>
        </div>
    );
}