import type { CreateLeaveInput, LeaveRequest } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function createLeave(
    token: string,
    data: CreateLeaveInput
): Promise<LeaveRequest> {
    const response = await fetch(`${API_URL}/leaves`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(result?.error || "Failed to create leave request");
    }

    return result as LeaveRequest;
}

export async function getMyLeaves(token: string): Promise<LeaveRequest[]> {
    const response = await fetch(`${API_URL}/leaves/my`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(result?.error || "Failed to fetch my leaves");
    }

    return result as LeaveRequest[];
}

export async function getAllLeaves(token: string): Promise<LeaveRequest[]> {
    const response = await fetch(`${API_URL}/leaves`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(result?.error || "Failed to fetch leave requests");
    }

    return result as LeaveRequest[];
}

export async function approveLeave(token: string, id: number): Promise<void> {
    const response = await fetch(`${API_URL}/leaves/${id}/approve`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(result?.error || "Failed to approve leave");
    }
}

export async function rejectLeave(token: string, id: number): Promise<void> {
    const response = await fetch(`${API_URL}/leaves/${id}/reject`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(result?.error || "Failed to reject leave");
    }
}