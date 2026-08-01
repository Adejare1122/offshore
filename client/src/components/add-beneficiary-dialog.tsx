import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBeneficiarySchema, type InsertBeneficiary } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AddBeneficiaryDialogProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AddBeneficiaryDialog({ userId, isOpen, onClose }: AddBeneficiaryDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertBeneficiary>({
    resolver: zodResolver(insertBeneficiarySchema),
    defaultValues: {
      userId: Number(userId),
      name: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      beneficiaryType: "EXTERNAL",
    },
  });

  const mutation = useMutation({
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
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add beneficiary",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBeneficiary) => {
    mutation.mutate({ ...data, userId: Number(userId) });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Beneficiary</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label className="text-base" htmlFor="name">Beneficiary Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              className="h-9"
              placeholder="Enter beneficiary name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-base" htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              {...form.register("accountNumber")}
              className="h-9"
              placeholder="Enter account number"
            />
            {form.formState.errors.accountNumber && (
              <p className="text-sm text-red-500">{form.formState.errors.accountNumber.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-base" htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              {...form.register("bankName")}
              className="h-9"
              placeholder="Enter bank name"
            />
            {form.formState.errors.bankName && (
              <p className="text-sm text-red-500">{form.formState.errors.bankName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-base" htmlFor="routingNumber">Routing Number (Optional)</Label>
            <Input
              id="routingNumber"
              {...form.register("routingNumber")}
              placeholder="Enter routing number"
            />
            {form.formState.errors.routingNumber && (
              <p className="text-sm text-red-500">{form.formState.errors.routingNumber.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-base" htmlFor="beneficiaryType">Beneficiary Type</Label>
            <Select
              value={form.watch("beneficiaryType")}
              onValueChange={(value) => form.setValue("beneficiaryType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select beneficiary type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INTERNAL">Internal</SelectItem>
                <SelectItem value="EXTERNAL">External</SelectItem>
                <SelectItem value="WIRE">Wire Transfer</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.beneficiaryType && (
              <p className="text-sm text-red-500">{form.formState.errors.beneficiaryType.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              variant="default"
              size="sm"
            >
              {mutation.isPending ? "Adding..." : "Add Beneficiary"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
