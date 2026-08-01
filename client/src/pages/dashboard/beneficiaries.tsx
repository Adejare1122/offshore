import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Beneficiary, insertBeneficiarySchema, type InsertBeneficiary } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, User as UserIcon, Building, Globe, Edit, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import PageLayout from "@/components/page-layout";
import { User as UserType } from "@shared/schema";

export default function Beneficiaries() {
  const [isBeneficiaryDialogOpen, setIsBeneficiaryDialogOpen] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Current user
  const { data: me } = useQuery<UserType | null>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  const userId = me?.id != null ? Number(me.id) : undefined;

  const { data: beneficiaries = [], isLoading } = useQuery<Beneficiary[]>({
    queryKey: ["/api/beneficiaries", userId],
    enabled: !!userId,
  });

  const form = useForm<InsertBeneficiary>({
    resolver: zodResolver(insertBeneficiarySchema),
    defaultValues: {
      userId: Number(userId ?? 0),
      name: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      swiftCode: "",
      // Fields removed from UI; send safe defaults on submit
      beneficiaryType: "EXTERNAL",
      address: "",
      country: "",
    },
  });

  const createBeneficiaryMutation = useMutation({
    mutationFn: async (data: InsertBeneficiary) => {
      const response = await apiRequest("POST", "/api/beneficiaries", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/beneficiaries", userId] });
      toast({
        title: "Success",
        description: "Beneficiary added successfully",
      });
      form.reset();
      setIsBeneficiaryDialogOpen(false);
      setEditingBeneficiary(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add beneficiary",
        variant: "destructive",
      });
    },
  });

  const deleteBeneficiaryMutation = useMutation({
    mutationFn: async (beneficiaryId: string | number) => {
      await apiRequest("DELETE", `/api/beneficiaries/${String(beneficiaryId)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/beneficiaries", userId] });
      toast({
        title: "Success",
        description: "Beneficiary deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete beneficiary",
        variant: "destructive",
      });
    },
  });

  const getBeneficiaryIcon = (type: string) => {
    switch (type) {
      case "INTERNAL":
        return <UserIcon className="w-5 h-5" />;
      case "EXTERNAL":
        return <Building className="w-5 h-5" />;
      case "WIRE":
        return <Globe className="w-5 h-5" />;
      default:
        return <UserIcon className="w-5 h-5" />;
    }
  };

  const getBeneficiaryColor = (type: string) => {
    switch (type) {
      case "INTERNAL":
        return "bg-green-100 text-green-600";
      case "EXTERNAL":
        return "bg-blue-100 text-blue-600";
      case "WIRE":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const openEditDialog = (beneficiary: Beneficiary) => {
    setEditingBeneficiary(beneficiary);
    form.reset({
      ...beneficiary,
      userId: Number(userId ?? 0),
    });
    setIsBeneficiaryDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingBeneficiary(null);
    form.reset({
      userId: Number(userId ?? 0),
      name: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      swiftCode: "",
      beneficiaryType: "EXTERNAL",
      address: "",
      country: "",
    });
    setIsBeneficiaryDialogOpen(true);
  };

  const onSubmit = (data: InsertBeneficiary) => {
    const payload: InsertBeneficiary = {
      ...data,
      userId: Number(userId ?? 0),
      beneficiaryType: data.beneficiaryType || "EXTERNAL",
      address: data.address || "",
      country: data.country || "",
    };
    createBeneficiaryMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading beneficiaries...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-primary"
          onClick={() => window.history.back()}
        >
          ← Back
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Beneficiaries</h1>
        <Button
          onClick={openCreateDialog}
          className="bg-white text-banking-primary hover:bg-gray-100"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Beneficiary
        </Button>
      </div>


      <div className="grid gap-6">
        {beneficiaries.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <UserIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">No beneficiaries found</p>
                <p className="text-sm text-gray-500 mb-6">
                  Add beneficiaries to make quick transfers to your frequently used accounts.
                </p>
                <Button
                  onClick={openCreateDialog}
                  className="bg-banking-primary hover:bg-banking-primary-dark"
                >
                  Add Your First Beneficiary
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div />
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Search:</label>
                <Input
                  className="h-9 w-64"
                  placeholder="Search name, bank or account"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {beneficiaries
                  .filter((b) => {
                    if (!search) return true;
                    const hay = `${b.name} ${b.bankName} ${b.accountNumber}`.toLowerCase();
                    return hay.includes(search.toLowerCase());
                  })
                  .map((beneficiary) => (
                    <li key={beneficiary.id} className="hover:bg-gray-50 transition-colors">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getBeneficiaryColor(beneficiary.beneficiaryType)}`}>
                              {getBeneficiaryIcon(beneficiary.beneficiaryType)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm md:text-base font-semibold text-primary truncate">{beneficiary.name}</p>
                                {/* <Badge variant="outline" className="text-[10px] uppercase">{beneficiary.beneficiaryType}</Badge> */}
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5">
                                {beneficiary.bankName} • **** {beneficiary.accountNumber.slice(-4)}
                                {beneficiary.swiftCode ? ` • SWIFT: ${beneficiary.swiftCode}` : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="ghost"
                              className="px-2 rounded-full text-gray-700 hover:bg-gray-100"
                              onClick={() => openEditDialog(beneficiary)}
                            >
                              <Edit className="w-4 h-4" />
                              <span className="text-sm">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              className="px-2 rounded-full text-red-600 hover:bg-red-50"
                              onClick={() => deleteBeneficiaryMutation.mutate(beneficiary.id)}
                              disabled={deleteBeneficiaryMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="text-sm">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Beneficiary Dialog */}
      <Dialog open={isBeneficiaryDialogOpen} onOpenChange={setIsBeneficiaryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingBeneficiary ? "Edit Beneficiary" : "Add New Beneficiary"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="">
                <Label htmlFor="name" className="text-base text-primary font-semibold">Full Name</Label>
                <Input id="name" {...form.register("name")} className="h-9" placeholder="Enter full name" />
              </div>
              <div className="">
                <Label htmlFor="bankName" className="text-base text-primary font-semibold">Bank Name</Label>
                <Input id="bankName" {...form.register("bankName")} className="h-9" placeholder="Enter bank name" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="">
                <Label htmlFor="accountNumber" className="text-base text-primary font-semibold">Account Number</Label>
                <Input id="accountNumber" {...form.register("accountNumber")} className="h-9" placeholder="Enter account number" />
              </div>
              <div className="">
                <Label htmlFor="routingNumber" className="text-base text-primary font-semibold">Routing Number (optional)</Label>
                <Input id="routingNumber" {...form.register("routingNumber")} className="h-9" placeholder="Enter routing number" />
              </div>
            </div>

            {/* Advanced fields omitted for simpler UX; SWIFT optional */}
            <div className="grid grid-cols-2 gap-4">
              <div className="">
                <Label htmlFor="swiftCode" className="text-base text-primary font-semibold">SWIFT Code (optional)</Label>
                <Input id="swiftCode" {...form.register("swiftCode")} className="h-9" placeholder="Enter SWIFT code" />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsBeneficiaryDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createBeneficiaryMutation.isPending}
                className="bg-primary hover:bg-primary-dark"
              >
                {createBeneficiaryMutation.isPending ?
                  (editingBeneficiary ? "Updating..." : "Adding...") :
                  (editingBeneficiary ? "Update Beneficiary" : "Add Beneficiary")
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}