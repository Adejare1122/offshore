import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Bitcoin, TrendingUp, TrendingDown, DollarSign, Wallet, ShoppingCart, ArrowUpDown } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

// Mock crypto data
const cryptoAssets = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 43250.00,
    change24h: 2.5,
    holdings: 0.05,
    value: 2162.50,
    icon: Bitcoin,
  },
  {
    id: "ethereum", 
    name: "Ethereum",
    symbol: "ETH",
    price: 2650.00,
    change24h: -1.2,
    holdings: 1.2,
    value: 3180.00,
    icon: Bitcoin,
  },
];

export default function Crypto() {
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const { toast } = useToast();

  const buyForm = useForm({
    defaultValues: {
      cryptoId: "",
      amount: "",
      paymentMethod: "",
    },
  });

  const sellForm = useForm({
    defaultValues: {
      cryptoId: "",
      amount: "",
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatCrypto = (amount: number, symbol: string) => {
    return `${amount.toFixed(6)} ${symbol}`;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const totalPortfolioValue = cryptoAssets.reduce((total, asset) => total + asset.value, 0);

  const onBuy = (data: any) => {
    console.log("Buy crypto:", data);
    toast({
      title: "Buy Order Placed",
      description: "Your cryptocurrency purchase is being processed.",
    });
    buyForm.reset();
    setIsBuyDialogOpen(false);
  };

  const onSell = (data: any) => {
    console.log("Sell crypto:", data);
    toast({
      title: "Sell Order Placed", 
      description: "Your cryptocurrency sale is being processed.",
    });
    sellForm.reset();
    setIsSellDialogOpen(false);
  };

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
          <h1 className="text-xl font-semibold text-white">Cryptocurrency</h1>
          <Button
            onClick={() => setIsBuyDialogOpen(true)}
            className="bg-white text-banking-primary hover:bg-gray-100"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy Crypto
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-6 space-y-6">
            {/* Portfolio Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  Portfolio Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">24h Change</p>
                    <div className="flex items-center justify-center space-x-1">
                      <p className="text-2xl font-bold text-green-600">+$125.50</p>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Assets</p>
                    <p className="text-2xl font-bold">{cryptoAssets.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Holdings */}
            <div className="space-y-4">
              {cryptoAssets.map((asset) => (
                <Card key={asset.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <asset.icon className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{asset.name}</h3>
                          <p className="text-sm text-gray-600">{asset.symbol}</p>
                          <p className="text-xs text-gray-500">
                            {formatCrypto(asset.holdings, asset.symbol)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-semibold">{formatCurrency(asset.value)}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(asset.price)}</p>
                        <div className={`flex items-center space-x-1 ${getChangeColor(asset.change24h)}`}>
                          <span className="text-sm font-medium">
                            {asset.change24h >= 0 ? "+" : ""}{asset.change24h.toFixed(2)}%
                          </span>
                          {getChangeIcon(asset.change24h)}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedCrypto(asset.id);
                            setIsBuyDialogOpen(true);
                          }}
                          className="bg-banking-primary hover:bg-banking-primary-dark"
                        >
                          Buy
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedCrypto(asset.id);
                            setIsSellDialogOpen(true);
                          }}
                        >
                          Sell
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State for New Users */}
            {cryptoAssets.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Bitcoin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">Start Your Crypto Journey</p>
                    <p className="text-sm text-gray-500 mb-6">
                      Invest in cryptocurrencies with our secure and regulated platform.
                    </p>
                    <Button
                      onClick={() => setIsBuyDialogOpen(true)}
                      className="bg-banking-primary hover:bg-banking-primary-dark"
                    >
                      Buy Your First Crypto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Markets Tab */}
          <TabsContent value="markets" className="mt-6">
            <div className="space-y-4">
              {[
                { name: "Bitcoin", symbol: "BTC", price: 43250.00, change: 2.5 },
                { name: "Ethereum", symbol: "ETH", price: 2650.00, change: -1.2 },
                { name: "Cardano", symbol: "ADA", price: 0.45, change: 5.8 },
                { name: "Solana", symbol: "SOL", price: 95.30, change: -2.1 },
                { name: "Polkadot", symbol: "DOT", price: 7.25, change: 3.4 },
              ].map((crypto, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Bitcoin className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{crypto.name}</h3>
                          <p className="text-sm text-gray-600">{crypto.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-semibold">{formatCurrency(crypto.price)}</p>
                        <div className={`flex items-center space-x-1 ${getChangeColor(crypto.change)}`}>
                          <span className="text-sm font-medium">
                            {crypto.change >= 0 ? "+" : ""}{crypto.change.toFixed(2)}%
                          </span>
                          {getChangeIcon(crypto.change)}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCrypto(crypto.symbol.toLowerCase());
                          setIsBuyDialogOpen(true);
                        }}
                        className="bg-banking-primary hover:bg-banking-primary-dark"
                      >
                        Buy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="history" className="mt-6">
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <ArrowUpDown className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No transactions yet</p>
                    <p className="text-sm text-gray-500">Your crypto transactions will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Buy Dialog */}
      <Dialog open={isBuyDialogOpen} onOpenChange={setIsBuyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Buy Cryptocurrency</DialogTitle>
          </DialogHeader>
          <form onSubmit={buyForm.handleSubmit(onBuy)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cryptoId">Cryptocurrency</Label>
              <Select
                value={buyForm.watch("cryptoId")}
                onValueChange={(value) => buyForm.setValue("cryptoId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                  <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                  <SelectItem value="solana">Solana (SOL)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...buyForm.register("amount")}
                placeholder="Enter amount to buy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={buyForm.watch("paymentMethod")}
                onValueChange={(value) => buyForm.setValue("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking Account</SelectItem>
                  <SelectItem value="savings">Savings Account</SelectItem>
                  <SelectItem value="debit">Debit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsBuyDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-banking-primary hover:bg-banking-primary-dark">
                Buy Now
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sell Dialog */}
      <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Sell Cryptocurrency</DialogTitle>
          </DialogHeader>
          <form onSubmit={sellForm.handleSubmit(onSell)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cryptoId">Cryptocurrency</Label>
              <Select
                value={sellForm.watch("cryptoId")}
                onValueChange={(value) => sellForm.setValue("cryptoId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {cryptoAssets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name} ({formatCrypto(asset.holdings, asset.symbol)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.000001"
                {...sellForm.register("amount")}
                placeholder="Enter amount to sell"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsSellDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-banking-primary hover:bg-banking-primary-dark">
                Sell Now
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}