import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { getQueryFn } from "@/lib/queryClient";
import { type User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface PinGuardProps {
    children: React.ReactNode;
}

export default function PinGuard({ children }: PinGuardProps) {
    const [, navigate] = useLocation();
    const { toast } = useToast();
    const [hasChecked, setHasChecked] = useState(false);

    const { data: me, isLoading } = useQuery<User | null>({
        queryKey: ["/api/auth/me"],
        queryFn: getQueryFn({ on401: "returnNull" }),
    });

    useEffect(() => {
        if (isLoading || !me?.id) return;

        // Check if user has PIN set by trying to verify with a dummy PIN
        // This will return 404 if PIN is not set, 401 if PIN is set but wrong
        const checkPinStatus = async () => {
            try {
                const response = await fetch(`/api/users/${me.id}/verify-pin`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pin: "dummy" }),
                });

                if (response.status === 404) {
                    // PIN not set - redirect to profile
                    toast({
                        title: "PIN Required",
                        description: "You must set a transaction PIN before accessing this page.",
                        variant: "destructive",
                    });
                    navigate("/profile");
                    return;
                }

                // PIN is set (even if dummy PIN is wrong, we know PIN exists)
                setHasChecked(true);
            } catch (error) {
                console.error("Failed to check PIN status:", error);
                setHasChecked(true); // Allow access on error to avoid blocking users
            }
        };

        checkPinStatus();
    }, [me?.id, isLoading, navigate, toast]);

    // Show loading while checking PIN status
    if (isLoading || !hasChecked) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying security settings...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
