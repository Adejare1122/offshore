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
    fromAccountId?: string;
    amount: string;
    beneficiaryName: string;
    ibanOrAccount: string;
    bankName: string;
    routingNumber: string;
    bankAddress?: string;
    remarks?: string;
    pin?: string;
};

export default function LocalTransferNew() {
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

    const { data: beneficiaries = [] } = useQuery<Beneficiary[]>({
        queryKey: ["/api/beneficiaries", String(userId ?? "")],
        enabled: !!userId,
    });

    const form = useForm<FormValues>({
        defaultValues: {
            amount: "",
            beneficiaryName: "",
            ibanOrAccount: "",
            bankName: "",
            routingNumber: "",
            bankAddress: "",
            remarks: "",
            pin: "",
        },
    });

    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<number | null>(null);
    const [isSuggestOpen, setIsSuggestOpen] = useState(false);
    const suggestBoxRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!suggestBoxRef.current) return;
            if (!suggestBoxRef.current.contains(e.target as Node)) {
                setIsSuggestOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsSuggestOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    const filteredBeneficiaries = useMemo(() => {
        const query = (form.watch("beneficiaryName") || "").toLowerCase();
        if (!query) return [] as Beneficiary[];
        return beneficiaries.filter(b =>
            b.name.toLowerCase().includes(query)
            || b.accountNumber.toLowerCase().includes(query)
            || (b.bankName || "").toLowerCase().includes(query)
        ).slice(0, 8);
    }, [beneficiaries, form.watch("beneficiaryName")]);

    const createTransferMutation = useMutation({
        mutationFn: async (data: InsertTransfer) => {
            const res = await apiRequest("POST", "/api/transfers/local", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/transactions", `${String(userId ?? "")}`] });
            toast({ title: "Success", description: "Local transfer initiated. Redirecting…" });
            setTimeout(() => {
                navigate("/dashboard");
            }, 1800);
        },
        onError: (e: any) => {
            toast({ title: "Transfer failed", description: e?.message || "Failed to create transfer", variant: "destructive" });
        },
    });

    const createBeneficiary = async (payload: InsertBeneficiary) => {
        const res = await apiRequest("POST", "/api/beneficiaries", payload);
        return res.json() as Promise<Beneficiary>;
    };

    const onSubmit = async (values: FormValues) => {
        if (!userId || !values.fromAccountId) {
            toast({ title: "Missing fields", description: "Select account and fill required fields", variant: "destructive" });
            return;
        }

        // Verify PIN: if set but wrong, block
        try {
            const verifyRes = await apiRequest("POST", `/api/users/${userId}/verify-pin`, { pin: values.pin });
            if (!verifyRes.ok) {
                const body = await verifyRes.json();
                toast({ title: "Invalid PIN", description: body?.message || "Please check your PIN", variant: "destructive" });
                return;
            }
        } catch (e: any) {
            toast({ title: "PIN check failed", description: e?.message || "Try again", variant: "destructive" });
            return;
        }

        let beneficiaryId = selectedBeneficiaryId;

        if (!beneficiaryId) {
            // Create a beneficiary from typed data
            try {
                const newB = await createBeneficiary({
                    userId: Number(userId),
                    name: values.beneficiaryName,
                    accountNumber: values.ibanOrAccount,
                    bankName: values.bankName,
                    routingNumber: values.routingNumber || undefined,
                    beneficiaryType: "LOCAL",
                    swiftCode: undefined,
                    address: values.bankAddress || undefined,
                    country: undefined,
                } as any);
                beneficiaryId = newB.id;
                queryClient.invalidateQueries({ queryKey: ["/api/beneficiaries", String(userId)] });
            } catch (e: any) {
                toast({ title: "Failed to save beneficiary", description: e?.message || "Validation error", variant: "destructive" });
                return;
            }
        }

        const payload: InsertTransfer = {
            userId: Number(userId),
            fromAccountId: Number(values.fromAccountId),
            beneficiaryId: Number(beneficiaryId),
            amount: values.amount,
            transferType: "LOCAL",
            description: values.remarks || undefined,
            status: "PENDING",
            fees: "0.00",
        } as InsertTransfer;

        createTransferMutation.mutate(payload);
    };

    return (

        <PageLayout>
            <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-banking-primary" onClick={() => window.history.back()}>
                    ← Back
                </Button>
                <h1 className="text-2xl font-semibold text-gray-900">Local Transfers</h1>
                <Button onClick={() => navigate("/local-transfer/new")} className="bg-banking-primary hover:bg-banking-primary-dark text-white">
                    <Plus className="w-4 h-4 mr-2" /> New Transfer
                </Button>
            </div>
            <PinGuard>
                <div className="">


                    <Card className="bg-inherit py-5">
                        <CardContent className="space-y-4 divide-y">
                            <div className="bg-primary text-white px-4 py-3">
                                <h2 className="text-lg font-semibold">Local Transfer</h2>
                            </div>

                            <div className="pt-4">
                                <h3 className="text-banking-primary font-semibold">Italian Secure Local Transfer</h3>
                                <p className="text-gray-500 text-sm">Transfer Funds to a local Bank</p>
                            </div>

                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* From */}
                                <div className="space-y-2">
                                    <Label className="text-gray-700" htmlFor="from">From</Label>
                                    <div className="flex items-center gap-3 border-b pb-2">
                                        <CreditCard className="w-5 h-5 text-gray-500" />
                                        <Select value={form.watch("fromAccountId") || ""} onValueChange={(v) => form.setValue("fromAccountId", v)}>
                                            <SelectTrigger className="border-0 shadow-none p-0 py-3 h-auto focus:ring-0">
                                                <SelectValue placeholder="Select account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {accounts.map((a) => (
                                                    <SelectItem key={a.id} value={String(a.id)}>
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

                                {/* Beneficiary Name */}
                                <div className="space-y-2">
                                    <Label className="text-gray-700" htmlFor="beneficiaryName">Beneficiary Name</Label>
                                    <div ref={suggestBoxRef} className="flex items-center gap-3 border-b pb-2 relative">
                                        <PencilLine className="w-5 h-5 text-gray-500" />
                                        <Input id="beneficiaryName" className="border-0 shadow-none focus-visible:ring-0 px-0" placeholder="" {...form.register("beneficiaryName")} onFocus={() => setIsSuggestOpen(Boolean((form.getValues("beneficiaryName") || "").trim()))} onChange={(e) => { const v = e.target.value; form.setValue("beneficiaryName", v); setSelectedBeneficiaryId(null); setIsSuggestOpen(Boolean(v.trim())); }} />
                                        {isSuggestOpen && filteredBeneficiaries.length > 0 && (
                                            <div className="absolute left-8 right-0 top-full mt-2 z-20 bg-white border rounded-md shadow-md max-h-64 overflow-auto">
                                                {filteredBeneficiaries.map(b => (
                                                    <button type="button" key={b.id} className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => {
                                                        form.setValue("beneficiaryName", b.name);
                                                        form.setValue("ibanOrAccount", b.accountNumber || "");
                                                        form.setValue("bankName", b.bankName || "");
                                                        form.setValue("routingNumber", b.routingNumber || "");
                                                        form.setValue("bankAddress", b.address || "");
                                                        setSelectedBeneficiaryId(b.id);
                                                        setIsSuggestOpen(false);
                                                    }}>
                                                        <div className="font-medium">{b.name}</div>
                                                        <div className="text-xs text-gray-500">{b.bankName} • {b.accountNumber}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Grid fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-gray-700" htmlFor="ibanOrAccount">IBAN/Account Number</Label>
                                        <div className="flex items-center gap-3 border-b pb-2">
                                            <CreditCard className="w-5 h-5 text-gray-500" />
                                            <Input id="ibanOrAccount" className="border-0 shadow-none focus-visible:ring-0 px-0" {...form.register("ibanOrAccount")} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-700" htmlFor="bankName">Bank</Label>
                                        <div className="flex items-center gap-3 border-b pb-2">
                                            <Landmark className="w-5 h-5 text-gray-500" />
                                            <Input id="bankName" className="border-0 shadow-none focus-visible:ring-0 px-0" {...form.register("bankName")} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-700" htmlFor="routingNumber">Routing Transit Number</Label>
                                        <div className="flex items-center gap-3 border-b pb-2">
                                            <RefreshCw className="w-5 h-5 text-gray-500" />
                                            <Input id="routingNumber" className="border-0 shadow-none focus-visible:ring-0 px-0" {...form.register("routingNumber")} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-700" htmlFor="bankAddress">Bank Address (Optional)</Label>
                                        <div className="flex items-center gap-3 border-b pb-2">
                                            <MapPin className="w-5 h-5 text-gray-500" />
                                            <Input id="bankAddress" className="border-0 shadow-none focus-visible:ring-0 px-0" {...form.register("bankAddress")} />
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
                                </div>

                                <div className="pt-2">
                                    <Button type="submit" className="bg-banking-primary hover:bg-banking-primary-dark w-full" disabled={createTransferMutation.isPending}> {createTransferMutation.isPending ? "Processing…" : "Proceed"} </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </PinGuard>
        </PageLayout>

    );
}


