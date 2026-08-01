import { CreditCard as CreditCardType } from "@shared/schema";
import { HomeIcon } from "lucide-react";

interface CreditCardProps {
  creditCard?: CreditCardType;
}

export function CreditCard({ creditCard }: CreditCardProps) {
  const formatCardNumber = (cardNumber: string | undefined) => {
    if (!cardNumber) return "4716 XXXX XXXX 6257";
    const first4 = cardNumber.slice(0, 4);
    const last4 = cardNumber.slice(-4);
    return `${first4} XXXX XXXX ${last4}`;
  };

  const formatExpiry = (month: number | undefined, year: number | undefined) => {
    if (!month || !year) return "06/28";
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  const cardholderName = creditCard?.cardholderName || "DARRY D ENZO";
  const cardNumber = formatCardNumber(creditCard?.cardNumber);
  const expiry = formatExpiry(creditCard?.expiryMonth, creditCard?.expiryYear);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Italian Cards</h3>

      {/* Credit Card Display */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white min-h-52 w-full bg-[url('/assets/images/card-bg.png')] bg-center bg-auto"

      >
        {/* central highlight stripe */}
        <div className="absolute inset-y-0 left-1/2 w-24 -translate-x-1/2 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(40% 100% at 50% 50%, rgba(32,93,205,0.6) 0%, rgba(0,0,0,0) 70%)",
          }}
        />

        {/* top row: chip and bank logo */}
        <div className="relative z-10 flex justify-between items-start mb-5">
          {/* Chip */}
          <div className="w-12 h-8 rounded-md bg-[#fdd870]"

          />
          {/* Bank logo badge */}
          <div className="bg-white px-1">
            <img src="/assets/images/favicon.png" className="w-10 h-8" />
          </div>
        </div>

        {/* details */}
        <div className="relative z-10 space-y-2">
          <p className="text-xl tracking-[0.35em] exp-date mb-8">{cardNumber}</p>
          <div className="flex pl-8 justify-between items-end">
            <div className="flex items-end gap-4">
              <div className="leading-none text-sm uppercase opacity-80 tracking-wide">
                <div>Valid</div>
                <div>Thru</div>
              </div>
              <p className="text-lg exp-date tracking-widest">{expiry}</p>
            </div>
          </div>
          <div className="text-left">
            <p className="font-medium card-name text-xl tracking-widest">{cardholderName}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
