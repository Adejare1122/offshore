import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    kyc_status: string;
    role: string;
}

interface AdminUserEditModalProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User & { password?: string }) => void;
    isLoading?: boolean;
}

export default function AdminUserEditModal({ user, isOpen, onClose, onSave, isLoading = false }: AdminUserEditModalProps) {
    const [formData, setFormData] = useState<(User & { password?: string }) | null>(null);

    // Update form data when user changes
    useEffect(() => {
        if (user) {
            setFormData({ ...user, password: '' });
        } else {
            setFormData(null);
        }
    }, [user]);

    const handleSave = () => {
        if (formData) {
            onSave(formData);
        }
    };

    const handleInputChange = (field: keyof (User & { password?: string }), value: string) => {
        if (formData) {
            setFormData({ ...formData, [field]: value });
        }
    };

    if (!user || !formData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            value={formData.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="password">Password (leave blank to keep current)</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password || ''}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="Enter new password or leave blank"
                        />
                    </div>

                    <div>
                        <Label htmlFor="kyc_status">KYC Status</Label>
                        <Select
                            value={formData.kyc_status}
                            onValueChange={(value) => handleInputChange('kyc_status', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value) => handleInputChange('role', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
