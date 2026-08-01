import { useQuery } from "@tanstack/react-query";
import { Loan } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Car, Home, User, Calendar, Percent, DollarSign } from "lucide-react";
import { Link } from "wouter";

const MOCK_USER_ID = "user-1";

export default function Loans() {
  const { data: loans = [], isLoading } = useQuery<Loan[]>({
    queryKey: ["/api/loans", MOCK_USER_ID],
  });

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const getLoanIcon = (loanType: string) => {
    switch (loanType) {
      case "PERSONAL":
        return <User className="w-5 h-5" />;
      case "MORTGAGE":
        return <Home className="w-5 h-5" />;
      case "AUTO":
        return <Car className="w-5 h-5" />;
      case "BUSINESS":
        return <Building2 className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
      case "PAID_OFF":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Paid Off</Badge>;
      case "DEFAULTED":
        return <Badge variant="destructive">Defaulted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateProgress = (principal: string, currentBalance: string) => {
    const principalAmount = parseFloat(principal);
    const balanceAmount = parseFloat(currentBalance);
    const paidAmount = principalAmount - balanceAmount;
    return Math.max(0, Math.min(100, (paidAmount / principalAmount) * 100));
  };

  const calculateRemainingMonths = (nextPaymentDate: string, termMonths: number, currentBalance: string, monthlyPayment: string) => {
    // Simplified calculation based on current balance and monthly payment
    const balance = parseFloat(currentBalance);
    const payment = parseFloat(monthlyPayment);
    return payment > 0 ? Math.ceil(balance / payment) : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading loans...</p>
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
          <h1 className="text-xl font-semibold text-white">Italian Loans</h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {loans.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">No loans found</p>
                  <p className="text-sm text-gray-500">
                    Contact our loan department to explore lending options that suit your needs.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            loans.map((loan) => {
              const progress = calculateProgress(loan.principal, loan.currentBalance);
              const remainingMonths = calculateRemainingMonths(
                loan.nextPaymentDate, 
                loan.termMonths, 
                loan.currentBalance, 
                loan.monthlyPayment
              );

              return (
                <Card key={loan.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-banking-primary rounded-full flex items-center justify-center text-white">
                          {getLoanIcon(loan.loanType)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{loan.loanType} Loan</CardTitle>
                          <p className="text-sm text-gray-600">
                            {loan.termMonths} month term • {loan.interestRate}% APR
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(loan.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Loan Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Loan Progress</span>
                        <span>{progress.toFixed(1)}% paid</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Paid: {formatCurrency((parseFloat(loan.principal) - parseFloat(loan.currentBalance)).toString())}</span>
                        <span>Remaining: {formatCurrency(loan.currentBalance)}</span>
                      </div>
                    </div>

                    {/* Loan Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <DollarSign className="w-5 h-5 mx-auto mb-2 text-banking-primary" />
                        <p className="text-xs text-gray-600">Principal</p>
                        <p className="font-semibold">{formatCurrency(loan.principal)}</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 mx-auto mb-2 text-banking-primary" />
                        <p className="text-xs text-gray-600">Monthly Payment</p>
                        <p className="font-semibold">{formatCurrency(loan.monthlyPayment)}</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Percent className="w-5 h-5 mx-auto mb-2 text-banking-primary" />
                        <p className="text-xs text-gray-600">Interest Rate</p>
                        <p className="font-semibold">{loan.interestRate}%</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 mx-auto mb-2 text-banking-primary" />
                        <p className="text-xs text-gray-600">Months Left</p>
                        <p className="font-semibold">{remainingMonths}</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Next Payment Due</p>
                        <p className="text-sm text-gray-600">
                          {new Date(loan.nextPaymentDate).toLocaleDateString()} • {formatCurrency(loan.monthlyPayment)}
                        </p>
                      </div>
                      <Button className="bg-banking-primary hover:bg-banking-primary-dark">
                        Make Payment
                      </Button>
                    </div>

                    {/* Loan Summary */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span>Current Balance:</span>
                        <span className="font-semibold">{formatCurrency(loan.currentBalance)}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Original Amount:</span>
                        <span>{formatCurrency(loan.principal)}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Loan Term:</span>
                        <span>{loan.termMonths} months</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}

          {/* Loan Application CTA */}
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <Building2 className="w-8 h-8 mx-auto mb-3 text-banking-primary" />
                <h3 className="font-semibold mb-2">Need a New Loan?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Explore our competitive rates for personal, auto, and mortgage loans.
                </p>
                <Button className="bg-banking-primary hover:bg-banking-primary-dark">
                  Apply for Loan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}