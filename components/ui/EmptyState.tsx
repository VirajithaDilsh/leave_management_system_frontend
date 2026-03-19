"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    message: string;
    description?: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
                                                          icon: Icon,
                                                          message,
                                                          description,
                                                          action,
                                                      }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Icon className="w-8 h-8 text-slate-400" />
            </div>

            <h3 className="text-lg font-medium text-slate-900 mb-1">
                {message}
            </h3>

            {description && (
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                    {description}
                </p>
            )}

            {action && <div>{action}</div>}
        </div>
    );
};