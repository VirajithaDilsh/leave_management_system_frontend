import { Navbar } from "@/components/NavBar";
import { Sidebar } from "@/components/SideBar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <div className="bg-gray-100 min-h-screen">
                <Navbar />
                <Sidebar />
                <main className="pt-16 pb-20 md:pb-6 md:ml-64 p-6 min-h-screen">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}