import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useState } from "react";
import PageLayout from "@/components/page-layout";
import AdminGuard from "@/components/admin-guard";
import AdminNav from "@/components/admin-nav";
import AdminCreditCardEditModal from "@/components/admin-credit-card-edit-modal";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2Icon, Trash2Icon, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function UserCreditCards() {
    const [, params] = useRoute("/admin/users/:userId/credit-cards");
    const userId = params?.userId;
    const queryClient = useQueryClient();
    const [editingCard, setEditingCard] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();
    const { data: user } = useQuery({
        queryKey: [`/api/admin/users/${userId}`],
        queryFn: async () => {
            const res = await fetch(`/api/admin/users/${userId}`);
            if (!res.ok) throw new Error("Failed to load user");
            return res.json();
        },
        enabled: !!userId,
    });

    const { data: creditCards = [] } = useQuery({
        queryKey: [`/api/credit-cards/${userId}`],
        queryFn: async () => {
            const res = await fetch(`/api/credit-cards/${userId}`);
            if (!res.ok) throw new Error("Failed to load credit cards");
            return res.json();
        },
        enabled: !!userId,
    });

    const deleteCard = useMutation({
        mutationFn: async (cardId: number) => {
            const res = await fetch(`/api/credit-cards/${cardId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Failed to delete credit card");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/credit-cards/${userId}`] });
            toast({ title: "Credit card deleted successfully" });
        },
    });

    const updateCard = useMutation({
        mutationFn: async (card: any) => {
            console.log('Updating credit card:', card);
            const res = await fetch(`/api/credit-cards/${card.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(card)
            });
            if (!res.ok) {
                const errorText = await res.text();
                console.error('API Error:', res.status, errorText);
                throw new Error(`Failed to update credit card: ${res.status} ${errorText}`);
            }
            return res.json();
        },
        onSuccess: () => {
            console.log('Credit card updated successfully');
            queryClient.invalidateQueries({ queryKey: [`/api/credit-cards/${userId}`] });
            setIsModalOpen(false);
            setEditingCard(null);
            toast({ title: "Credit card updated successfully" });
        },
        onError: (error) => {
            console.error('Mutation error:', error);
            toast({ title: "Failed to update credit card", description: error.message, variant: "destructive" });
        },
    });

    const handleEditCard = (card: any) => {
        setEditingCard(card);
        setIsModalOpen(true);
    };

    const handleSaveCard = (card: any) => {
        updateCard.mutate(card);
    };

    if (!user) {
        return (
            <AdminGuard>
                <PageLayout showAccountCarousel={false}>
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading user...</p>
                        </div>
                    </div>
                </PageLayout>
            </AdminGuard>
        );
    }

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
                        <div className="flex items-center gap-4 mb-6">
                            <Button variant="outline" asChild>
                                <Link href="/admin/users">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Users
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-2xl font-semibold">Credit Cards</h1>
                                <p className="text-gray-600">{user.firstName} {user.lastName} ({user.email})</p>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Credit Cards</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {creditCards.length === 0 ? (
                                    <div className="py-8 text-center text-gray-500">
                                        No credit cards found for this user
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Card Number</TableHead>
                                                <TableHead>Cardholder</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Expiry</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Balance</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {creditCards.map((card: any) => (
                                                <TableRow key={card.id}>
                                                    <TableCell className="font-mono">
                                                        **** **** **** {card.cardNumber.slice(-4)}
                                                    </TableCell>
                                                    <TableCell>{card.cardholderName}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{card.cardType}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={card.isActive === 'true' ? 'default' : 'outline'}>
                                                            {card.isActive === 'true' ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-mono">
                                                        ${Number(card.currentBalance || 0).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex gap-2 justify-end">
                                                            <Button size="icon" variant="outline" onClick={() => handleEditCard(card)}>
                                                                <Edit2Icon className="size-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="destructive"
                                                                onClick={async () => {
                                                                    if (!confirm(`Delete credit card ending in ${card.cardNumber.slice(-4)}?`)) return;
                                                                    deleteCard.mutate(card.id);
                                                                }}
                                                            >
                                                                <Trash2Icon className="size-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </section>
                </div>

                <AdminCreditCardEditModal
                    card={editingCard}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingCard(null);
                    }}
                    onSave={handleSaveCard}
                    isLoading={updateCard.isPending}
                />
            </PageLayout>
        </AdminGuard>
    );
}
