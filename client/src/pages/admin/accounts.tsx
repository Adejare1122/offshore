import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageLayout from "@/components/page-layout";
import AdminGuard from "@/components/admin-guard";
import AdminNav from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminAccounts() {
    const queryClient = useQueryClient();
    const { data: accounts = [] } = useQuery<any[]>({ queryKey: ["/api/admin/accounts"] });
    const update = useMutation({
        mutationFn: async (acc: any) => {
            const res = await fetch(`/api/admin/accounts/${acc.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(acc) });
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/accounts"] }),
    });
    const del = useMutation({
        mutationFn: async (id: number) => {
            await fetch(`/api/admin/accounts/${id}`, { method: 'DELETE' });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/accounts"] }),
    });

    return (
        <AdminGuard>
            <PageLayout showAccountCarousel={false}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <aside className="md:col-span-1"><div className="border rounded-md p-3"><AdminNav /></div></aside>
                    <section className="md:col-span-3">
                        <h1 className="text-2xl font-semibold mb-4">Manage Accounts</h1>
                        <div className="space-y-4">
                            {accounts.map(a => (
                                <div key={a.id} className="border rounded-md p-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                                    <Input defaultValue={a.accountType} onBlur={(e) => update.mutate({ ...a, accountType: e.target.value })} />
                                    <Input defaultValue={a.accountNumber} onBlur={(e) => update.mutate({ ...a, accountNumber: e.target.value })} />
                                    <Input defaultValue={a.balance} onBlur={(e) => update.mutate({ ...a, balance: e.target.value })} />
                                    <div></div>
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" onClick={() => update.mutate(a)}>Save</Button>
                                        <Button variant="destructive" onClick={() => del.mutate(a.id)}>Delete</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </PageLayout>
        </AdminGuard>
    );
}


