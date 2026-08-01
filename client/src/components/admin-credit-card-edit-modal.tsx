import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreditCard {
    id: number;
    cardNumber: string;
    cardholderName: string;
    expiryMonth: number;
    expiryYear: number;
    cardType: string;
    creditLimit: string;
    currentBalance: string;
    isActive: string;
}

interface AdminCreditCardEditModalProps {
    card: CreditCard | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (card: CreditCard) => void;
    isLoading?: boolean;
}

export default function AdminCreditCardEditModal({ card, isOpen, onClose, onSave, isLoading = false }: AdminCreditCardEditModalProps) {
    const [formData, setFormData] = useState<CreditCard | null>(null);

    // Update form data when card changes
    useEffect(() => {
        if (card) {
            setFormData({ ...card });
        } else {
            setFormData(null);
        }
    }, [card]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Saving credit card:', formData);
        if (formData) {
            onSave(formData);
        } else {
            console.error('No form data to save');
        }
    };

    const handleInputChange = (field: keyof CreditCard, value: string | number) => {
        if (formData) {
            setFormData({ ...formData, [field]: value });
        }
    };

    if (!card || !formData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Credit Card</DialogTitle>
                </DialogHeader>

                <form id="credit-card-form" onSubmit={handleSave} className="space-y-4">
                    <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                        />
                    </div>

                    <div>
                        <Label htmlFor="cardholderName">Cardholder Name</Label>
                        <Input
                            id="cardholderName"
                            value={formData.cardholderName}
                            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="expiryMonth">Expiry Month</Label>
                            <Select
                                value={formData.expiryMonth.toString()}
                                onValueChange={(value) => handleInputChange('expiryMonth', parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                                            {String(i + 1).padStart(2, '0')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="expiryYear">Expiry Year</Label>
                            <Input
                                id="expiryYear"
                                type="number"
                                value={formData.expiryYear}
                                onChange={(e) => handleInputChange('expiryYear', parseInt(e.target.value))}
                                min={new Date().getFullYear()}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="cardType">Card Type</Label>
                        <Select
                            value={formData.cardType}
                            onValueChange={(value) => handleInputChange('cardType', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DEBIT">Debit</SelectItem>
                                <SelectItem value="CREDIT">Credit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="creditLimit">Credit Limit</Label>
                        <Input
                            id="creditLimit"
                            type="number"
                            step="0.01"
                            value={formData.creditLimit}
                            onChange={(e) => handleInputChange('creditLimit', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="currentBalance">Current Balance</Label>
                        <Input
                            id="currentBalance"
                            type="number"
                            step="0.01"
                            value={formData.currentBalance}
                            onChange={(e) => handleInputChange('currentBalance', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="isActive">Status</Label>
                        <Select
                            value={formData.isActive}
                            onValueChange={(value) => handleInputChange('isActive', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </form>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" form="credit-card-form" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
