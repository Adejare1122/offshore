import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Beneficiary } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { PlusIcon, UsersIcon } from "lucide-react";
import { AddBeneficiaryDialog } from "./add-beneficiary-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BeneficiariesSectionProps {
  userId: string;
}

export function BeneficiariesSection({ userId }: BeneficiariesSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: beneficiaries = [], isLoading } = useQuery<Beneficiary[]>({
    queryKey: ["/api/beneficiaries", userId],
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (beneficiaryId: string) => {
      await apiRequest("DELETE", `/api/beneficiaries/${beneficiaryId}`);
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

  const handleAddBeneficiary = () => {
    setIsAddDialogOpen(true);
  };

  const handleDeleteBeneficiary = (beneficiaryId: string) => {
    deleteMutation.mutate(beneficiaryId);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Beneficiaries</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Beneficiaries</h2>
          <Button
            onClick={handleAddBeneficiary}
            className="bg-banking-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-banking-primary-dark transition-colors"
          >
            Add New <PlusIcon className="ml-1 w-4 h-4" />
          </Button>
        </div>
        
        {beneficiaries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <UsersIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>
              No Beneficiary.{" "}
              <button
                onClick={handleAddBeneficiary}
                className="text-banking-primary font-medium hover:underline"
              >
                Add New
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {beneficiaries.map((beneficiary) => (
              <div
                key={beneficiary.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{beneficiary.name}</h3>
                  <p className="text-sm text-gray-600">{beneficiary.bankName}</p>
                  <p className="text-sm text-gray-500">•••• {beneficiary.accountNumber.slice(-4)}</p>
                </div>
                <Button
                  onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                  variant="destructive"
                  size="sm"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddBeneficiaryDialog
        userId={userId}
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </>
  );
}
