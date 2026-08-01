import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Transfer, Account, Beneficiary, insertTransferSchema, type InsertTransfer, type User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Plus, Clock, CheckCircle, XCircle, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getQueryFn } from "@/lib/queryClient";
import { AddBeneficiaryDialog } from "@/components/add-beneficiary-dialog";
import PageLayout from "@/components/page-layout";


type TransferFormValues = {
  userId?: number;
  fromAccountId?: string;
  toAccountId?: string;
  beneficiaryId?: string;
  amount: string;
  transferType: string;
  description?: string | null;
  status?: string;
  fees?: string;
};

export default function Transfers() {
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isAddBeneficiaryOpen, setIsAddBeneficiaryOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: me } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const userId = me?.id;

  const { data: transfers = [], isLoading: transfersLoading } = useQuery<Transfer[]>({
    queryKey: ["/api/transfers", String(userId ?? "")],
    enabled: !!userId,
  });

  const { data: accounts = [] } = useQuery<Account[]>({
    queryKey: ["/api/accounts", String(userId ?? "")],
    enabled: !!userId,
  });

  const { data: beneficiaries = [] } = useQuery<Beneficiary[]>({
    queryKey: ["/api/beneficiaries", String(userId ?? "")],
    enabled: !!userId,
  });

  const form = useForm<TransferFormValues>({
    defaultValues: {
      amount: "",
      transferType: "INTERNAL",
      description: "",
      status: "PENDING",
      fees: "0.00",
    },
  });


  const createTransferMutation = useMutation({
    mutationFn: async (data: InsertTransfer) => {
      const response = await apiRequest("POST", "/api/transfers", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transfers", String(userId ?? "")] });
      toast({
        title: "Success",
        description: "Transfer initiated successfully",
      });
      form.reset();
      setIsTransferDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create transfer",
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "FAILED":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const onSubmit = (values: TransferFormValues) => {
    if (!userId || !values.fromAccountId) return;
    if (values.transferType === "INTERNAL" && !values.toAccountId) {
      toast({ title: "Select destination account", variant: "destructive" });
      return;
    }
    // Beneficiary is required for LOCAL and WIRE transfers only
    if ((values.transferType === "LOCAL" || values.transferType === "WIRE") && !values.beneficiaryId) {
      toast({ title: "Select beneficiary", variant: "destructive" });
      return;
    }
    const payload: any = {
      userId: Number(userId),
      fromAccountId: Number(values.fromAccountId),
      amount: values.amount,
      transferType: values.transferType,
      description: values.description || undefined,
      status: values.status || "PENDING",
      fees: values.fees || "0.00",
    };
    if (values.transferType === "INTERNAL" && values.toAccountId) {
      payload.toAccountId = Number(values.toAccountId);
    }
    if (values.beneficiaryId) {
      payload.beneficiaryId = Number(values.beneficiaryId);
    }
    createTransferMutation.mutate(payload as InsertTransfer);
  };

  if (transfersLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transfers...</p>
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
          className="text-gray-600 hover:text-banking-primary"
          onClick={() => window.history.back()}
        >
          ← Back
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Transfers</h1>
        <Button
          onClick={() => setIsTransferDialogOpen(true)}
          className="bg-banking-primary hover:bg-banking-primary-dark text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Transfer
        </Button>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Transfers</TabsTrigger>
          <TabsTrigger value="internal">Internal</TabsTrigger>
          <TabsTrigger value="local">Local</TabsTrigger>
          <TabsTrigger value="wire">Wire</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {transfers.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No transfers found</p>
                    <Button
                      onClick={() => setIsTransferDialogOpen(true)}
                      className="mt-4 bg-banking-primary hover:bg-banking-primary-dark"
                    >
                      Create Your First Transfer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              transfers.map((transfer) => (
                <Card key={transfer.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-banking-primary rounded-full flex items-center justify-center">
                          <ArrowRightLeft className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{transfer.transferType} Transfer</h3>
                          <p className="text-sm text-gray-600">{transfer.description || "No description"}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(transfer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(transfer.amount)}</p>
                        {getStatusBadge(transfer.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Filter tabs for different transfer types */}
        {['internal', 'local', 'wire'].map((type) => (
          <TabsContent key={type} value={type} className="mt-6">
            <div className="space-y-4">
              {transfers.filter(t => t.transferType.toLowerCase() === (type === 'local' ? 'local' : type)).map((transfer) => (
                <Card key={transfer.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-banking-primary rounded-full flex items-center justify-center">
                          <ArrowRightLeft className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{transfer.transferType === 'LOCAL' ? 'Local' : transfer.transferType} Transfer</h3>
                          <p className="text-sm text-gray-600">{transfer.description || "No description"}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(transfer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(transfer.amount)}</p>
                        {getStatusBadge(transfer.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Transfer</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transferType">Transfer Type</Label>
              <Select
                value={form.watch("transferType")}
                onValueChange={(value) => form.setValue("transferType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transfer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERNAL">Internal Transfer</SelectItem>
                  <SelectItem value="LOCAL">Local Transfer</SelectItem>
                  <SelectItem value="WIRE">Wire Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromAccountId">From Account</Label>
              <Select
                value={form.watch("fromAccountId") || ""}
                onValueChange={(value) => form.setValue("fromAccountId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={String(account.id)}>
                      {account.accountType} - {formatCurrency(account.balance)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {form.watch("transferType") === "INTERNAL" && (
              <div className="space-y-2">
                <Label htmlFor="toAccountId">To Account</Label>
                <Select
                  value={form.watch("toAccountId") || ""}
                  onValueChange={(value) => form.setValue("toAccountId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={String(account.id)}>
                        {account.accountType} - {formatCurrency(account.balance)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {form.watch("transferType") !== "INTERNAL" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="beneficiaryId">Beneficiary</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsAddBeneficiaryOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" /> Add New
                  </Button>
                </div>
                <Select
                  value={form.watch("beneficiaryId") || ""}
                  onValueChange={(value) => form.setValue("beneficiaryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select beneficiary" />
                  </SelectTrigger>
                  <SelectContent>
                    {beneficiaries.map((b) => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.name} • {b.bankName} • {b.accountNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                {...form.register("amount")}
                placeholder="Enter amount"
                type="number"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                {...form.register("description")}
                placeholder="Enter description (optional)"
              />
            </div>

            {/* Reference removed to avoid duplication with description */}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createTransferMutation.isPending}
                className="bg-banking-primary hover:bg-banking-primary-dark"
              >
                {createTransferMutation.isPending ? "Creating..." : "Create Transfer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AddBeneficiaryDialog
        userId={String(userId ?? "")}
        isOpen={isAddBeneficiaryOpen}
        onClose={() => {
          setIsAddBeneficiaryOpen(false);
          queryClient.invalidateQueries({ queryKey: ["/api/beneficiaries", String(userId ?? "")] });
        }}
      />
    </PageLayout>
  );
}