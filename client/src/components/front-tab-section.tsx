import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Gem, ArrowRightLeft, CreditCard, DollarSign, Building, ChevronDown } from "lucide-react";
import { Link } from "wouter";

interface ProductCardProps {
    icon: React.ReactNode;
    title: string;
    rate: string;
    rateType: string;
    description: string;
    rateColor?: string;
}

function ProductCard({ icon, title, rate, rateType, description, rateColor = "text-teal-600" }: ProductCardProps) {
    return (
        <div className="text-center">
            {/* Icon */}
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full border-2 border-teal-500 flex items-center justify-center">
                    <div className="text-teal-600">
                        {icon}
                    </div>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xs font-semibold text-primary mb-4 tracking-wider uppercase">
                {title}
            </h3>

            {/* Rate */}
            {rate && (
                <>
                    <div className={`text-3xl font-bold mb-1 ${rateColor}`}>
                        {rate}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">{rateType}</div>
                </>
            )}

            {/* Description */}
            <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                {description}
            </div>
        </div>
    );
}

export default function FrontTabSection() {
    const [activeTab, setActiveTab] = useState("");
    const [activeSubTab, setActiveSubTab] = useState("FEATURED");

    //todo: remove mock functionality - replace with real product data
    const ratesData = [
        {
            icon: <Gem className="w-8 h-8" />,
            title: "FEATURED",
            rate: "3.75%",
            rateType: "APY",
            description: "HIGH YIELD SAVINGS ACCOUNT\nHigh Yield Savings Rate",
            rateColor: "text-teal-600"
        },
        {
            icon: <ArrowRightLeft className="w-8 h-8" />,
            title: "SAVINGS",
            rate: "3.65%",
            rateType: "APY",
            description: "18 MONTH CERTIFICATE\nItalian Standard Certificate Rates",
            rateColor: "text-teal-600"
        },
        {
            icon: <CreditCard className="w-8 h-8" />,
            title: "CREDIT CARDS",
            rate: "4.00%",
            rateType: "APY",
            description: "36 MONTH CERTIFICATE\nItalian Standard Certificate Rates",
            rateColor: "text-orange-500"
        },
        {
            icon: <DollarSign className="w-8 h-8" />,
            title: "LOANS",
            rate: "",
            rateType: "",
            description: "",
            rateColor: "text-teal-600"
        },
        {
            icon: <Building className="w-8 h-8" />,
            title: "MORTGAGES",
            rate: "15.40%",
            rateType: "AS LOW AS\nAPR",
            description: "CASH REWARDS MASTERCARD\nMastercard\n*13.40% APR",
            rateColor: "text-orange-500"
        }
    ];

    const caresData = [
        {
            title: "Send Us a Message",
            icon: "/assets/images/icon-send message.svg",
            link: "mailto:info@italiannationaloffshore.com"
        },
        {
            title: "Call Us",
            icon: "/assets/images/icon-call.svg",
            link: "tel:2627227427"
        },
        {
            title: "Schedule an appointment",
            icon: "/assets/images/icon-calendar.svg",
            link: "mailto:info@italiannationaloffshore.com"
        },
        {
            title: "FAQs and Support",
            icon: "/assets/images/icon-FAQs.svg",
            link: "/customer-support"
        },
    ];

    return (
        <section className="bg-[#f7f7f7] pt-10 pb-10 md:pt-20">
            <div className="container bg-white">
                <div className="p-5 py-8 hidden md:block">
                    {/* Parent Tabs */}
                    <div className="mb-0">
                        <div className="grid grid-cols-2 items-stretch border-b-2 border-primary">
                            <button
                                className={`h-14 text-sm font-semibold tracking-wide ${activeTab === "rates" || activeTab == '' ? "bg-[#155e7a] text-white" : "bg-white text-[#155e7a] hover:bg-accent hover:text-white"}`}
                                onClick={() => {
                                    setActiveTab("rates");
                                    console.log('Italian Rates tab clicked');
                                }}
                                data-testid="button-tab-rates"
                            >
                                ITALIAN RATES
                            </button>
                            <button
                                className={`h-14 text-sm font-semibold tracking-wide border-l ${activeTab === "care" ? "bg-[#155e7a] text-white" : "bg-white text-[#155e7a] hover:bg-accent hover:text-white"}`}
                                onClick={() => {
                                    setActiveTab("care");
                                    console.log('Italian Member Care tab clicked');
                                }}
                                data-testid="button-tab-care"
                            >
                                ITALIAN MEMBER CARE
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="">
                        {/* Sub-tabs under Italian Rates */}
                        {(activeTab === "rates" || activeTab === "") && (
                            <>
                                <div className="bg-[#eee] pt-4">
                                    <div className="container">
                                        <div className="grid grid-cols-7 align-center gap-0">
                                            <div />
                                            {[
                                                { label: "FEATURED", icon: <Gem className="w-10 h-10" /> },
                                                { label: "SAVINGS", icon: <ArrowRightLeft className="w-10 h-10" /> },
                                                { label: "CREDIT CARDS", icon: <CreditCard className="w-10 h-10" /> },
                                                { label: "LOANS", icon: <DollarSign className="w-10 h-10" /> },
                                                { label: "MORTGAGES", icon: <Building className="w-10 h-10" /> },
                                            ].map(({ label, icon }) => (
                                                <button
                                                    key={label}
                                                    onClick={() => setActiveSubTab(label)}
                                                    className={`flex flex-col items-center justify-center py-8 text-md font-semibold
                                                       hover:bg-white tracking-wider uppercase ${activeSubTab === label ? "bg-white text-tertiary" : "text-black"}`}
                                                >
                                                    <div className="text-accent mb-2">{icon}</div>
                                                    {label}
                                                </button>
                                            ))}
                                            <div />
                                        </div>
                                    </div>
                                </div>

                                {/* Rates grid area */}
                                <div className="bg-white px-8 py-10">
                                    {(() => {
                                        type RateCard = { rate: string; suffix: string; title: string; subtitle: string; small: string };
                                        const featured: RateCard[] = [
                                            { rate: "3.75%", suffix: "APY", title: "HIGH YIELD SAVINGS ACCOUNT", subtitle: "High Yield Savings Rate", small: "" },
                                            { rate: "3.65%", suffix: "APY", title: "18 MONTH CERTIFICATE", subtitle: "Italian Standard Certificate Rates", small: "" },
                                            { rate: "4.00%", suffix: "APY", title: "36 MONTH CERTIFICATE", subtitle: "Italian Standard Certificate Rates", small: "" },
                                            { rate: "15.49%", suffix: "APR", title: "CASH REWARDS MASTERCARD", subtitle: "Mastercard", small: "variable APR" },
                                        ];
                                        const savings: RateCard[] = [
                                            { rate: "3.75%", suffix: "APY", title: "HIGH YIELD SAVINGS ACCOUNT", subtitle: "High Yield Savings Rate", small: "" },
                                            { rate: "3.65%", suffix: "APY", title: "18 MONTH CERTIFICATE", subtitle: "Italian Standard Certificate Rates", small: "" },
                                            { rate: "4.00%", suffix: "APY", title: "36 MONTH CERTIFICATE", subtitle: "Italian Standard Certificate Rates", small: "" },
                                            { rate: "4.20%", suffix: "APY", title: "60 MONTH CERTIFICATE", subtitle: "Italian Standard Certificate Rates", small: "" },
                                        ];
                                        const creditCards: RateCard[] = [
                                            { rate: "15.49%", suffix: "APR", title: "CASH REWARDS MASTERCARD", subtitle: "Mastercard", small: "variable APR" },
                                            { rate: "9.99%", suffix: "APR", title: "REWARDS MASTERCARD", subtitle: "Mastercard", small: "fixed APR" },
                                            { rate: "11.49%", suffix: "APR", title: "CHOICE MASTERCARD", subtitle: "Mastercard", small: "variable APR" },
                                            { rate: "14.49%", suffix: "APR", title: "WORLD MASTERCARD", subtitle: "Mastercard", small: "variable APR" },
                                        ];
                                        const loans: RateCard[] = [
                                            { rate: "5.89%", suffix: "APR", title: "NEW AUTO - UP TO 66 MONTHS", subtitle: "Auto Loan Rates", small: "as low as" },
                                            { rate: "6.19%", suffix: "APR", title: "USED - UP TO 66 MONTHS", subtitle: "Auto Loan Rates", small: "as low as" },
                                            { rate: "11.99%", suffix: "APR", title: "PERSONAL LOAN", subtitle: "Personal Loan Rates", small: "as low as" },
                                            { rate: "2.49%", suffix: "INTRO", title: "INTEREST-ONLY HELOC", subtitle: "Home Equity Loan Rates", small: "variable" },
                                        ];
                                        const mortgages: RateCard[] = [
                                            { rate: "6.375%", suffix: "REG", title: "10 YEAR REFINANCE RATE", subtitle: "Conventional Mortgage and Refinance Rates", small: "fixed rate" },
                                            { rate: "6.875%", suffix: "REG", title: "30 YEAR PURCHASE RATE", subtitle: "Conventional Mortgage and Refinance Rates", small: "fixed rate" },
                                            { rate: "6.625%", suffix: "REG", title: "10/1 YEAR ARM", subtitle: "Conventional Mortgage and Refinance Rates", small: "variable rate" },
                                            { rate: "4.00%", suffix: "APY", title: "36 MONTH CERTIFICATE", subtitle: "Italian Standard Certificate Rates", small: "" },
                                        ];

                                        const tabToData: Record<string, RateCard[]> = {
                                            FEATURED: featured,
                                            SAVINGS: savings,
                                            "CREDIT CARDS": creditCards,
                                            LOANS: loans,
                                            MORTGAGES: mortgages,
                                        };
                                        const data = tabToData[activeSubTab] || featured;
                                        return (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                                                {data.map((p) => (
                                                    <div key={p.title} className="text-center">
                                                        <div className="text-[11px] uppercase text-gray-500">AS LOW AS</div>
                                                        <div className="text-4xl md:text-5xl font-bold text-orange-500 mt-1">{p.rate}
                                                            <span className="align-top text-xs ml-1">{p.suffix}</span>
                                                        </div>
                                                        <div className="mt-3 font-semibold text-sm tracking-wide uppercase text-gray-700">{p.title}</div>
                                                        <div className="mt-2 text-blue-700 font-semibold">{p.subtitle}</div>
                                                        {p.small && <div className="text-xs text-gray-500 mt-1">{p.small}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </>
                        )}

                        {/* Italian Member Care icon boxes */}
                        {activeTab === "care" && (
                            <div className="px-8 py-10">
                                <div className="grid grid-cols-2 md:grid-cols-4 justify-stretch gap-6">
                                    {caresData.map((care, i) => (
                                        <Link href={care.link} key={i} className="group py-8 flex flex-col items-center text-center gap-3">
                                            <img src={care.icon} className="size-20 group-hover:scale-105 transition duration-300 ease-in-out" />
                                            <div className="text-sm font-semibold tracking-wider text-primary uppercase">{care.title}</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile */}
                <div className="block md:hidden">
                    {/* Parent Tabs */}
                    <div className="mb-0">
                        <div className="grid grid-cols-1 gap-0">
                            <button
                                className={`h-14 text-lg font-semibold  inline-flex gap-1 items-center justify-center bg-primary text-white`}
                                onClick={() => {
                                    setActiveTab(activeTab == "rates" ? "" : "rates");
                                    console.log('Italian Rates tab clicked');
                                }}
                                data-testid="button-tab-rates"
                            >
                                RATES

                                <ChevronDown className={`size-4 text-white transition-all duration-300 ${activeTab == 'rates' ? '-rotate-180' : ''}`} />
                            </button>

                            {/* Tab content */}
                            {activeTab === "rates" || activeTab === "" && (
                                <div className="flex">

                                    {/* Rates grid area */}
                                    <div className="bg-white px-4 py-8">
                                        {(() => {
                                            type RateCard = { rate: string; suffix: string; title: string; subtitle: string; small: string };
                                            const featured: RateCard[] = [
                                                { rate: "3.75%", suffix: "APY", title: "HIGH YIELD SAVINGS ACCOUNT", subtitle: "High Yield Savings Rate", small: "" },
                                                { rate: "3.65%", suffix: "APY", title: "18 MONTH CERTIFICATE", subtitle: "Italian Standard Certificate Rates", small: "" },
                                                { rate: "4.00%", suffix: "APY", title: "36 MONTH CERTIFICATE", subtitle: "Italian Standard Certificate Rates", small: "" },
                                                { rate: "15.49%", suffix: "APR", title: "CASH REWARDS MASTERCARD", subtitle: "Mastercard", small: "variable APR" },
                                            ];
                                            const savings: RateCard[] = [
                                                { rate: "3.75%", suffix: "APY", title: "HIGH YIELD SAVINGS ACCOUNT", subtitle: "High Yield Savings Rate", small: "" },
                                                { rate: "3.65%", suffix: "APY", title: "18 MONTH CERTIFICATE", subtitle: "Italian Standard Certificate Rates", small: "" },
                                                { rate: "4.00%", suffix: "APY", title: "36 MONTH CERTIFICATE", subtitle: "Italian Standard Certificate Rates", small: "" },
                                                { rate: "4.20%", suffix: "APY", title: "60 MONTH CERTIFICATE", subtitle: "Italian Standard Certificate Rates", small: "" },
                                            ];
                                            const creditCards: RateCard[] = [
                                                { rate: "15.49%", suffix: "APR", title: "CASH REWARDS MASTERCARD", subtitle: "Mastercard", small: "variable APR" },
                                                { rate: "9.99%", suffix: "APR", title: "REWARDS MASTERCARD", subtitle: "Mastercard", small: "fixed APR" },
                                                { rate: "11.49%", suffix: "APR", title: "CHOICE MASTERCARD", subtitle: "Mastercard", small: "variable APR" },
                                                { rate: "14.49%", suffix: "APR", title: "WORLD MASTERCARD", subtitle: "Mastercard", small: "variable APR" },
                                            ];
                                            const loans: RateCard[] = [
                                                { rate: "5.89%", suffix: "APR", title: "NEW AUTO - UP TO 66 MONTHS", subtitle: "Auto Loan Rates", small: "as low as" },
                                                { rate: "6.19%", suffix: "APR", title: "USED - UP TO 66 MONTHS", subtitle: "Auto Loan Rates", small: "as low as" },
                                                { rate: "11.99%", suffix: "APR", title: "PERSONAL LOAN", subtitle: "Personal Loan Rates", small: "as low as" },
                                                { rate: "2.49%", suffix: "INTRO", title: "INTEREST-ONLY HELOC", subtitle: "Home Equity Loan Rates", small: "variable" },
                                            ];
                                            const mortgages: RateCard[] = [
                                                { rate: "6.375%", suffix: "REG", title: "10 YEAR REFINANCE RATE", subtitle: "Conventional Mortgage and Refinance Rates", small: "fixed rate" },
                                                { rate: "6.875%", suffix: "REG", title: "30 YEAR PURCHASE RATE", subtitle: "Conventional Mortgage and Refinance Rates", small: "fixed rate" },
                                                { rate: "6.625%", suffix: "REG", title: "10/1 YEAR ARM", subtitle: "Conventional Mortgage and Refinance Rates", small: "variable rate" },
                                                { rate: "4.00%", suffix: "APY", title: "36 MONTH CERTIFICATE", subtitle: "Italian Standard Certificate Rates", small: "" },
                                            ];

                                            const tabToData: Record<string, RateCard[]> = {
                                                FEATURED: featured,
                                                SAVINGS: savings,
                                                "CREDIT CARDS": creditCards,
                                                LOANS: loans,
                                                MORTGAGES: mortgages,
                                            };
                                            const data = tabToData[activeSubTab] || featured;
                                            return (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                                                    {data.map((p) => (
                                                        <div key={p.title} className="text-center">

                                                            <div className="text-4xl md:text-5xl font-bold font-serif text-[#dc7a09] mt-1">{p.rate}
                                                                <span className="align-top text-xs ml-1">{p.suffix}</span>
                                                            </div>
                                                            <div className="mt-3 font-semibold text-xs tracking-wide uppercase text-[#666]">{p.title}</div>
                                                            <div className="mt-2 text-sm text-tertiary font-semibold">{p.subtitle}</div>
                                                            {p.small && <div className="text-xs text-gray-500 mt-1">{p.small}</div>}
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    <div className="bg-[#eee] pt-4">
                                        <div className="grid grid-cols-1 align-center gap-0">
                                            <div />
                                            {[
                                                { label: "FEATURED", icon: <Gem className="w-10 h-10" /> },
                                                { label: "SAVINGS", icon: <ArrowRightLeft className="w-10 h-10" /> },
                                                { label: "CREDIT CARDS", icon: <CreditCard className="w-10 h-10" /> },
                                                { label: "LOANS", icon: <DollarSign className="w-10 h-10" /> },
                                                { label: "MORTGAGES", icon: <Building className="w-10 h-10" /> },
                                            ].map(({ label, icon }) => (
                                                <button
                                                    key={label}
                                                    onClick={() => setActiveSubTab(label)}
                                                    className={`flex flex-col items-center justify-center py-8 text-md font-semibold
                                                    hover:bg-white tracking-wider uppercase ${activeSubTab === label ? "bg-white text-tertiary" : "text-black"}`}
                                                >
                                                    <div className="text-accent mb-2">{icon}</div>
                                                    {label}
                                                </button>
                                            ))}
                                            <div />
                                        </div>
                                    </div>

                                </div>
                            )}

                            <button
                                className={`h-14 text-lg font-semibold inline-flex gap-1 items-center justify-center bg-primary text-white mt-2`}
                                onClick={() => {
                                    setActiveTab("care");
                                    console.log('Italian Member Care tab clicked');
                                }}
                                data-testid="button-tab-care"
                            >
                                MEMBER CARE
                                <ChevronDown className="size-4 text-white" />
                            </button>

                            {/* Italian Member Care icon boxes */}
                            {activeTab === "care" && (
                                <div className="px-4 py-5">
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                        {caresData.map((care, i) => (
                                            <Link href={care.link} key={i} className="py-8 flex flex-col items-center text-center gap-3">
                                                <img src={care.icon} className="size-20" />
                                                <div className="text-sm font-semibold tracking-wider text-primary uppercase">{care.title}</div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}