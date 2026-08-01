import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { type User } from "@shared/schema";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const [, navigate] = useLocation();
    const { data: me, isLoading } = useQuery<User | null>({
        queryKey: ["/api/auth/me"],
        queryFn: getQueryFn({ on401: "returnNull" }),
    });

    useEffect(() => {
        if (isLoading) return;
        if (!me) {
            navigate("/admin/login");
            return;
        }
        // @ts-ignore
        if ((me as any).role !== 'ADMIN') {
            navigate("/dashboard");
        }
    }, [me, isLoading, navigate]);

    if (isLoading || !me) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}


