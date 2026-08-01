import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { type User } from "@shared/schema";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function GuestGuard({ children, redirectTo = "/dashboard" }: { children: React.ReactNode; redirectTo?: string }) {
    const [, navigate] = useLocation();
    const { data: me, isLoading } = useQuery<User | null>({
        queryKey: ["/api/auth/me"],
        queryFn: getQueryFn({ on401: "returnNull" }),
    });

    useEffect(() => {
        if (isLoading) return;
        if (me) {
            // @ts-ignore
            if ((me as any).role === 'ADMIN') navigate('/admin');
            else navigate(redirectTo);
        }
    }, [me, isLoading, navigate, redirectTo]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading…</p>
                </div>
            </div>
        );
    }

    if (me) return null;
    return <>{children}</>;
}


