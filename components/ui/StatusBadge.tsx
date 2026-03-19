"use client";

import React from "react";
import { LeaveStatus } from "@/types";

interface StatusBadgeProps {
    status: LeaveStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const styles: Record<LeaveStatus, string> = {
        approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        rejected: "bg-rose-100 text-rose-700 border-rose-200",
        cancelled: "bg-slate-100 text-slate-700 border-slate-200",
    };

    const labels: Record<LeaveStatus, string> = {
        approved: "Approved",
        pending: "Pending",
        rejected: "Rejected",
        cancelled: "Cancelled",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
        >
      {labels[status]}
    </span>
    );
};