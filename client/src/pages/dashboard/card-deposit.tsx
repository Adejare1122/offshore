import { useMemo, useRef, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import PageLayout from "@/components/page-layout";
import PinGuard from "@/components/pin-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { getQueryFn } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Account, type User, type Beneficiary, type InsertTransfer, type InsertBeneficiary } from "@shared/schema";
import { CreditCard, DollarSign, Landmark, RefreshCw, MapPin, PencilLine, KeyRound, Plus } from "lucide-react";

type FormValues = {
    toAccountId: string;
    amount: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    pin: string;
};

export default function CardDeposit() {
    const [, navigate] = useLocation();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { data: me } = useQuery<User | null>({
        queryKey: ["/api/auth/me"],
        queryFn: getQueryFn({ on401: "returnNull" }),
    });
    const userId = me?.id;

    const { data: accounts = [] } = useQuery<Account[]>({
        queryKey: ["/api/accounts", String(userId ?? "")],
        enabled: !!userId,
    });

    const form = useForm<FormValues>({
        defaultValues: {
            amount: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            toAccountId: "",
            pin: ""
        },
    });


    const createDepositMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("POST", "/api/deposits/card", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/transactions", `${String(userId ?? "")}`] });
            toast({ title: "Success", description: "Card deposit initiated. Redirecting…" });
            setTimeout(() => {
                navigate("/dashboard");
            }, 1800);
        },
        onError: (e: any) => {
            toast({ title: "Transfer failed", description: e?.message || "Failed to create transfer", variant: "destructive" });
        },
    });

    const onSubmit = async (values: FormValues) => {
        if (!userId || !values.toAccountId) {
            toast({ title: "Missing fields", description: "Select account and fill required fields", variant: "destructive" });
            return;
        }

        // Verify PIN: if set but wrong, block
        // try {
        //     const verifyRes = await apiRequest("POST", `/api/users/${userId}/verify-pin`, { pin: values.pin });
        //     if (!verifyRes.ok) {
        //         const body = await verifyRes.json();
        //         toast({ title: "Invalid PIN", description: body?.message || "Please check your PIN", variant: "destructive" });
        //         return;
        //     }
        // } catch (e: any) {
        //     toast({ title: "PIN check failed", description: e?.message || "Try again", variant: "destructive" });
        //     return;
        // }

        const payload = {
            userId: Number(userId),
            toAccountId: Number(values.toAccountId),
            cardNumber: (values.cardNumber || '').replace(/\s+/g, ''),
            expiryDate: values.expiryDate,
            cvv: values.cvv,
            pin: values.pin,
            amount: values.amount,
            transferType: "CARD",
            description: undefined,
            status: "PENDING",
        } as any;

        createDepositMutation.mutate(payload);
    };

    return (

        <PageLayout>
            <PinGuard>
                <div className="">

                    <Card className="bg-inherit py-5">
                        <CardContent className="space-y-4 divide-y">
                            <div className="bg-primary text-white px-4 py-3">
                                <h2 className="text-lg font-semibold">Card Deposit</h2>
                            </div>

                            <div className="pt-4">
                                <h3 className="text-banking-primary font-semibold">Italian Secure Card Deposit</h3>
                                <p className="text-gray-500 text-sm">Fund your Italian National Offshore account from your External Debit/Credit Card</p>
                            </div>

                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* From */}
                                <div className="space-y-2">
                                    <Label className="text-gray-700" htmlFor="from">Account to Deposit</Label>
                                    <div className="flex items-center gap-3 border-b pb-2">
                                        <Select value={form.watch("toAccountId") || ""} onValueChange={(v) => form.setValue("toAccountId", v)}>
                                            <SelectTrigger className="border-0 shadow-none p-0 py-3 h-auto focus:ring-0">
                                                <SelectValue placeholder="Select Account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {accounts.map((a) => (
                                                    <SelectItem key={a.id} value={String(a.id)}>
                                                        {a.accountType}
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
                                        <Input id="amount" type="number" step="0.01" className="border-0 shadow-none focus-visible:ring-0 px-0" {...form.register("amount")} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-700" htmlFor="cardNumber">Card Number</Label>
                                    <div className="flex items-center gap-3 border-b pb-2">
                                        <Input
                                            id="cardNumber"
                                            inputMode="numeric"
                                            autoComplete="cc-number"
                                            maxLength={19}
                                            placeholder="1234 5678 9012 3456"
                                            className="border-0 shadow-none focus-visible:ring-0 px-0"
                                            {...form.register("cardNumber", {
                                                onChange: (e: any) => {
                                                    const digits = String(e.target.value || '').replace(/\D/g, '').slice(0, 16);
                                                    const masked = digits.replace(/(.{4})/g, '$1 ').trim();
                                                    form.setValue('cardNumber', masked, { shouldValidate: true });
                                                }
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-700" htmlFor="ibanOrAccount">Expiry Date</Label>
                                    <div className="flex items-center gap-3 border-b pb-2">
                                        <Input
                                            id="expiry"
                                            inputMode="numeric"
                                            autoComplete="cc-exp"
                                            maxLength={5}
                                            placeholder="MM/YY"
                                            className="border-0 shadow-none focus-visible:ring-0 px-0"
                                            {...form.register("expiryDate", {
                                                onChange: (e: any) => {
                                                    const digits = String(e.target.value || '').replace(/\D/g, '').slice(0, 4);
                                                    const mm = digits.slice(0, 2);
                                                    const yy = digits.slice(2, 4);
                                                    const next = yy ? `${mm}/${yy}` : mm;
                                                    form.setValue('expiryDate', next, { shouldValidate: true });
                                                }
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-700" htmlFor="ibanOrAccount">CVV</Label>
                                    <div className="flex items-center gap-3 border-b pb-2">
                                        <Input
                                            id="cvv"
                                            inputMode="numeric"
                                            autoComplete="cc-csc"
                                            maxLength={4}
                                            placeholder="123"
                                            className="border-0 shadow-none focus-visible:ring-0 px-0"
                                            {...form.register("cvv", {
                                                onChange: (e: any) => {
                                                    const digits = String(e.target.value || '').replace(/\D/g, '').slice(0, 4);
                                                    form.setValue('cvv', digits, { shouldValidate: true });
                                                }
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-gray-700" htmlFor="pin">Card PIN</Label>
                                    <div className="flex items-center gap-3 border-b pb-2">
                                        <Input id="pin" type="password" className="border-0 shadow-none focus-visible:ring-0 px-0" {...form.register("pin")} />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button type="submit" className="bg-primary hover:bg-primary-dark w-full" disabled={createDepositMutation.isPending}> {createDepositMutation.isPending ? "Processing…" : "Proceed"} </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </PinGuard>
        </PageLayout>

    );
}


