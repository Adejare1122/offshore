import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import PageLayout from "@/components/page-layout";
import AdminGuard from "@/components/admin-guard";
import AdminNav from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Filter, Search, RefreshCw, FileText, Plus, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

const TRANSACTION_TYPES = [
    { value: 'internal_transfer', label: 'Internal Transfer' },
    { value: 'local_transfer', label: 'Local Transfer' },
    { value: 'wire_transfer', label: 'Wire Transfer' },
    { value: 'bill_payment', label: 'Bill Payment' },
    { value: 'airtime_topup', label: 'Airtime Top-up' },
    { value: 'data_topup', label: 'Data Top-up' },
    { value: 'crypto_buy', label: 'Crypto Buy' },
    { value: 'crypto_sell', label: 'Crypto Sell' },
    { value: 'crypto_transfer', label: 'Crypto Transfer' },
    { value: 'deposit', label: 'Deposit' },
    { value: 'fee', label: 'Fee' }
];

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
];

export default function AdminStatements() {
    const queryClient = useQueryClient();
    const [, navigate] = useLocation();

    const [filters, setFilters] = useState({
        type: '',
        status: '',
        accountId: '',
        userId: '',
        startDate: undefined as Date | undefined,
        endDate: undefined as Date | undefined,
        search: ''
    });

    const [pagination, setPagination] = useState({
        limit: 50,
        offset: 0
    });

    // Build query parameters
    const queryParams = useMemo(() => {
        const params = new URLSearchParams();
        params.set('limit', pagination.limit.toString());
        params.set('offset', pagination.offset.toString());

        if (filters.type) params.set('type', filters.type);
        if (filters.status) params.set('status', filters.status);
        if (filters.accountId) params.set('accountId', filters.accountId);
        if (filters.userId) params.set('userId', filters.userId);
        if (filters.startDate) params.set('startDate', filters.startDate.toISOString().split('T')[0]);
        if (filters.endDate) params.set('endDate', filters.endDate.toISOString().split('T')[0]);
        if (filters.search) params.set('search', filters.search);

        return params.toString();
    }, [filters, pagination]);

    const { data: statementsData, isLoading, refetch } = useQuery({
        queryKey: [`/api/admin/statements?${queryParams}`],
        queryFn: async () => {
            const response = await fetch(`/api/admin/statements?${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch statements');
            return response.json();
        }
    });

    const { data: accounts = [] } = useQuery({
        queryKey: ["/api/admin/accounts"],
        queryFn: async () => {
            const response = await fetch('/api/admin/accounts');
            if (!response.ok) throw new Error('Failed to fetch accounts');
            return response.json();
        }
    });

    const { data: users = [] } = useQuery({
        queryKey: ["/api/admin/users"],
        queryFn: async () => {
            const response = await fetch('/api/admin/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            return response.json();
        }
    });

    const transactions = statementsData?.transactions || [];
    const total = statementsData?.total || 0;
    const totalPages = Math.ceil(total / pagination.limit);
    const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

    const handleFilterChange = (key: string, value: any) => {
        const normalized = value === 'ALL' ? '' : value;
        setFilters(prev => ({ ...prev, [key]: normalized }));
        setPagination(prev => ({ ...prev, offset: 0 })); // Reset to first page
    };

    const handlePageChange = (newOffset: number) => {
        setPagination(prev => ({ ...prev, offset: newOffset }));
    };

    const clearFilters = () => {
        setFilters({
            type: '',
            status: '',
            accountId: '',
            userId: '',
            startDate: undefined,
            endDate: undefined,
            search: ''
        });
        setPagination(prev => ({ ...prev, offset: 0 }));
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { className: "bg-yellow-100 text-yellow-800", label: "Pending" },
            processing: { className: "bg-blue-100 text-blue-800", label: "Processing" },
            completed: { className: "bg-green-100 text-green-800", label: "Completed" },
            failed: { className: "bg-red-100 text-red-800", label: "Failed" },
            cancelled: { className: "bg-gray-100 text-gray-800", label: "Cancelled" }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    const getTransactionIcon = (type: string) => {
        const icons = {
            internal_transfer: '🔄',
            local_transfer: '🏦',
            wire_transfer: '🌍',
            bill_payment: '🧾',
            airtime_topup: '📱',
            data_topup: '📶',
            crypto_buy: '₿',
            crypto_sell: '₿',
            deposit: '📥',
            fee: '💸'
        };
        return icons[type as keyof typeof icons] || '💰';
    };

    const getTypeBadge = (type: string) => {
        const typeConfig = {
            internal_transfer: { className: "bg-blue-100 text-blue-800", label: "Internal" },
            local_transfer: { className: "bg-green-100 text-green-800", label: "Local" },
            wire_transfer: { className: "bg-purple-100 text-purple-800", label: "Wire" },
            bill_payment: { className: "bg-orange-100 text-orange-800", label: "Bill" },
            airtime_topup: { className: "bg-cyan-100 text-cyan-800", label: "Airtime" },
            data_topup: { className: "bg-indigo-100 text-indigo-800", label: "Data" },
            crypto_buy: { className: "bg-yellow-100 text-yellow-800", label: "Crypto Buy" },
            crypto_sell: { className: "bg-yellow-100 text-yellow-800", label: "Crypto Sell" },
            crypto_transfer: { className: "bg-yellow-100 text-yellow-800", label: "Crypto Transfer" },
            deposit: { className: "bg-emerald-100 text-emerald-800", label: "Deposit" },
            fee: { className: "bg-gray-100 text-gray-800", label: "Fee" }
        };

        const config = typeConfig[type as keyof typeof typeConfig] || { className: "bg-gray-100 text-gray-800", label: type };
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    const formatAmount = (amount: string | number) => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(num);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const [editingTx, setEditingTx] = useState<any | null>(null);

    const addTx = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch('/api/admin/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (!res.ok) throw new Error('Failed to create transaction');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/admin/statements?${queryParams}`] });
        }
    });

    const updateTx = useMutation({
        mutationFn: async (vars: { id: number; data: any }) => {
            const res = await fetch(`/api/admin/transactions/${vars.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vars.data) });
            if (!res.ok) throw new Error('Failed to update transaction');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/admin/statements?${queryParams}`] });
            setEditingTx(null);
        }
    });

    const delTx = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/admin/transactions/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete transaction');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/admin/statements?${queryParams}`] });
        }
    });

    const [txForm, setTxForm] = useState<any>({
        fromAccountId: '',
        toAccountId: '',
        transactionType: 'internal_transfer',
        amount: '',
        description: '',
        status: 'pending',
        reference: '',
        // local/wire fields
        beneficiaryName: '',
        beneficiaryAccount: '',
        bankName: '',
        routingNumber: '',
        bankAddress: '',
        // card deposit fields
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const openAddDialog = () => {
        navigate('/admin/transactions/new');
    };

    const openEditDialog = (tx: any) => {
        navigate(`/admin/transactions/${tx.id}/edit`);
    };

    const submitTx = () => {
        // Build metadata depending on type
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

        const base = {
            transactionType: txForm.transactionType,
            amount: Number(txForm.amount || 0),
            description: txForm.description,
            status: txForm.status,
            reference: txForm.reference || null,
            metadata
        } as any;

        // Map account sides by type
        if (txForm.transactionType === 'internal_transfer') {
            base.fromAccountId = txForm.fromAccountId ? Number(txForm.fromAccountId) : null;
            base.toAccountId = txForm.toAccountId ? Number(txForm.toAccountId) : null;
        } else if (txForm.transactionType === 'local_transfer' || txForm.transactionType === 'wire_transfer') {
            base.fromAccountId = txForm.fromAccountId ? Number(txForm.fromAccountId) : null;
            base.toAccountId = null;
        } else if (txForm.transactionType === 'deposit') {
            base.fromAccountId = null;
            base.toAccountId = txForm.toAccountId ? Number(txForm.toAccountId) : null;
        }

        const payload = base;
        if (editingTx) {
            updateTx.mutate({ id: editingTx.id, data: payload });
        } else {
            addTx.mutate(payload);
        }
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

                    <section className="md:col-span-3">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-semibold">Account Statements</h1>
                                <p className="text-gray-600">View and filter all transaction records</p>
                            </div>
                            <div className="flex space-x-2">
                                <Button onClick={openAddDialog}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Transaction
                                </Button>
                                <Button variant="outline" onClick={() => refetch()}>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Refresh
                                </Button>
                                <Button variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>

                        {/* Filters */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Filter className="w-5 h-5 mr-2" />
                                    Filters
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="search">Search</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="search"
                                                placeholder="Search transactions..."
                                                value={filters.search}
                                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="type">Transaction Type</Label>
                                        <Select value={filters.type || 'ALL'} onValueChange={(value) => handleFilterChange('type', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All types" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All types</SelectItem>
                                                {TRANSACTION_TYPES.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={filters.status || 'ALL'} onValueChange={(value) => handleFilterChange('status', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All statuses</SelectItem>
                                                {STATUS_OPTIONS.map((status) => (
                                                    <SelectItem key={status.value} value={status.value}>
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="account">Account</Label>
                                        <Select value={filters.accountId || 'ALL'} onValueChange={(value) => handleFilterChange('accountId', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All accounts" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All accounts</SelectItem>
                                                {accounts.map((account: any) => (
                                                    <SelectItem key={account.id} value={account.id.toString()}>
                                                        {account.accountNumber} - {account.accountType}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="user">User</Label>
                                        <Select value={filters.userId || 'ALL'} onValueChange={(value) => handleFilterChange('userId', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All users" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All users</SelectItem>
                                                {users.map((user: any) => (
                                                    <SelectItem key={user.id} value={user.id.toString()}>
                                                        {user.firstName} {user.lastName} ({user.email})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex space-x-2">
                                        <div className="flex-1">
                                            <Label>Start Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !filters.startDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {filters.startDate ? format(filters.startDate, "PPP") : "Pick date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={filters.startDate}
                                                        onSelect={(date) => handleFilterChange('startDate', date)}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="flex-1">
                                            <Label>End Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !filters.endDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {filters.endDate ? format(filters.endDate, "PPP") : "Pick date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={filters.endDate}
                                                        onSelect={(date) => handleFilterChange('endDate', date)}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <Button variant="outline" onClick={clearFilters}>
                                        Clear Filters
                                    </Button>
                                    <div className="text-sm text-gray-600">
                                        Showing {transactions.length} of {total} transactions
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Statements Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Transaction Statements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                                        Loading statements...
                                    </div>
                                ) : transactions.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No transactions found matching your filters.
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Icon</TableHead>
                                                        <TableHead>Account</TableHead>
                                                        <TableHead>Description</TableHead>
                                                        <TableHead>Amount</TableHead>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {transactions.map((transaction: any) => (
                                                        <TableRow key={transaction.id}>
                                                            <TableCell className="font-mono text-sm">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-700 text-lg">
                                                                        {getTransactionIcon(transaction.transactionType)}
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="inline-flex gap-2 text-sm font-medium text-gray-900 capitalize">
                                                                            {transaction.transactionType.replace(/_/g, ' ')}

                                                                            {getStatusBadge(transaction.status)}
                                                                        </div>
                                                                        <div className="text-sm text-gray-500">
                                                                            {transaction.reference}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>

                                                            <TableCell>
                                                                <div>
                                                                    <div className="font-medium">
                                                                        {transaction.fromAccountNumber}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {transaction.fromAccountType}
                                                                    </div>
                                                                </div>
                                                            </TableCell>

                                                            <TableCell className="max-w-xs">
                                                                <div className="truncate" title={transaction.description}>
                                                                    {transaction.description}
                                                                </div>

                                                            </TableCell>
                                                            <TableCell className="font-mono">
                                                                {formatAmount(transaction.amount)}
                                                            </TableCell>

                                                            <TableCell>
                                                                <div>
                                                                    <div>{formatDate(transaction.createdAt)}</div>
                                                                    {transaction.completedAt && (
                                                                        <div className="text-xs text-gray-500">
                                                                            Completed: {formatDate(transaction.completedAt)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </TableCell>

                                                            <TableCell className="text-right">
                                                                <div className="inline-flex gap-2">
                                                                    <Button size="icon" variant="outline" onClick={() => openEditDialog(transaction)}>
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button size="icon" variant="destructive" onClick={() => {
                                                                        if (confirm(`Delete transaction #${transaction.id}? This will revert its balance impact.`)) {
                                                                            delTx.mutate(Number(transaction.id));
                                                                        }
                                                                    }} disabled={(delTx as any).isPending}>
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="text-sm text-gray-600">
                                                    Page {currentPage} of {totalPages}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(0)}
                                                        disabled={pagination.offset === 0}
                                                    >
                                                        First
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                                                        disabled={pagination.offset === 0}
                                                    >
                                                        Previous
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                                                        disabled={pagination.offset + pagination.limit >= total}
                                                    >
                                                        Next
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange((totalPages - 1) * pagination.limit)}
                                                        disabled={pagination.offset + pagination.limit >= total}
                                                    >
                                                        Last
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </section>
                </div>

                {/* Editor modal removed in favor of separate page */}
            </PageLayout>
        </AdminGuard>
    );
}
