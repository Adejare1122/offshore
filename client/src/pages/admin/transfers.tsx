import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ArrowRightLeft, Eye } from "lucide-react";
import PageLayout from "@/components/page-layout";
import AdminGuard from "@/components/admin-guard";
import AdminNav from "@/components/admin-nav";
import { apiRequest } from "@/lib/queryClient";

export default function AdminTransfers() {
    const { data: transfers = [] } = useQuery<any[]>({ queryKey: ["/api/admin/transfers"] });
    const { data: users = [] } = useQuery<any[]>({ queryKey: ["/api/admin/users"] });
    const { data: accounts = [] } = useQuery<any[]>({ queryKey: ["/api/admin/accounts"] });
    const { data: beneficiaries = [] } = useQuery<any[]>({ queryKey: ["/api/beneficiaries"] });
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingTransfer, setEditingTransfer] = useState<any>(null);
    const [formData, setFormData] = useState({
        userId: '',
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        description: '',
        type: 'LOCAL',
        beneficiaryId: ''
    });

    const createTransferMutation = useMutation({
        mutationFn: (data: any) => apiRequest('POST', '/api/admin/transfers', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/transfers"] });
            queryClient.invalidateQueries({ queryKey: ["/api/admin/accounts"] });
            toast({ title: "Transfer created successfully" });
            setIsCreateDialogOpen(false);
            resetForm();
        },
        onError: (error: any) => {
            toast({ title: "Failed to create transfer", description: error.message, variant: "destructive" });
        }
    });

    const updateTransferMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: any }) => apiRequest('PATCH', `/api/admin/transfers/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/transfers"] });
            toast({ title: "Transfer updated successfully" });
            setEditingTransfer(null);
            resetForm();
        },
        onError: (error: any) => {
            toast({ title: "Failed to update transfer", description: error.message, variant: "destructive" });
        }
    });

    const deleteTransferMutation = useMutation({
        mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/transfers/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/transfers"] });
            queryClient.invalidateQueries({ queryKey: ["/api/admin/accounts"] });
            toast({ title: "Transfer deleted successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Failed to delete transfer", description: error.message, variant: "destructive" });
        }
    });

    const resetForm = () => {
        setFormData({
            userId: '',
            fromAccountId: '',
            toAccountId: '',
            amount: '',
            description: '',
            type: 'LOCAL',
            beneficiaryId: ''
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTransfer) {
            updateTransferMutation.mutate({
                id: editingTransfer.id,
                data: {
                    amount: formData.amount,
                    description: formData.description,
                    status: 'COMPLETED'
                }
            });
        } else {
            createTransferMutation.mutate(formData);
        }
    };

    const handleEdit = (transfer: any) => {
        setEditingTransfer(transfer);
        setFormData({
            userId: transfer.userId.toString(),
            fromAccountId: transfer.fromAccountId?.toString() || '',
            toAccountId: transfer.toAccountId?.toString() || '',
            amount: transfer.amount.toString(),
            description: transfer.description,
            type: transfer.type,
            beneficiaryId: transfer.beneficiaryId?.toString() || ''
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this transfer?')) {
            deleteTransferMutation.mutate(id);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'FAILED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
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
                            <h1 className="text-2xl font-semibold">Manage Transfers</h1>
                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={resetForm}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Transfer
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Create Manual Transfer</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="userId">User</Label>
                                                <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select user" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {users.map((user) => (
                                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                                {user.firstName} {user.lastName} ({user.username})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="type">Transfer Type</Label>
                                                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="LOCAL">Local Transfer</SelectItem>
                                                        <SelectItem value="WIRE">Wire Transfer</SelectItem>
                                                        <SelectItem value="INTERNAL">Internal Transfer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="fromAccountId">From Account</Label>
                                                <Select value={formData.fromAccountId} onValueChange={(value) => setFormData({ ...formData, fromAccountId: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select from account" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {accounts.map((account) => (
                                                            <SelectItem key={account.id} value={account.id.toString()}>
                                                                {account.accountNumber} - {account.type} (${account.balance})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="toAccountId">To Account (Optional)</Label>
                                                <Select value={formData.toAccountId} onValueChange={(value) => setFormData({ ...formData, toAccountId: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select to account" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">None</SelectItem>
                                                        {accounts.map((account) => (
                                                            <SelectItem key={account.id} value={account.id.toString()}>
                                                                {account.accountNumber} - {account.type} (${account.balance})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="beneficiaryId">Beneficiary (Optional)</Label>
                                            <Select value={formData.beneficiaryId} onValueChange={(value) => setFormData({ ...formData, beneficiaryId: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select beneficiary" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">None</SelectItem>
                                                    {beneficiaries.map((beneficiary) => (
                                                        <SelectItem key={beneficiary.id} value={beneficiary.id.toString()}>
                                                            {beneficiary.name} - {beneficiary.accountNumber}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="amount">Amount</Label>
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.amount}
                                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="description">Description</Label>
                                            <Input
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-2">
                                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={createTransferMutation.isPending}>
                                                {createTransferMutation.isPending ? 'Creating...' : 'Create Transfer'}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <ArrowRightLeft className="w-5 h-5 mr-2" />
                                    All Transfers
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>User</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>From Account</TableHead>
                                            <TableHead>To Account</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transfers.map((transfer) => (
                                            <TableRow key={transfer.id}>
                                                <TableCell className="font-mono text-sm">{transfer.id}</TableCell>
                                                <TableCell>{transfer.userId}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{transfer.type}</Badge>
                                                </TableCell>
                                                <TableCell className="font-mono">
                                                    ${Number(transfer.amount).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    {transfer.fromAccountId ?
                                                        accounts.find(acc => acc.id === transfer.fromAccountId)?.accountNumber || `ID: ${transfer.fromAccountId}`
                                                        : 'N/A'
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {transfer.toAccountId ?
                                                        accounts.find(acc => acc.id === transfer.toAccountId)?.accountNumber || `ID: ${transfer.toAccountId}`
                                                        : 'N/A'
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(transfer.status)}>
                                                        {transfer.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(transfer.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Link href={`/admin/transfers/${transfer.id}`}>
                                                            <Button size="sm" variant="outline">
                                                                <Eye className="w-3 h-3" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEdit(transfer)}
                                                        >
                                                            <Edit className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDelete(transfer.id)}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Edit Dialog */}
                        <Dialog open={!!editingTransfer} onOpenChange={() => setEditingTransfer(null)}>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Edit Transfer</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="edit-amount">Amount</Label>
                                        <Input
                                            id="edit-amount"
                                            type="number"
                                            step="0.01"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-description">Description</Label>
                                        <Input
                                            id="edit-description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button type="button" variant="outline" onClick={() => setEditingTransfer(null)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={updateTransferMutation.isPending}>
                                            {updateTransferMutation.isPending ? 'Updating...' : 'Update Transfer'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </section>
                </div>
            </PageLayout>
        </AdminGuard>
    );
}


