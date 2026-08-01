import {
    CreditCard,
    Building,
    PiggyBank,
    Wallet,
    Landmark,
    Info
} from "lucide-react";

function HexIcon({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="w-28 h-28 border-4 border-accent/80 flex items-center justify-center"
            style={{ clipPath: "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)" }}
        >
            <div className="text-accent">{children}</div>
        </div>
    );
}

export default function ServicesSection() {
    const services = [
        { icon: "/assets/images/icon-Checking Account.svg", title: "INSTANT ACCOUNTS", link: "/home/bank" },
        { icon: "/assets/images/ico-credit-cards.svg", title: "CREDIT CARDS", link: "/home/credit-cards" },
        { icon: "/assets/images/ico-loans.svg", title: "LOANS", link: "/home/borrow" },
        { icon: "/assets/images/ico-businessbanking.svg", title: "BUSINESS BANKING", link: "/home/business-banking" },
        { icon: "/assets/images/ico-invest.svg", title: "WEALTH & RETIRE", link: "/home/invest" },
        { icon: "/assets/images/ico-about.svg", title: "ABOUT ITALIAN", link: "/home/about" },
    ];

    return (
        <section className="py-20 bg-tertiary text-white">
            <div className="container">
                <h2 className="text-center font-serif text-white text-3xl md:text-4xl font-semibold mb-12">How Can We Help You Today?</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-y-16 md:gap-x-8">
                    {services.map((s) => (
                        <div key={s.title} className="group flex justify-center items-center flex-col md:flex-row gap-4 md:gap-6">
                            <img src={s.icon} alt={s.title} className="size-20 md:size-24 group-hover:scale-105 transition-all duration-300" />
                            <div className="uppercase tracking-wide font-medium md:text-xl">{s.title}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}