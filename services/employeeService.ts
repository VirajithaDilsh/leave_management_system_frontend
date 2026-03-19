import type { CreateEmployeeInput, User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function getEmployees(token: string): Promise<User[]> {
    const response = await fetch(`${API_URL}/employees`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(result?.error || "Failed to fetch employees");
    }

    return result as User[];
}

export async function createEmployee(
    token: string,
    data: CreateEmployeeInput
): Promise<User> {
    const response = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(result?.error || "Failed to create employee");
    }

    return result.user as User;
}

export async function deleteEmployee(
    token: string,
    employeeId: number
): Promise<void> {
    const response = await fetch(`${API_URL}/employees/${employeeId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(result?.error || "Failed to delete employee");
    }
}