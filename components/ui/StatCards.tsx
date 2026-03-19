"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconColor?: string;
    iconBgColor?: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
}

export const StatCard: React.FC<StatCardProps> = ({
                                                      title,
                                                      value,
                                                      icon: Icon,
                                                      iconColor = "text-indigo-600",
                                                      iconBgColor = "bg-indigo-50",
                                                      trend,
                                                  }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-4">
            <div className={`p-3 rounded-lg ${iconBgColor}`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>

            <div className="flex-1">
                <h3 className="text-sm font-medium text-slate-500">{title}</h3>

                <div className="flex items-baseline space-x-2 mt-1">
                    <p className="text-2xl font-semibold text-slate-900">{value}</p>

                    {trend && (
                        <span
                            className={`text-xs font-medium ${
                                trend.isPositive ? "text-emerald-600" : "text-rose-600"
                            }`}
                        >
              {trend.isPositive ? "+" : "-"}
                            {trend.value}
            </span>
                    )}
                </div>
            </div>
        </div>
    );
};