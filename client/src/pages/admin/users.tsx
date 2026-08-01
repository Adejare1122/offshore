import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import PageLayout from "@/components/page-layout";
import AdminGuard from "@/components/admin-guard";
import AdminNav from "@/components/admin-nav";
import AdminUserEditModal from "@/components/admin-user-edit-modal";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit2Icon, Trash2Icon, CreditCardIcon } from "lucide-react";

export default function AdminUsers() {
    const queryClient = useQueryClient();
    const [editingUser, setEditingUser] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: users = [] } = useQuery<any[]>({ queryKey: ["/api/admin/users?limit=25&offset=0"] });

    const update = useMutation({
        mutationFn: async (user: any) => {
            const res = await fetch(`/api/admin/users/${user.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
            setIsModalOpen(false);
            setEditingUser(null);
        },
    });

    const handleEditUser = (user: any) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSaveUser = (user: any) => {
        update.mutate(user);
    };

    return (
        <AdminGuard>
            <PageLayout showAccountCarousel={false}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <aside className="md:col-span-1">
                        <div className="border rounded-md p-3"><AdminNav /></div>
                    </aside>
                    <section className="md:col-span-3">
                        <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>
                        <div className="border rounded-md overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Account ID</TableHead>
                                        <TableHead>Email</TableHead>

                                        <TableHead>KYC Status</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map(u => (
                                        <TableRow key={u.id}>
                                            <TableCell className="font-medium">
                                                {u.firstName} {u.lastName}
                                            </TableCell>
                                            <TableCell>{u.username || '-'}</TableCell>
                                            <TableCell>{u.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={u.kyc_status === 'verified' ? 'default' : u.kyc_status === 'rejected' ? 'destructive' : 'outline'}>
                                                    {u.kyc_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={u.role === 'ADMIN' ? 'default' : 'outline'}>
                                                    {u.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Button size="icon" variant="outline" onClick={() => handleEditUser(u)}>
                                                        <Edit2Icon className="size-4" />
                                                    </Button>
                                                    <Button variant="outline" asChild>
                                                        <Link href={`/admin/users/${u.id}`}>
                                                            Accounts
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" asChild>
                                                        <Link href={`/admin/users/${u.id}/credit-cards`}>
                                                            <CreditCardIcon className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button size="icon" variant="destructive" onClick={async () => {
                                                        if (!confirm(`Delete user ${u.email}?`)) return;
                                                        await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' });
                                                        queryClient.invalidateQueries({ queryKey: ["/api/admin/users?limit=25&offset=0"] });
                                                    }}>
                                                        <Trash2Icon className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </section>
                </div>

                <AdminUserEditModal
                    user={editingUser}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingUser(null);
                    }}
                    onSave={handleSaveUser}
                    isLoading={update.isPending}
                />

                <p className="mt-10 text-sm">Note: Default password to all user account is: <strong>password123</strong></p>
            </PageLayout>
        </AdminGuard>
    );
}


