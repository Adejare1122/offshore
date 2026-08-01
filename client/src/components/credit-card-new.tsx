import { CreditCard as CreditCardType } from "@shared/schema";
import { Building2 } from "lucide-react";

interface CreditCardNewProps {
    creditCard?: CreditCardType;
}

export function CreditCardNew({ creditCard }: CreditCardNewProps) {
    const formatCardNumber = (cardNumber: string | undefined) => {
        if (!cardNumber) return "4716 XXXX XXXX 8257";
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
        <div
            className="rounded-2xl overflow-hidden p-6 text-white h-52 w-full bg-[url('/assets/images/card-bg.png')] bg-center bg-auto"
        >
            {/* Top row: Gold chip and bank building icon */}
            <div className="flex justify-between items-start mb-6">
                {/* Gold chip */}
                <div
                    className="w-12 h-8 rounded-sm"
                    style={{
                        background: "linear-gradient(180deg, #ffd700 0%, #ffb000 100%)",
                        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.2)",
                    }}
                />

                {/* Bank building icon */}
                <div className="text-amber-100">
                    <Building2 className="w-6 h-6" />
                </div>
            </div>

            {/* Card number */}
            <div className="mb-6">
                <p className="font-mono text-lg tracking-widest font-medium">
                    {cardNumber}
                </p>
            </div>

            {/* Bottom row: Valid thru and cardholder name */}
            <div className="flex justify-between items-end">
                <div className="flex items-end gap-2">
                    <div className="text-xs uppercase tracking-wide opacity-90">
                        <div>VALID</div>
                        <div>THRU</div>
                    </div>
                    <p className="font-mono text-sm font-medium">{expiry}</p>
                </div>

                <div className="text-right">
                    <p className="font-semibold text-base tracking-wide uppercase">
                        {cardholderName}
                    </p>
                </div>
            </div>
        </div>
    );
}
