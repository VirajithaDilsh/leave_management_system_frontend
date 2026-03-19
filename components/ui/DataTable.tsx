"use client";

import React from "react";
import { EmptyState } from "./EmptyState";
import { InboxIcon } from "lucide-react";

export interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (row: T) => string;
    emptyMessage?: string;
}

export function DataTable<T>({
                                 columns,
                                 data,
                                 keyExtractor,
                                 emptyMessage = "No data available",
                             }: DataTableProps<T>) {
    if (data.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <EmptyState icon={InboxIcon} message={emptyMessage} />
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${
                                    col.className || ""
                                }`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-slate-200">
                    {data.map((row) => (
                        <tr
                            key={keyExtractor(row)}
                            className="hover:bg-slate-50 transition"
                        >
                            {columns.map((col, index) => (
                                <td
                                    key={index}
                                    className={`px-6 py-4 text-sm text-slate-700 ${
                                        col.className || ""
                                    }`}
                                >
                                    {typeof col.accessor === "function"
                                        ? col.accessor(row)
                                        : (row[col.accessor] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}