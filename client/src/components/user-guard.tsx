import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { type User } from "@shared/schema";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function UserGuard({ children }: { children: React.ReactNode }) {
    const [, navigate] = useLocation();
    const { data: me, isLoading } = useQuery<User | null>({
        queryKey: ["/api/auth/me"],
        queryFn: getQueryFn({ on401: "returnNull" }),
    });

    useEffect(() => {
        if (isLoading) return;
        if (!me) navigate("/");
    }, [me, isLoading, navigate]);

    if (isLoading || !me) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking session…</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}


