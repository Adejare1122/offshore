import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bill, insertBillSchema, type InsertBill } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Clock, CheckCircle, AlertTriangle, ArrowLeft, Receipt, Zap, Phone, Shield, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { format } from "date-fns";

const MOCK_USER_ID = "user-1";

export default function Bills() {
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bills = [], isLoading: billsLoading } = useQuery<Bill[]>({
    queryKey: ["/api/bills", MOCK_USER_ID],
  });

  const form = useForm<InsertBill>({
    resolver: zodResolver(insertBillSchema),
    defaultValues: {
      userId: MOCK_USER_ID,
      billerName: "",
      accountNumber: "",
      category: "UTILITIES",
      amount: "",
      status: "PENDING",
      isRecurring: "false",
    },
  });

  const createBillMutation = useMutation({
    mutationFn: async (data: InsertBill) => {
      const response = await apiRequest("POST", "/api/bills", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills", MOCK_USER_ID] });
      toast({
        title: "Success",
        description: "Bill added successfully",
      });
      form.reset();
      setSelectedDate(undefined);
      setIsBillDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add bill",
        variant: "destructive",
      });
    },
  });

  const payBillMutation = useMutation({
    mutationFn: async (billId: string) => {
      const response = await apiRequest("PATCH", `/api/bills/${billId}/status`, { status: "PAID" });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills", MOCK_USER_ID] });
      toast({
        title: "Success",
        description: "Bill paid successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to pay bill",
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

  const getStatusBadge = (status: string, dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const isOverdue = due < now && status === 'PENDING';

    switch (status) {
      case "PAID":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case "PENDING":
        return isOverdue ? 
          <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Overdue</Badge> :
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "UTILITIES":
        return <Zap className="w-5 h-5" />;
      case "TELECOMMUNICATIONS":
        return <Phone className="w-5 h-5" />;
      case "INSURANCE":
        return <Shield className="w-5 h-5" />;
      case "LOANS":
        return <Car className="w-5 h-5" />;
      default:
        return <Receipt className="w-5 h-5" />;
    }
  };

  const onSubmit = (data: InsertBill) => {
    if (selectedDate) {
      createBillMutation.mutate({
        ...data,
        dueDate: selectedDate,
      });
    } else {
      toast({
        title: "Error",
        description: "Please select a due date",
        variant: "destructive",
      });
    }
  };

  if (billsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter bg-white min-h-screen">
      {/* Header */}
      <header className="bg-banking-primary px-4 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-white">Bill Pay</h1>
          <Button
            onClick={() => setIsBillDialogOpen(true)}
            className="bg-white text-banking-primary hover:bg-gray-100"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Bill
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Bills</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="recurring">Recurring</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {bills.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">No bills found</p>
                      <Button 
                        onClick={() => setIsBillDialogOpen(true)}
                        className="mt-4 bg-banking-primary hover:bg-banking-primary-dark"
                      >
                        Add Your First Bill
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                bills.map((bill) => (
                  <Card key={bill.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-banking-primary rounded-full flex items-center justify-center text-white">
                            {getCategoryIcon(bill.category)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{bill.billerName}</h3>
                            <p className="text-sm text-gray-600">{bill.category}</p>
                            <p className="text-xs text-gray-500">
                              Due: {new Date(bill.dueDate).toLocaleDateString()}
                            </p>
                            {bill.isRecurring === 'true' && (
                              <Badge variant="outline" className="text-xs mt-1">Recurring</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="font-semibold">{formatCurrency(bill.amount)}</p>
                          {getStatusBadge(bill.status, bill.dueDate)}
                          {bill.status === 'PENDING' && (
                            <Button
                              size="sm"
                              onClick={() => payBillMutation.mutate(bill.id)}
                              disabled={payBillMutation.isPending}
                              className="bg-banking-primary hover:bg-banking-primary-dark ml-2"
                            >
                              {payBillMutation.isPending ? "Paying..." : "Pay Now"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Filter tabs for different bill statuses */}
          {['pending', 'paid', 'overdue', 'recurring'].map((filter) => (
            <TabsContent key={filter} value={filter} className="mt-6">
              <div className="space-y-4">
                {bills.filter(bill => {
                  if (filter === 'recurring') return bill.isRecurring === 'true';
                  if (filter === 'overdue') {
                    const now = new Date();
                    const due = new Date(bill.dueDate);
                    return due < now && bill.status === 'PENDING';
                  }
                  return bill.status.toLowerCase() === filter;
                }).map((bill) => (
                  <Card key={bill.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-banking-primary rounded-full flex items-center justify-center text-white">
                            {getCategoryIcon(bill.category)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{bill.billerName}</h3>
                            <p className="text-sm text-gray-600">{bill.category}</p>
                            <p className="text-xs text-gray-500">
                              Due: {new Date(bill.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="font-semibold">{formatCurrency(bill.amount)}</p>
                          {getStatusBadge(bill.status, bill.dueDate)}
                          {bill.status === 'PENDING' && (
                            <Button
                              size="sm"
                              onClick={() => payBillMutation.mutate(bill.id)}
                              disabled={payBillMutation.isPending}
                              className="bg-banking-primary hover:bg-banking-primary-dark ml-2"
                            >
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Add Bill Dialog */}
      <Dialog open={isBillDialogOpen} onOpenChange={setIsBillDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Bill</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="billerName">Biller Name</Label>
              <Input
                id="billerName"
                {...form.register("billerName")}
                placeholder="Enter biller name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                {...form.register("accountNumber")}
                placeholder="Enter account number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.watch("category")}
                onValueChange={(value) => form.setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTILITIES">Utilities</SelectItem>
                  <SelectItem value="TELECOMMUNICATIONS">Telecommunications</SelectItem>
                  <SelectItem value="INSURANCE">Insurance</SelectItem>
                  <SelectItem value="LOANS">Loans</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={form.watch("isRecurring") === 'true'}
                onChange={(e) => form.setValue("isRecurring", e.target.checked ? 'true' : 'false')}
                className="rounded"
              />
              <Label htmlFor="isRecurring">This is a recurring bill</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsBillDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createBillMutation.isPending}
                className="bg-banking-primary hover:bg-banking-primary-dark"
              >
                {createBillMutation.isPending ? "Adding..." : "Add Bill"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}