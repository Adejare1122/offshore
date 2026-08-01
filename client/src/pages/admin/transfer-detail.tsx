import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import PageLayout from "@/components/page-layout";
import AdminGuard from "@/components/admin-guard";
import AdminNav from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AdminTransferDetail() {
    const [match, params] = useRoute("/admin/transfers/:id");
    const id = params?.id ? Number(params.id) : undefined;
    const queryClient = useQueryClient();
    const { data: transfer, isLoading, error } = useQuery<any>({ queryKey: ["/api/admin/transfers", id], enabled: !!id, queryFn: async () => (await fetch(`/api/admin/transfers/${id}`)).json() });

    const updateStatus = useMutation({
        mutationFn: async ({ status }: { status: string }) => {
            const res = await fetch(`/api/transfers/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/transfers", id] }),
    });

    return (
        <AdminGuard>
            <PageLayout showAccountCarousel={false}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <aside className="md:col-span-1"><div className="border rounded-md p-3"><AdminNav /></div></aside>
                    <section className="md:col-span-3 space-y-6">
                        <h1 className="text-2xl font-semibold">Transfer Details</h1>
                        {isLoading && <p className="text-gray-500">Loading…</p>}
                        {error && <p className="text-red-600">Failed to load transfer.</p>}
                        {transfer && (
                            <div className="space-y-4 border rounded-md p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-gray-500">ID</Label>
                                        <div className="font-medium">{transfer.id}</div>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">Type</Label>
                                        <div className="font-medium">{transfer.transferType}</div>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">User</Label>
                                        <div className="font-medium">{transfer.user ? `${transfer.user.firstName} ${transfer.user.lastName} (${transfer.user.email})` : transfer.userId}</div>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">From Account</Label>
                                        <div className="font-medium">{transfer.fromAccount ? `${transfer.fromAccount.accountType} • ${transfer.fromAccount.accountNumber}` : transfer.fromAccountId}</div>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">Beneficiary</Label>
                                        <div className="font-medium">{transfer.beneficiary ? `${transfer.beneficiary.name} • ${transfer.beneficiary.bankName} • ${transfer.beneficiary.accountNumber}` : (transfer.beneficiaryId || '—')}</div>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">Amount</Label>
                                        <div className="font-medium">{transfer.amount}</div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label className="text-gray-500">Description</Label>
                                        <div className="font-medium">{transfer.description || '—'}</div>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">Status</Label>
                                        <div className="font-medium">{transfer.status}</div>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">Created</Label>
                                        <div className="font-medium">{new Date(transfer.createdAt).toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-2">
                                    <Button variant="outline" onClick={() => updateStatus.mutate({ status: 'PENDING' })}>Mark Pending</Button>
                                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus.mutate({ status: 'COMPLETED' })}>Mark Completed</Button>
                                    <Button variant="destructive" onClick={() => updateStatus.mutate({ status: 'FAILED' })}>Mark Failed</Button>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </PageLayout>
        </AdminGuard>
    );
}


