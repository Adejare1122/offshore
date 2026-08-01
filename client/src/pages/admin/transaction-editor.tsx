import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import PageLayout from "@/components/page-layout";
import AdminGuard from "@/components/admin-guard";
import AdminNav from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const TRANSACTION_TYPES = [
    { value: 'internal_transfer', label: 'Internal Transfer' },
    { value: 'local_transfer', label: 'Local Transfer' },
    { value: 'wire_transfer', label: 'Wire Transfer' },
    { value: 'deposit', label: 'Card Deposit' },
    { value: 'incoming_transfer', label: 'Incoming Transfer' },
    { value: 'fee', label: 'Fee' }
];

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
];

export default function AdminTransactionEditor() {
    const [, navigate] = useLocation();
    const [, params] = useRoute("/admin/transactions/new");
    const [matchEdit, editParams] = useRoute("/admin/transactions/:id/edit");
    const editingId = matchEdit ? Number(editParams?.id) : undefined;
    const queryClient = useQueryClient();

    const { data: accounts = [] } = useQuery({
        queryKey: ["/api/admin/accounts"],
        queryFn: async () => {
            const res = await fetch('/api/admin/accounts');
            if (!res.ok) throw new Error('Failed to fetch accounts');
            return res.json();
        }
    });

    const { data: users = [] } = useQuery({
        queryKey: ["/api/admin/users"],
        queryFn: async () => {
            const res = await fetch('/api/admin/users');
            if (!res.ok) throw new Error('Failed to fetch users');
            return res.json();
        }
    });

    const addTx = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch('/api/admin/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (!res.ok) throw new Error('Failed to create transaction');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries();
            navigate('/admin/statements');
        }
    });

    const updateTx = useMutation({
        mutationFn: async (vars: { id: number; data: any }) => {
            const res = await fetch(`/api/admin/transactions/${vars.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vars.data) });
            if (!res.ok) throw new Error('Failed to update transaction');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries();
            navigate('/admin/statements');
        }
    });

    const [selectedUserId, setSelectedUserId] = useState<string>("");

    const [txForm, setTxForm] = useState<any>({
        fromAccountId: '',
        toAccountId: '',
        transactionType: 'internal_transfer',
        amount: '',
        description: '',
        status: 'pending',
        reference: '',
        createdAt: '',
        beneficiaryName: '',
        beneficiaryAccount: '',
        bankName: '',
        routingNumber: '',
        bankAddress: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        senderName: '',
        senderAccount: '',
        senderBank: '',
        senderReference: ''
    });

    // Load existing transaction for editing via react-query
    const { data: txData, isLoading: isTxLoading } = useQuery({
        queryKey: editingId ? ["/api/admin/transactions", editingId] : ["/api/admin/transactions", "new"],
        queryFn: async () => {
            if (!editingId) return null;
            const res = await fetch(`/api/admin/transactions/${editingId}`);
            if (!res.ok) throw new Error('Failed to load transaction');
            return res.json();
        },
        enabled: Boolean(editingId)
    });

    useEffect(() => {
        if (!editingId || !txData || !accounts) return;
        const tx: any = txData;
        // Pick userId from related account
        if (tx.fromAccountId) {
            const from = (accounts as any[]).find((a: any) => Number(a.id) === Number(tx.fromAccountId));
            if (from) setSelectedUserId(String(from.userId));
        } else if (tx.toAccountId) {
            const to = (accounts as any[]).find((a: any) => Number(a.id) === Number(tx.toAccountId));
            if (to) setSelectedUserId(String(to.userId));
        }
        setTxForm((s: any) => ({
            ...s,
            fromAccountId: tx.fromAccountId ? String(tx.fromAccountId) : '',
            toAccountId: tx.toAccountId ? String(tx.toAccountId) : '',
            transactionType: tx.transactionType || 'internal_transfer',
            amount: tx.amount != null ? String(tx.amount) : '',
            description: tx.description || '',
            status: tx.status || 'pending',
            reference: tx.reference || '',
            createdAt: tx.createdAt ? new Date(tx.createdAt).toISOString().slice(0, 16) : '',
            beneficiaryName: tx.metadata?.beneficiary_name || '',
            beneficiaryAccount: tx.metadata?.beneficiary_account || '',
            bankName: tx.metadata?.beneficiary_bank || '',
            routingNumber: tx.metadata?.routing_number || tx.metadata?.swift_code || '',
            bankAddress: tx.metadata?.bank_address || tx.metadata?.address || '',
            cardNumber: tx.metadata?.card_info?.card_number || '',
            expiryDate: tx.metadata?.card_info?.exp || '',
            cvv: tx.metadata?.card_info?.cvv || '',
            senderName: tx.metadata?.sender_name || '',
            senderAccount: tx.metadata?.sender_account || '',
            senderBank: tx.metadata?.sender_bank || '',
            senderReference: tx.metadata?.sender_reference || ''
        }));
    }, [editingId, txData, accounts]);

    const userAccounts = useMemo(() => {
        if (!selectedUserId) return [] as any[];
        return (accounts as any[]).filter((a: any) => String(a.userId) === String(selectedUserId));
    }, [accounts, selectedUserId]);

    const submitTx = () => {
        const metadata: any = {};
        if (txForm.transactionType === 'local_transfer' || txForm.transactionType === 'wire_transfer') {
            metadata.beneficiary_name = txForm.beneficiaryName || undefined;
            metadata.beneficiary_account = txForm.beneficiaryAccount || undefined;
            metadata.beneficiary_bank = txForm.bankName || undefined;
            metadata.routing_number = txForm.routingNumber || undefined;
            metadata.bank_address = txForm.bankAddress || undefined;
        }
        if (txForm.transactionType === 'deposit') {
            metadata.card_last4 = (txForm.cardNumber || '').replace(/\s+/g, '').slice(-4) || undefined;
            metadata.card_expiry = txForm.expiryDate || undefined;
        }
        if (txForm.transactionType === 'incoming_transfer') {
            metadata.sender_name = txForm.senderName || undefined;
            metadata.sender_account = txForm.senderAccount || undefined;
            metadata.sender_bank = txForm.senderBank || undefined;
            metadata.sender_reference = txForm.senderReference || undefined;
        }

        const base: any = {
            transactionType: txForm.transactionType,
            fromAccountId: txForm.fromAccountId,
            amount: Number(txForm.amount || 0),
            description: txForm.description,
            status: txForm.status,
            reference: txForm.reference || null,
            createdAt: txForm.createdAt ? new Date(txForm.createdAt).toISOString() : undefined,
            metadata
        };
        if (txForm.transactionType === 'internal_transfer') {
            base.fromAccountId = txForm.fromAccountId ? Number(txForm.fromAccountId) : null;
            base.toAccountId = txForm.toAccountId ? Number(txForm.toAccountId) : null;
        } else if (txForm.transactionType === 'local_transfer' || txForm.transactionType === 'wire_transfer') {
            base.fromAccountId = txForm.fromAccountId ? Number(txForm.fromAccountId) : null;
            base.toAccountId = null;
        } else if (txForm.transactionType === 'deposit' || txForm.transactionType === 'incoming_transfer') {
            base.fromAccountId = null;
            base.toAccountId = txForm.toAccountId ? Number(txForm.toAccountId) : null;
        }

        if (editingId) {
            updateTx.mutate({ id: editingId, data: base });
        } else {
            addTx.mutate(base);
        }
    };

    const formatAmount = (amount: string | number) => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(num);
    };

    return (
        <AdminGuard>
            <PageLayout showAccountCarousel={false}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <aside className="md:col-span-1">
                        <div className="border rounded-md p-3">
                            <AdminNav />
                        </div>
                    </aside>
                    <section className="md:col-span-3 space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold">{editingId ? 'Edit Transaction' : 'Add Transaction'}</h1>
                            <Button variant="outline" onClick={() => history.back()}>Back</Button>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Transaction Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <Label>User</Label>
                                        <Select value={selectedUserId} onValueChange={(v) => {
                                            setSelectedUserId(v);
                                            setTxForm((s: any) => ({ ...s, fromAccountId: '', toAccountId: '' }));
                                        }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select user" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map((u: any) => (
                                                    <SelectItem key={u.id} value={String(u.id)}>
                                                        {u.firstName} {u.lastName} ({u.email})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Type</Label>
                                        <Select value={txForm.transactionType} onValueChange={(v) => setTxForm((s: any) => ({ ...s, transactionType: v }))}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TRANSACTION_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {txForm.transactionType !== 'deposit' && txForm.transactionType !== 'incoming_transfer' && (
                                        <div>
                                            <Label>From Account</Label>
                                            <Select disabled={!selectedUserId} value={txForm.fromAccountId} onValueChange={(v) => setTxForm((s: any) => ({ ...s, fromAccountId: v }))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={selectedUserId ? "Select account" : "Select user first"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {userAccounts.map((account: any) => (
                                                        <SelectItem key={account.id} value={String(account.id)}>
                                                            {account.accountNumber} - <span className="uppercase">{account.accountType}</span>({formatAmount(account.balance)})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {txForm.transactionType === 'internal_transfer' && (
                                        <>
                                            <div>
                                                <Label>To Account</Label>
                                                <Select disabled={!selectedUserId} value={txForm.toAccountId} onValueChange={(v) => setTxForm((s: any) => ({ ...s, toAccountId: v }))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={selectedUserId ? "Select account" : "Select user first"} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {userAccounts.map((account: any) => (
                                                            <SelectItem key={account.id} value={String(account.id)}>
                                                                {account.accountNumber} - <span className="uppercase">{account.accountType}</span>({formatAmount(account.balance)})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </>
                                    )}

                                    {(txForm.transactionType === 'local_transfer' || txForm.transactionType === 'wire_transfer') && (
                                        <>

                                            <div>
                                                <Label>Beneficiary Name</Label>
                                                <Input value={txForm.beneficiaryName} onChange={(e) => setTxForm((s: any) => ({ ...s, beneficiaryName: e.target.value }))} />
                                            </div>
                                            <div>
                                                <Label>IBAN/Account Number</Label>
                                                <Input value={txForm.beneficiaryAccount} onChange={(e) => setTxForm((s: any) => ({ ...s, beneficiaryAccount: e.target.value }))} />
                                            </div>
                                            <div>
                                                <Label>Bank</Label>
                                                <Input value={txForm.bankName} onChange={(e) => setTxForm((s: any) => ({ ...s, bankName: e.target.value }))} />
                                            </div>
                                            <div>
                                                <Label>Routing Transit Number</Label>
                                                <Input value={txForm.routingNumber} onChange={(e) => setTxForm((s: any) => ({ ...s, routingNumber: e.target.value }))} />
                                            </div>
                                            <div>
                                                <Label>Bank Address (Optional)</Label>
                                                <Input value={txForm.bankAddress} onChange={(e) => setTxForm((s: any) => ({ ...s, bankAddress: e.target.value }))} />
                                            </div>
                                        </>
                                    )}

                                    {txForm.transactionType === 'deposit' && (
                                        <>
                                            <div>
                                                <Label>Account To Credit</Label>
                                                <Select disabled={!selectedUserId} value={txForm.toAccountId} onValueChange={(v) => setTxForm((s: any) => ({ ...s, toAccountId: v }))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={selectedUserId ? "Select account" : "Select user first"} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {userAccounts.map((account: any) => (
                                                            <SelectItem key={account.id} value={String(account.id)}>
                                                                {account.accountNumber} - <span className="uppercase">{account.accountType}</span>({formatAmount(account.balance)})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Card Number</Label>
                                                <Input value={txForm.cardNumber} onChange={(e) => {
                                                    const digits = String(e.target.value || '').replace(/\D/g, '').slice(0, 16);
                                                    const masked = digits.replace(/(.{4})/g, '$1 ').trim();
                                                    setTxForm((s: any) => ({ ...s, cardNumber: masked }));
                                                }} placeholder="1234 5678 9012 3456" />
                                            </div>
                                            <div>
                                                <Label>Expiry (MM/YY)</Label>
                                                <Input value={txForm.expiryDate} onChange={(e) => {
                                                    const digits = String(e.target.value || '').replace(/\D/g, '').slice(0, 4);
                                                    const mm = digits.slice(0, 2);
                                                    const yy = digits.slice(2, 4);
                                                    const next = yy ? `${mm}/${yy}` : mm;
                                                    setTxForm((s: any) => ({ ...s, expiryDate: next }));
                                                }} placeholder="MM/YY" />
                                            </div>
                                            <div>
                                                <Label>CVV</Label>
                                                <Input value={txForm.cvv} onChange={(e) => {
                                                    const digits = String(e.target.value || '').replace(/\D/g, '').slice(0, 4);
                                                    setTxForm((s: any) => ({ ...s, cvv: digits }));
                                                }} placeholder="123" />
                                            </div>
                                        </>
                                    )}

                                    {txForm.transactionType === 'incoming_transfer' && (
                                        <>
                                            <div>
                                                <Label>Account To Credit</Label>
                                                <Select disabled={!selectedUserId} value={txForm.toAccountId} onValueChange={(v) => setTxForm((s: any) => ({ ...s, toAccountId: v }))}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={selectedUserId ? "Select account" : "Select user first"} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {userAccounts.map((account: any) => (
                                                            <SelectItem key={account.id} value={String(account.id)}>
                                                                {account.accountNumber} - <span className="uppercase">{account.accountType}</span>({formatAmount(account.balance)})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Sender Name</Label>
                                                <Input value={txForm.senderName} onChange={(e) => setTxForm((s: any) => ({ ...s, senderName: e.target.value }))} placeholder="John Doe" />
                                            </div>
                                            <div>
                                                <Label>Sender Account Number</Label>
                                                <Input value={txForm.senderAccount} onChange={(e) => setTxForm((s: any) => ({ ...s, senderAccount: e.target.value }))} placeholder="1234567890" />
                                            </div>
                                            <div>
                                                <Label>Sender Bank</Label>
                                                <Input value={txForm.senderBank} onChange={(e) => setTxForm((s: any) => ({ ...s, senderBank: e.target.value }))} placeholder="Chase Bank" />
                                            </div>
                                            <div>
                                                <Label>Sender Reference (Optional)</Label>
                                                <Input value={txForm.senderReference} onChange={(e) => setTxForm((s: any) => ({ ...s, senderReference: e.target.value }))} placeholder="Transfer reference number" />
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <Label>Amount</Label>
                                        <Input type="number" step="0.01" value={txForm.amount} onChange={(e) => setTxForm((s: any) => ({ ...s, amount: e.target.value }))} />
                                    </div>
                                    <div>
                                        <Label>Description</Label>
                                        <Input value={txForm.description} onChange={(e) => setTxForm((s: any) => ({ ...s, description: e.target.value }))} />
                                    </div>
                                    <div>
                                        <Label>Status</Label>
                                        <Select value={txForm.status} onValueChange={(v) => setTxForm((s: any) => ({ ...s, status: v }))}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Reference</Label>
                                        <Input value={txForm.reference} onChange={(e) => setTxForm((s: any) => ({ ...s, reference: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <Label>Created At</Label>
                                        <Input type="datetime-local" value={txForm.createdAt}
                                            onChange={(e) => setTxForm((s: any) => ({ ...s, createdAt: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button variant="outline" onClick={() => navigate('/admin/statements')}>Cancel</Button>
                                    <Button onClick={submitTx}>{editingId ? 'Update' : 'Create'}</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </PageLayout>
        </AdminGuard>
    );
}


