
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Transfer, Account, type InsertTransfer, type User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, DollarSign, KeyRound, PencilLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import PageLayout from "@/components/page-layout";
import PinGuard from "@/components/pin-guard";
import { useLocation } from "wouter";

type TransferFormValues = {
    userId?: number;
    fromAccountId?: string;
    toAccountId?: string;
    amount: string;
    transferType: string;
    remarks?: string | null;
    status?: string;
    fees?: string;
    pin?: string;
};

export default function InternalTransfer() {
    const [, navigate] = useLocation();

    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: me } = useQuery<User | null>({
        queryKey: ["/api/auth/me"],
        queryFn: getQueryFn({ on401: "returnNull" }),
    });

    const userId = me?.id;

    const { data: transfers = [], isLoading: transfersLoading } = useQuery<Transfer[]>({
        queryKey: ["/api/transfers", String(userId ?? ""), "INTERNAL"],
        enabled: !!userId,
    });

    const { data: accounts = [] } = useQuery<Account[]>({
        queryKey: ["/api/accounts", String(userId ?? "")],
        enabled: !!userId,
    });

    const form = useForm<TransferFormValues>({
        defaultValues: {
            amount: "",
            transferType: "INTERNAL",
            remarks: "",
            status: "PENDING",
            fees: "0.00",
            pin: "",
        },
    });

    const createTransferMutation = useMutation({
        mutationFn: async (data: InsertTransfer) => {
            const response = await apiRequest("POST", "/api/transfers/internal", data);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/transactions", `${String(userId ?? "")}`] });
            toast({ title: "Success", description: "Internal transfer initiated. Redirecting…" });
            setTimeout(() => {
                navigate("/dashboard");
            }, 1800);
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message || "Failed to create transaction", variant: "destructive" });
        },
    });

    const onSubmit = (values: TransferFormValues) => {
        if (!userId || !values.fromAccountId) return;
        if (!values.toAccountId) {
            toast({ title: "Select destination account", variant: "destructive" });
            return;
        }
        if (values.fromAccountId === values.toAccountId) {
            toast({ title: "Accounts must be different", description: "Select different From and To accounts", variant: "destructive" });
            return;
        }
        const payload: InsertTransfer = {
            userId: Number(userId),
            fromAccountId: Number(values.fromAccountId),
            toAccountId: Number(values.toAccountId),
            amount: values.amount,
            transferType: "INTERNAL",
            remarks: values.remarks || undefined,
            status: (values.status as any) || "PENDING",
            fees: values.fees || "0.00",
        } as InsertTransfer;
        createTransferMutation.mutate(payload);
    };

    if (transfersLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading transfers...</p>
                </div>
            </div>
        );
    }

    return (
        <PageLayout>


            <PinGuard>
                <div className="">

                    <Card className="bg-inherit py-5">
                        <CardContent className="space-y-4 divide-y">
                            <div className="bg-primary text-white px-4 py-3">
                                <h2 className="text-lg font-semibold">Internal Transfer</h2>
                            </div>

                            <div className="pt-4">
                                <h3 className="text-banking-primary font-semibold">Italian Internal Transfer</h3>
                                <p className="text-gray-500 text-sm">Transfer Funds to a internal account</p>
                            </div>

                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* From */}
                                <div className="space-y-2">
                                    <Label className="text-gray-700" htmlFor="from">From</Label>
                                    <div className="flex items-center gap-3 border-b pb-2">
                                        <CreditCard className="w-5 h-5 text-gray-500" />
                                        <Select
                                            value={form.watch("fromAccountId") || ""}
                                            onValueChange={(v) => {
                                                form.setValue("fromAccountId", v);
                                                if (v && v === form.watch("toAccountId")) {
                                                    form.setValue("toAccountId", "");
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="border-0 shadow-none p-0 py-3 h-auto focus:ring-0 uppercase">
                                                <SelectValue placeholder="Select account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {accounts.map((a) => (
                                                    <SelectItem
                                                        key={a.id}
                                                        value={String(a.id)}
                                                        disabled={String(a.id) === (form.watch("toAccountId") || "")}
                                                        className="uppercase"
                                                    >
                                                        {a.accountType} • {Number(a.balance).toLocaleString(undefined, { style: "currency", currency: "USD" })}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>


                                <div className="space-y-2">
                                    <Label className="text-gray-700" htmlFor="to">To</Label>
                                    <div className="flex items-center gap-3 border-b pb-2">
                                        <CreditCard className="w-5 h-5 text-gray-500" />
                                        <Select
                                            value={form.watch("toAccountId") || ""}
                                            onValueChange={(v) => {
                                                form.setValue("toAccountId", v);
                                                if (v && v === form.watch("fromAccountId")) {
                                                    form.setValue("fromAccountId", "");
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="border-0 shadow-none p-0 py-3 h-auto focus:ring-0 uppercase">
                                                <SelectValue placeholder="Select account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {accounts.map((a) => (
                                                    <SelectItem
                                                        key={a.id}
                                                        value={String(a.id)}
                                                        className="uppercase"
                                                        disabled={String(a.id) === (form.watch("fromAccountId") || "")}
                                                    >
                                                        {a.accountType} • {Number(a.balance).toLocaleString(undefined, { style: "currency", currency: "USD" })}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="space-y-2">
                                    <Label className="text-gray-700" htmlFor="amount">Enter Amount</Label>
                                    <div className="flex items-center gap-3 border-b pb-2">
                                        <DollarSign className="w-5 h-5 text-gray-500" />
                                        <Input id="amount" type="number" step="0.01" className="border-0 shadow-none focus-visible:ring-0 px-0" {...form.register("amount")} />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-gray-700" htmlFor="remarks">Remarks</Label>
                                    <div className="flex items-center gap-3 border-b pb-2">
                                        <PencilLine className="w-5 h-5 text-gray-500" />
                                        <Input id="remarks" className="border-0 shadow-none focus-visible:ring-0 px-0" {...form.register("remarks")} />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-gray-700" htmlFor="pin">PIN</Label>
                                    <div className="flex items-center gap-3 border-b pb-2">
                                        <KeyRound className="w-5 h-5 text-gray-500" />
                                        <Input id="pin" type="password" className="border-0 shadow-none focus-visible:ring-0 px-0" {...form.register("pin")} />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button type="submit" className="bg-primary hover:bg-primary-dark w-full" disabled={createTransferMutation.isPending}> {createTransferMutation.isPending ? "Processing…" : "Proceed"} </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

            </PinGuard>
        </PageLayout>
    );
}


