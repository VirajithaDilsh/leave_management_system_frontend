"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMyLeaves } from "@/services/leaveService";
import type { LeaveRequest } from "@/types";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function Page() {
    const { user, token } = useAuth();
    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadLeaves = async () => {
            if (!user || !token) {
                setLeaves([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data = await getMyLeaves(token);

                const sortedLeaves = [...data].sort(
                    (a, b) =>
                        new Date(b.createdAt || "").getTime() -
                        new Date(a.createdAt || "").getTime()
                );

                setLeaves(sortedLeaves);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to load leave requests"
                );
                setLeaves([]);
            } finally {
                setLoading(false);
            }
        };

        loadLeaves();
    }, [user, token]);

    const columns: Column<LeaveRequest>[] = [
        {
            header: "Leave Type",
            accessor: (row) => (
                <div>
                    <div className="font-medium text-slate-900 capitalize">
                        {row.leaveType}
                    </div>
                    <div
                        className="mt-0.5 max-w-[200px] truncate text-xs text-slate-500"
                        title={row.reason}
                    >
                        {row.reason}
                    </div>
                </div>
            ),
        },
        {
            header: "Duration",
            accessor: (row) => (
                <div className="text-slate-600">
                    <div>{row.startDate}</div>
                    <div className="text-xs text-slate-400">
                        to {row.endDate}
                    </div>
                </div>
            ),
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
                    My Leaves
                </h2>
                <p className="mt-1 text-slate-500">
                    View the status and history of all your leave requests.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
                    Loading leave requests...
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={leaves}
                    keyExtractor={(row) => String(row.id)}
                    emptyMessage="You haven't applied for any leaves yet."
                />
            )}
        </div>
    );
}