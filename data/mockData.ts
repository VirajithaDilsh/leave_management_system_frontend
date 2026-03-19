import { User, LeaveRequest } from '@/types'

const INITIAL_USERS: User[] = [
    {
        id: 'u1',
        name: 'Admin User',
        email: 'admin@company.com',
        password: 'admin123',
        role: 'admin',
        jobTitle: 'HR',
    },
    {
        id: 'u2',
        name: 'John Doe',
        email: 'john@company.com',
        password: 'john123',
        role: 'employee',
        jobTitle: 'Engineering',
    },
    {
        id: 'u3',
        name: 'Jane Smith',
        email: 'jane@company.com',
        password: 'jane123',
        role: 'employee',
        jobTitle: 'Marketing',
    },
]

const INITIAL_LEAVES: LeaveRequest[] = [
    {
        id: 'l1',
        employeeId: 'u2',
        employeeName: 'John Doe',
        type: 'annual',
        startDate: '2023-12-20',
        endDate: '2023-12-26',
        reason: 'Family vacation for the holidays',
        status: 'approved',
        appliedDate: '2023-11-15',
    },
    {
        id: 'l2',
        employeeId: 'u3',
        employeeName: 'Jane Smith',
        type: 'sick',
        startDate: '2023-10-10',
        endDate: '2023-10-12',
        reason: 'Flu',
        status: 'approved',
        appliedDate: '2023-10-09',
    },
    {
        id: 'l3',
        employeeId: 'u2',
        employeeName: 'John Doe',
        type: 'personal',
        startDate: '2024-05-15',
        endDate: '2024-05-16',
        reason: 'Personal errands',
        status: 'pending',
        appliedDate: '2024-05-01',
    },
]

// Initialize local storage with mock data if empty
export const initializeMockData = () => {
    // Check if users need password migration
    const existingUsers = localStorage.getItem('mock_users')
    if (existingUsers) {
        const users: User[] = JSON.parse(existingUsers)
        const needsMigration = users.some((u) => !u.password)
        if (needsMigration) {
            // Merge passwords from initial data or set defaults
            const migrated = users.map((u) => {
                if (u.password) return u
                const initial = INITIAL_USERS.find((iu) => iu.id === u.id)
                return { ...u, password: initial?.password || 'password123' }
            })
            localStorage.setItem('mock_users', JSON.stringify(migrated))
        }
    } else {
        localStorage.setItem('mock_users', JSON.stringify(INITIAL_USERS))
    }
    if (!localStorage.getItem('mock_leaves')) {
        localStorage.setItem('mock_leaves', JSON.stringify(INITIAL_LEAVES))
    }
}

// Data Access Helpers
export const getUsers = (): User[] => {
    return JSON.parse(localStorage.getItem('mock_users') || '[]')
}

export const saveUsers = (users: User[]) => {
    localStorage.setItem('mock_users', JSON.stringify(users))
}

export const getLeaves = (): LeaveRequest[] => {
    return JSON.parse(localStorage.getItem('mock_leaves') || '[]')
}

export const saveLeaves = (leaves: LeaveRequest[]) => {
    localStorage.setItem('mock_leaves', JSON.stringify(leaves))
}

export const updateUserPassword = (
    userId: string,
    newPassword: string,
): boolean => {
    const users = getUsers()
    const index = users.findIndex((u) => u.id === userId)
    if (index === -1) return false
    users[index].password = newPassword
    saveUsers(users)
    return true
}
