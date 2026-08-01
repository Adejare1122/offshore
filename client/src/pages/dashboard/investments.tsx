import { useQuery } from "@tanstack/react-query";
import { Investment, User } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3, DollarSign, PieChart, Settings, Bell, Home, MessageCircle, LogOut, PiggyBank, Wallet, House, Info, ChartLineIcon, HandshakeIcon } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import PageLayout from "@/components/page-layout";

export default function Investments() {
  const { data: me } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const userId = me?.id;

  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ["/api/investments", String(userId ?? "")],
    enabled: !!userId,
  });

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  const getInvestmentIcon = (investmentType: string) => {
    switch (investmentType) {
      case "STOCKS":
        return <TrendingUp className="w-5 h-5" />;
      case "BONDS":
        return <BarChart3 className="w-5 h-5" />;
      case "MUTUAL_FUNDS":
        return <PieChart className="w-5 h-5" />;
      case "ETF":
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  const getGainLossColor = (gainLoss: string) => {
    const value = parseFloat(gainLoss);
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getGainLossIcon = (gainLoss: string) => {
    const value = parseFloat(gainLoss);
    if (value > 0) return <TrendingUp className="w-4 h-4" />;
    if (value < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  const calculatePercentageChange = (purchasePrice: string, currentPrice: string) => {
    const purchase = parseFloat(purchasePrice);
    const current = parseFloat(currentPrice);
    return ((current - purchase) / purchase) * 100;
  };

  const getTotalPortfolioValue = () => {
    return investments.reduce((total, investment) => total + parseFloat(investment.totalValue), 0);
  };

  const getTotalGainLoss = () => {
    return investments.reduce((total, investment) => total + parseFloat(investment.gainLoss), 0);
  };

  return (
    <PageLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Investment Content */}
        <div className="lg:col-span-2 gap-4 flex flex-col divide-y">
          {/* Investment Header */}
          <div className="bg-banking-primary text-white p-2 px-4">
            <h2 className="text-2xl font-bold">Investment</h2>
          </div>
          <h3 className="text-lg font-semibold text-primary">Italian Investment</h3>


          {/* Welcome Section */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Welcome to a more personal way to think about your wealth
                </h3>
                <p className="text-gray-500 mb-4">Contact Support to get started.</p>
                <div className="flex space-x-4">
                  <div className="flex flex-col gap-4 items-center text-center justify-center">
                    <ChartLineIcon className="w-10 h-10 text-yellow-500" strokeWidth={4} />
                    <p className="text-gray-500">
                      National OffshoreResearch Footnote for help adapting your investment strategy to changes in the markets and in your life.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 items-center text-center justify-center">
                    <HandshakeIcon className="w-10 h-10 text-yellow-500" strokeWidth={4} />
                    <p className="text-gray-500">
                      Work with a Italian National OffshoreAdvisor to develop a personalized strategy to help you meet your most important goals.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <img src="/" className="object-cover" />
              </div>
            </div>
          </div>

          {/* Research Section */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Stay informed with research that sets the standard
                  </h3>
                  <p className="text-gray-600">
                    Italian National Offshoreanalysts deliver comprehensive market research that leads the industry. Browse the latest insights, like market performance over time Footnote, to help you make informed investment decisions.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Market Performance Over Time
                  </h3>
                  <p className="text-gray-600">
                    In 22 of the last 40 years, the market dipped by double digits— but still ended the year with positive returns 75% of the time
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <img src="/" className="object-cover" />
              </div>
            </div>
          </div>

          {/* Market Performance Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Market Performance Over Time
              </h3>
              <p className="text-gray-600">
                In 22 of the last 40 years, the market dipped by double digits— but still ended the year with positive returns 75% of the time
              </p>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-banking-primary">
              Whether you're new to investing or have years of experience, we have a strategy for you
            </h3>
          </div>
        </div>

        {/* Right Column - Italian Cards & Tips */}
        <div className="space-y-6">
          {/* Italian Cards Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Italian Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                      <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                    </div>
                    <div className="w-6 h-6 bg-white rounded opacity-20"></div>
                  </div>
                  <div className="text-2xl font-mono tracking-wider mb-2">
                    4716 XXXX XXXX 8257
                  </div>
                  <div className="text-sm opacity-80 mb-2">VALID THRU 06/28</div>
                  <div className="text-lg font-semibold">DARRY D ENZO</div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
              </div>
            </CardContent>
          </Card>

          {/* Italian Tips Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Italian Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Navigation */}
                <div className="flex justify-center space-x-8">
                  <div className="flex flex-col items-center">
                    <MessageCircle className="w-6 h-6 text-gray-600 mb-1" />
                    <span className="text-sm text-gray-600">Support</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <LogOut className="w-6 h-6 text-gray-600 mb-1" />
                    <span className="text-sm text-gray-600">Logout</span>
                  </div>
                </div>

                {/* Tips */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <PiggyBank className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Auto Save</h4>
                      <p className="text-xs text-gray-600">
                        Set a goal, save automatically with Italian National Offshore's Auto Save and track your progress.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Budget</h4>
                      <p className="text-xs text-gray-600">
                        Check in with your budget and stay on top of your spending.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <House className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Home Option</h4>
                      <p className="text-xs text-gray-600">
                        Your home purchase, refinance and insights right under one roof.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Info className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Security Tip</h4>
                      <p className="text-xs text-gray-600">
                        We will NEVER ask you to provide your security details such as COT Code or any sensitive details of your account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}