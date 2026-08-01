import {
  NotebookPen,
  HomeIcon,
  ArrowRightLeftIcon,
  DollarSignIcon,
  ReceiptIcon,
  UserPlusIcon,
  FileTextIcon,
  ListIcon,
  MailIcon,
  TrendingUpIcon,
  HeadphonesIcon,
  CreditCardIcon,
  BitcoinIcon,
  BanknoteIcon
} from "lucide-react";
import { useLocation } from "wouter";

export function QuickActions() {
  const [location, setLocation] = useLocation();

  const quickActions = [
    { icon: NotebookPen, title: "Wire", subtitle: "Transfer", action: "wire_transfer" },
    { icon: HomeIcon, title: "Local", subtitle: "Transfer", action: "local_transfer" },
    { icon: ArrowRightLeftIcon, title: "Internal", subtitle: "Transfer", action: "internal_transfer" },
    { icon: DollarSignIcon, title: "Buy", subtitle: "Crypto", action: "buy_crypto" },
    { icon: ReceiptIcon, title: "Pay", subtitle: "Bills", action: "pay_bills" },
    { icon: UserPlusIcon, title: "Add", subtitle: "Beneficiary", action: "add_beneficiary" },
    { icon: CreditCardIcon, title: "Card", subtitle: "Deposit", action: "card_deposit" },
    { icon: BitcoinIcon, title: "Crypto", subtitle: "Deposit", action: "crypto_deposit" },
    { icon: BanknoteIcon, title: "Check", subtitle: "Deposit", action: "check_deposit" },

    { icon: FileTextIcon, title: "Savings", subtitle: "Statement", action: "savings_statement" },
    { icon: ListIcon, title: "Checking", subtitle: "Statement", action: "checking_statement" },
    { icon: MailIcon, title: "Italian", subtitle: "Alerts", action: "italian_alerts" },
    { icon: DollarSignIcon, title: "Italian", subtitle: "Loans", action: "italian_loans" },
    { icon: TrendingUpIcon, title: "Italian", subtitle: "Investments", action: "italian_investments" },
    { icon: HeadphonesIcon, title: "Italian", subtitle: "Support", action: "italian_support" },
  ];

  const handleAction = (action: string) => {
    switch (action) {
      case "wire_transfer":
        setLocation("/wire-transfer");
        break;
      case "local_transfer":
        setLocation("/local-transfer");
        break;
      case "internal_transfer":
        setLocation("/internal-transfer");
        break;
      case "pay_bills":
        setLocation("/bills");
        break;
      case "add_beneficiary":
        setLocation("/beneficiaries");
        break;
      case "buy_crypto":
        window.location.href = "https://crypto.com";
        break;
      case "savings_statement":
        setLocation("/savings-statement");
        break;
      case "checking_statement":
        setLocation("/checking-statement");
        break;
      case "italian_alerts":
        setLocation("/notifications");
        break;
      case "italian_loans":
        setLocation("/loans");
        break;
      case "italian_investments":
        setLocation("/investments");
        break;
      case "italian_support":
        setLocation("/support");
        break;
      case "card_deposit":
        setLocation("/card-deposit");
        break;
      case "crypto_deposit":
        window.location.href = "https://crypto.com";
        break;
      case "check_deposit":
        setLocation("/check-deposit");
        break;
      default:
        console.log(`Handling action: ${action}`);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Quick Transfer Actions */}
      {(() => {
        const rows: typeof quickActions[] = [];
        for (let i = 0; i < quickActions.length; i += 3) {
          rows.push(quickActions.slice(i, i + 3));
        }
        return (
          <div className="divide-y divide-gray-200">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-3 gap-4 py-4 first:pt-0 last:pb-0">
                {row.map((action, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 transition-shadow cursor-pointer"
                    onClick={() => handleAction(action.action)}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                        <action.icon className="text-white w-8 h-8" strokeWidth={2} />
                      </div>
                      <div className="text-center flex flex-col gap-0 leading-normal text-base md:text-base font-semibold font-sans">
                        <p className="leading-tight">{action.title}</p>
                        <p className="leading-tight">{action.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Fill empty cells to keep 3 columns layout */}
                {Array.from({ length: 3 - row.length }).map((_, i) => (
                  <div key={`spacer-${i}`} />
                ))}
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}
