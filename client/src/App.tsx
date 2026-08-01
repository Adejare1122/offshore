import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard/dashboard";
import Home from "@/pages/home";
import Transfers from "@/pages/dashboard/transfers";
import Bills from "@/pages/dashboard/bills";
import Loans from "@/pages/loans";
import Investments from "@/pages/dashboard/investments";
import Profile from "@/pages/dashboard/profile";
import Notifications from "@/pages/dashboard/notifications";
import Support from "@/pages/support";
import Beneficiaries from "@/pages/dashboard/beneficiaries";
import Crypto from "@/pages/dashboard/crypto";
import NotFound from "@/pages/not-found";
import OpenAccount from "@/pages/open_account";
import SavingsStatement from "@/pages/dashboard/savings-statement";
import CheckingStatement from "@/pages/dashboard/checking-statement";
import CurrentStatement from "@/pages/dashboard/current-statement";
import InternalTransfer from "@/pages/dashboard/internal-transfer";
import LocalTransfer from "@/pages/dashboard/local-transfer";
import WireTransfer from "@/pages/dashboard/wire-transfer";
import AdminHome from "@/pages/admin/index";
import AdminUsers from "@/pages/admin/users";
import AdminAccounts from "@/pages/admin/accounts";
import AdminTransfers from "@/pages/admin/transfers";
import AdminBills from "@/pages/admin/bills";
import AdminTransactions from "@/pages/admin/transactions";
import AdminStatements from "@/pages/admin/statements";
import AdminLogin from "@/pages/admin/login";
import AdminUserDetail from "@/pages/admin/user-detail";
import AdminTransferDetail from "@/pages/admin/transfer-detail";
import AdminTransactionEditor from "@/pages/admin/transaction-editor";
import AdminNotifications from "@/pages/admin/notifications";
import UserCreditCards from "@/pages/admin/user-credit-cards";
import AboutUs from "@/pages/about-us";
import CustomerSupport from "@/pages/customer-support";
import News from "@/pages/news";
import Careers from "@/pages/careers";
import GivingBack from "@/pages/giving-back";
import PrivacyPolicy from "@/pages/privacy-policy";
import FAQs from "@/pages/faqs";
import CreditCards from "@/pages/credit-cards";
import CardDeposit from "@/pages/dashboard/card-deposit";
import SavePage from "@/pages/save";
import Borrow from "@/pages/borrow";
import Invest from "@/pages/invest";
import PostOne from "@/pages/blog/post-one";
import PostTwo from "@/pages/blog/post-two";
import PostThree from "@/pages/blog/post-three";
import PostFour from "@/pages/blog/post-four";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/customer-support" component={CustomerSupport} />
      <Route path="/news" component={News} />
      <Route path="/careers" component={Careers} />
      <Route path="/giving-back" component={GivingBack} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/faqs" component={FAQs} />
      <Route path="/credit-cards" component={CreditCards} />
      <Route path="/save" component={SavePage} />
      <Route path="/borrow" component={Borrow} />
      <Route path="/invest" component={Invest} />

      {/* Routes */}
      <Route path="/tax-checklist-5-things-to-remember" component={PostOne} />
      <Route path="/simple-ways-to-manage-a-checking-account" component={PostTwo} />
      <Route path="/how-to-save-for-summer-vacation" component={PostThree} />
      <Route path="/the-impact-of-rising-rates-and-inflation-on-your-business" component={PostFour} />



      <Route path="/dashboard" component={Dashboard} />
      <Route path="/transfers" component={Transfers} />
      <Route path="/card-deposit" component={CardDeposit} />

      <Route path="/bills" component={Bills} />
      <Route path="/loans" component={Loans} />
      <Route path="/investments" component={Investments} />
      <Route path="/profile" component={Profile} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/support" component={Support} />
      <Route path="/beneficiaries" component={Beneficiaries} />
      <Route path="/crypto" component={Crypto} />
      <Route path="/open_account" component={OpenAccount} />
      <Route path="/savings-statement" component={SavingsStatement} />
      <Route path="/checking-statement" component={CheckingStatement} />
      <Route path="/current-statement" component={CurrentStatement} />
      <Route path="/internal-transfer" component={InternalTransfer} />
      <Route path="/local-transfer" component={LocalTransfer} />
      <Route path="/wire-transfer" component={WireTransfer} />


      <Route path="/admin" component={AdminHome} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/accounts" component={AdminAccounts} />
      <Route path="/admin/transfers" component={AdminTransfers} />
      <Route path="/admin/bills" component={AdminBills} />
      <Route path="/admin/transactions" component={AdminTransactions} />
      <Route path="/admin/statements" component={AdminStatements} />
      <Route path="/admin/notifications" component={AdminNotifications} />
      <Route path="/admin/transactions/new" component={AdminTransactionEditor} />
      <Route path="/admin/transactions/:id/edit" component={AdminTransactionEditor} />
      <Route path="/admin/users/:id" component={AdminUserDetail} />
      <Route path="/admin/users/:userId/credit-cards" component={UserCreditCards} />
      <Route path="/admin/transfers/:id" component={AdminTransferDetail} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
