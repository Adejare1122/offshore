import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useState } from "react";
import PageLayout from "@/components/page-layout";
import AdminGuard from "@/components/admin-guard";
import AdminNav from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminUserDetail() {
    const [match, params] = useRoute("/admin/users/:id");
    const id = params?.id ? Number(params.id) : undefined;
    const queryClient = useQueryClient();
    const [topupAmounts, setTopupAmounts] = useState<Record<number, string>>({});
    const { data: user, isLoading: userLoading, error: userError } = useQuery<any>({ queryKey: ["/api/admin/users", id], enabled: !!id, queryFn: async () => (await fetch(`/api/admin/users/${id}`)).json() });
    const { data: accounts = [], isLoading: accountsLoading, error: accountsError } = useQuery<any[]>({ queryKey: ["/api/admin/users", id, "accounts"], enabled: !!id, queryFn: async () => (await fetch(`/api/admin/users/${id}/accounts`)).json() });



    const topup = useMutation({
        mutationFn: async (vars: { accountId: number; amount: string }) => {
            const res = await fetch(`/api/admin/accounts/${vars.accountId}/topup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: vars.amount }) });
            return res.json();
        },
        onSuccess: (data, vars) => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/users", id, "accounts"] });
            // Clear the input after successful top-up
            setTopupAmounts(prev => ({ ...prev, [vars.accountId]: '' }));
        },
    });

    const handleTopup = (accountId: number) => {
        const amount = topupAmounts[accountId];
        // if (amount && parseFloat(amount) > 0) {
        topup.mutate({ accountId, amount });
        // }
    };

    return (
        <AdminGuard>
            <PageLayout showAccountCarousel={false}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <aside className="md:col-span-1"><div className="border rounded-md p-3"><AdminNav /></div></aside>
                    <section className="md:col-span-3 space-y-6">
                        <div>
                            <h1 className="text-2xl font-semibold">User Details</h1>
                            {userLoading && <p className="text-gray-500">Loading user…</p>}
                            {userError && <p className="text-red-600 text-sm">Failed to load user.</p>}
                            {user && (
                                <p className="text-gray-600 mt-1">{user.firstName} {user.lastName} • {user.email} • {user.phone || 'No phone'}</p>
                            )}
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-3">Accounts</h2>
                            {accountsLoading && <p className="text-gray-500">Loading accounts…</p>}
                            {accountsError && <p className="text-red-600 text-sm">Failed to load accounts.</p>}
                            <div className="space-y-4">
                                {accounts.map(a => (
                                    <div key={a.id} className="border rounded-md p-4 grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                                        <div>
                                            <div className="text-sm text-gray-500">Type</div>
                                            <div className="font-medium">{a.accountType}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Account No</div>
                                            <div className="font-medium">{a.accountNumber}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Balance</div>
                                            <div className="font-medium">{a.balance}</div>
                                        </div>
                                        <div className="col-span-2 flex items-center gap-2 justify-end">
                                            <Input
                                                type="number"
                                                placeholder="Top up amount"
                                                value={topupAmounts[a.id] || ''}
                                                onChange={(e) => setTopupAmounts(prev => ({ ...prev, [a.id]: e.target.value }))}
                                            />
                                            <Button
                                                variant="outline"
                                                onClick={() => handleTopup(a.id)}
                                                disabled={!topupAmounts[a.id] || topup.isPending}
                                            >
                                                {topup.isPending ? 'Processing...' : 'Top up'}
                                            </Button>
                                        </div>
                                        <div className="flex md:justify-end">
                                            <Button asChild>
                                                <a href={`/admin/statements?accountId=${a.id}`}>View Statements</a>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </PageLayout>
        </AdminGuard>
    );
}


