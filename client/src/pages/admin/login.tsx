import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";

import { useToast } from "@/hooks/use-toast";
import GuestGuard from "@/components/guest-guard";

type AdminLoginForm = { username: string; password: string };

export default function AdminLogin() {
    const [, navigate] = useLocation();
    const { toast } = useToast();
    const form = useForm<AdminLoginForm>({ defaultValues: { username: "", password: "" } });

    const login = useMutation({
        mutationFn: async (values: AdminLoginForm) => {
            const res = await apiRequest("POST", "/api/auth/login", values);
            if (!res.ok) {
                const body = await res.json();
                throw new Error(body?.message || "Login failed");
            }
            return res.json();
        },
        onSuccess: async (sessionUser: any) => {
            const meRes = await apiRequest("GET", "/api/auth/me");
            const me = await meRes.json();
            queryClient.setQueryData(["/api/auth/me"], me);

            if (sessionUser?.role === "ADMIN") {
                toast({ title: "Welcome", description: "Signed in as admin" });
                navigate("/admin");
            } else {
                toast({ title: "Access denied", description: "Admin role required", variant: "destructive" });
            }
        },
        onError: (e: any) => toast({ title: "Login failed", description: e?.message || "Invalid credentials", variant: "destructive" }),
    });

    const onSubmit = (v: AdminLoginForm) => login.mutate(v);

    return (
        <GuestGuard redirectTo="/dashboard">
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Admin Login</h1>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white border rounded-md p-6 shadow-sm">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" placeholder="Enter admin username" {...form.register("username", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="Enter password" {...form.register("password", { required: true })} />
                        </div>
                        <Button type="submit" className="bg-banking-primary hover:bg-banking-primary-dark w-full" disabled={login.isPending}>
                            {login.isPending ? "Signing in…" : "Sign in"}
                        </Button>
                    </form>
                </div>
            </div>
        </GuestGuard>
    );
}


