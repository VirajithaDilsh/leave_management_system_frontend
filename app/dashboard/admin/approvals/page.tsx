"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllLeaves, approveLeave, rejectLeave } from "@/services/leaveService";
import type { LeaveRequest } from "@/types";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CheckIcon, XIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
    const { token, user } = useAuth();

    const [filter, setFilter] = useState<"all" | "pending">("pending");
    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadLeaves = async () => {
            if (!token) {
                setLeaves([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data = await getAllLeaves(token);

                const sortedLeaves = [...data].sort((a, b) => {
                    if (a.status === "pending" && b.status !== "pending") return -1;
                    if (a.status !== "pending" && b.status === "pending") return 1;

                    return (
                        new Date(b.createdAt || "").getTime() -
                        new Date(a.createdAt || "").getTime()
                    );
                });

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
    }, [token]);

    const handleAction = async (
        id: number,
        status: "approved" | "rejected"
    ) => {
        if (!token) return;

        try {
            setError("");

            if (status === "approved") {
                await approveLeave(token, id);
            } else {
                await rejectLeave(token, id);
            }

            setLeaves((prev) =>
                prev.map((leave) =>
                    leave.id === id ? { ...leave, status } : leave
                )
            );
        } catch (err) {
            setError(
                err instanceof Error ? err.message : `Failed to ${status} leave`
            );
        }
    };

    const filteredLeaves = useMemo(() => {
        return filter === "pending"
            ? leaves.filter((l) => l.status === "pending")
            : leaves;
    }, [filter, leaves]);

    const columns: Column<LeaveRequest>[] = [
        {
            header: "Employee",
            accessor: (row) => (
                <div>
                    <div className="font-medium text-slate-900">
                        {row.employee?.name || `Employee #${row.employeeId}`}
                    </div>
                    <div className="text-xs text-slate-500 capitalize">
                        {row.leaveType} Leave
                    </div>
                </div>
            ),
        },
        {
            header: "Dates",
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
            header: "Reason",
            accessor: (row) => (
                <div className="max-w-[200px] truncate" title={row.reason}>
                    {row.reason}
                </div>
            ),
        },
        {
            header: "Status",
            accessor: (row) => <StatusBadge status={row.status} />,
        },
        {
            header: "Actions",
            accessor: (row) =>
                row.status === "pending" ? (
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={() => handleAction(row.id, "approved")}
                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md"
                        >
                            <CheckIcon className="w-4 h-4" />
                        </button>

                        <button
                            type="button"
                            onClick={() => handleAction(row.id, "rejected")}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <span className="text-xs text-slate-400 italic">
                        Processed
                    </span>
                ),
        },
    ];

    if (!user || user.role !== "admin") {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">
                    Leave Approvals
                </h2>
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    Access denied
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">
                Leave Approvals
            </h2>

            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
                <button
                    type="button"
                    onClick={() => setFilter("pending")}
                    className={`px-4 py-1.5 text-sm rounded-md ${
                        filter === "pending"
                            ? "bg-white shadow"
                            : "text-slate-500"
                    }`}
                >
                    Pending
                </button>

                <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className={`px-4 py-1.5 text-sm rounded-md ${
                        filter === "all"
                            ? "bg-white shadow"
                            : "text-slate-500"
                    }`}
                >
                    All
                </button>
            </div>

            {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
                    Loading leave requests...
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredLeaves}
                    keyExtractor={(row) => String(row.id)}
                />
            )}
        </div>
    );
}