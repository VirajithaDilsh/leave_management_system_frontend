export type Role = "employee" | "admin";

export type LeaveStatus = "pending" | "approved" | "rejected";

export type LeaveType =
    | "annual"
    | "sick"
    | "personal"
    | "maternity"
    | "paternity"
    | "unpaid";

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    jobTitle?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface LeaveRequest {
    id: number;
    employeeId: number;
    employee?: User;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    status: LeaveStatus;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface CreateEmployeeInput {
    name: string;
    email: string;
    password: string;
    role: Role;
    jobTitle?: string;
}

export interface CreateLeaveInput {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
}