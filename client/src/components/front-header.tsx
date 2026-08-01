// import { Button } from "@/components/ui/button";
// import { Lock, ChevronRight } from "lucide-react";
// import { useState } from "react";

// export default function FrontHeader() {
//     const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

//     const mainMenuItems = [
//         { name: "HOME", href: "/" },
//         { name: "BANK", href: "/bank", hasMegaMenu: true },
//         { name: "SAVE", href: "/save", hasMegaMenu: true },
//         { name: "BORROW", href: "/borrow", hasMegaMenu: true },
//         { name: "WEALTH & RETIRE", href: "/wealth-retire", hasMegaMenu: true },
//         { name: "INSURE", href: "/insure", hasMegaMenu: true },
//         { name: "LEARN & PLAN", href: "/learn-plan", hasMegaMenu: true },
//         { name: "PAYMENTS", href: "/payments", hasMegaMenu: true },
//     ];

//     //todo: remove mock functionality - replace with real menu data
//     const megaMenuContent = {
//         "BANK": {
//             title: "BANK",
//             leftColumns: [
//                 ["Checking Accounts", "Savings Accounts", "Money Market", "CDs"],
//                 ["Online Banking", "Mobile Banking", "ATM Services", "Wire Transfers"]
//             ],
//             rightSection: {
//                 title: "Start Banking Today",
//                 description: "Open your account online in minutes with competitive rates and no hidden fees.",
//                 buttonText: "GET STARTED"
//             }
//         },
//         "SAVE": {
//             title: "SAVE",
//             leftColumns: [
//                 ["High-Yield Savings", "Money Market", "CDs", "IRA Accounts"],
//                 ["Kids Savings", "Goal-Based Savings", "Emergency Fund", "Investment Options"]
//             ],
//             rightSection: {
//                 title: "Grow Your Savings",
//                 description: "Maximize your savings potential with our competitive interest rates and flexible terms.",
//                 buttonText: "LEARN MORE"
//             }
//         },
//         "BORROW": {
//             title: "BORROW",
//             leftColumns: [
//                 ["Personal Loans", "Auto Loans", "Home Loans", "Student Loans"],
//                 ["Credit Cards", "Home Equity", "Business Loans", "Line of Credit"]
//             ],
//             rightSection: {
//                 title: "Smart Borrowing Solutions",
//                 description: "Get the funds you need with competitive rates and flexible repayment options.",
//                 buttonText: "APPLY NOW"
//             }
//         },
//         "WEALTH & RETIRE": {
//             title: "WEALTH & RETIRE",
//             leftColumns: [
//                 ["401(k) Plans", "IRA Accounts", "Investment Advisory", "Retirement Planning"],
//                 ["Wealth Management", "Estate Planning", "Trust Services", "Financial Planning"]
//             ],
//             rightSection: {
//                 title: "Plan Your Future",
//                 description: "Build wealth and secure your retirement with our comprehensive financial solutions.",
//                 buttonText: "PLAN NOW"
//             }
//         },
//         "INSURE": {
//             title: "INSURE",
//             leftColumns: [
//                 ["Medicare Insurance", "Life Insurance", "Auto Insurance", "Homeowners and Renters Insurance"],
//                 ["Accidental Death & Dismemberment Insurance", "Hospital Accident Insurance"]
//             ],
//             rightSection: {
//                 title: "Let's Navigate Medicare Together",
//                 description: "Italian offers dedicated Medicare Specialists to help you better prepare and understand your Medicare options.",
//                 buttonText: "LEARN MORE"
//             }
//         },
//         "LEARN & PLAN": {
//             title: "LEARN & PLAN",
//             leftColumns: [
//                 ["Financial Education", "Budgeting Tools", "Calculators", "Market Insights"],
//                 ["Retirement Planning", "College Planning", "Investment Basics", "Credit Education"]
//             ],
//             rightSection: {
//                 title: "Financial Education Center",
//                 description: "Access tools, resources, and expert guidance to make informed financial decisions.",
//                 buttonText: "EXPLORE"
//             }
//         },
//         "PAYMENTS": {
//             title: "PAYMENTS",
//             leftColumns: [
//                 ["Online Bill Pay", "Mobile Payments", "Wire Transfers", "ACH Transfers"],
//                 ["Zelle", "Person-to-Person", "Business Payments", "International Transfers"]
//             ],
//             rightSection: {
//                 title: "Easy Payment Solutions",
//                 description: "Send money, pay bills, and manage payments securely from anywhere, anytime.",
//                 buttonText: "GET STARTED"
//             }
//         }
//     };

//     return (
//         <header className="sticky top-0 z-50">
//             {/* Top blue bar */}
//             <div className="bg-tertiary">
//                 <div className="container">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                             <img src="/assets/images/logo.png" className="w-auto h-6" alt="Italian National" />
//                         </div>
//                         <div className="flex items-center gap-4 pt-2">
//                             <button className="flex flex-col items-center text-white font-bold text-lg px-5 py-4 bg-primary uppercase gap-2">
//                                 Login
//                                 <span className="w-10 h-[2px] bg-accent" />
//                             </button>
//                             <button className="text-white text-lg font-bold uppercase px-5 py-4 transition">Open Account</button>

//                             <Lock className="w-4 h-4 opacity-90 text-white" />
//                             <div className="flex items-center gap-1 font-bold opacity-90 text-white">
//                                 <img src="https://flagcdn.com/24x18/gb.png" className="w-5 h-4" />
//                                 <span>English</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Navigation */}
//             <div className="text-white relative bg-primary">
//                 <div className="container">
//                     <nav className={`flex justify-between tracking-wide items-center h-14 ${activeMegaMenu ? 'border-b-2 border-white/10' : ''}`}>
//                         {mainMenuItems.map((item, index) => (
//                             <a
//                                 key={item.name}
//                                 href={item.href}
//                                 data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, "-").replace("&", "")}`}
//                                 className={`px-4 text-base font-semibold py-4 hover:opacity-100 transition-colors ${index === 0 ? 'font-bold' : ''
//                                     } ${activeMegaMenu === item.name ? 'font-bold border-b-2 border-white' : ''}`}
//                                 onMouseEnter={() => item.hasMegaMenu ? setActiveMegaMenu(item.name) : setActiveMegaMenu(null)}
//                                 onMouseLeave={() => { }}
//                                 onClick={() => console.log(`${item.name} clicked`)}
//                             >
//                                 {item.name}
//                             </a>
//                         ))}
//                     </nav>
//                 </div>

//                 {/* Mega Menu */}
//                 {activeMegaMenu && megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent] && (
//                     <div
//                         className="absolute top-full left-0 w-full text-white bg-[#155e7a] shadow-lg z-50"
//                         onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
//                         onMouseLeave={() => setActiveMegaMenu(null)}
//                     >
//                         <div className="container py-8">
//                             <div className="grid grid-cols-4 gap-8">
//                                 {/* Menu Title */}
//                                 <div className="col-span-1">
//                                     <h2 className="text-2xl font-bold">
//                                         {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].title}
//                                     </h2>
//                                 </div>

//                                 {/* Menu Items - Two Columns */}
//                                 <div className="col-span-2 grid grid-cols-2 gap-8">
//                                     {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].leftColumns.map((column, colIndex) => (
//                                         <div key={colIndex}>
//                                             {column.map((item, itemIndex) => (
//                                                 <div
//                                                     key={itemIndex}
//                                                     className="flex items-center justify-between py-2 hover:bg-white/10 px-2 -mx-2 cursor-pointer transition-colors"
//                                                     onClick={() => console.log(`${item} clicked`)}
//                                                 >
//                                                     <span className="text-sm">{item}</span>
//                                                     <ChevronRight className="w-4 h-4" />
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {/* Promotional Section */}
//                                 <div className="col-span-1">
//                                     <div className="bg-white/10 rounded-lg p-4">
//                                         <h3 className="font-semibold mb-2">
//                                             {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].rightSection.title}
//                                         </h3>
//                                         <p className="text-sm mb-4 leading-relaxed">
//                                             {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].rightSection.description}
//                                         </p>
//                                         <Button
//                                             size="sm"
//                                             variant="secondary"
//                                             data-testid={`button-mega-menu-${activeMegaMenu.toLowerCase().replace(/\s+/g, "-")}`}
//                                             onClick={() => console.log(`${megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].rightSection.buttonText} clicked`)}
//                                         >
//                                             {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].rightSection.buttonText}
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </header>
//     );
// }



import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, ChevronRight, Menu, X, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";

export default function FrontHeader() {
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);

    const [, setLocation] = useLocation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggingIn, setLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [otpPhase, setOtpPhase] = useState(false);
    const [otpCode, setOtpCode] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [registering, setRegistering] = useState(false);
    const [registerError, setRegisterError] = useState<string | null>(null);
    // Allow other components (e.g., footer) to open the modals via global events
    useEffect(() => {
        const openLogin = () => setLoginOpen(true);
        const openRegister = () => setRegisterOpen(true);
        window.addEventListener('app:open-login', openLogin as EventListener);
        window.addEventListener('app:open-register', openRegister as EventListener);
        return () => {
            window.removeEventListener('app:open-login', openLogin as EventListener);
            window.removeEventListener('app:open-register', openRegister as EventListener);
        };
    }, []);

    const mainMenuItems = [
        { name: "HOME", href: "/" },
        { name: "BANK", href: "/bank", hasMegaMenu: true },
        { name: "SAVE", href: "/save", hasMegaMenu: true },
        { name: "BORROW", href: "/borrow", hasMegaMenu: true },
        { name: "WEALTH & RETIRE", href: "/wealth-retire", hasMegaMenu: true },
        { name: "INSURE", href: "/insure", hasMegaMenu: true },
        { name: "LEARN & PLAN", href: "/learn-plan", hasMegaMenu: true },
        { name: "PAYMENTS", href: "/payments", hasMegaMenu: true },
    ];

    //todo: remove mock functionality - replace with real menu data
    const megaMenuContent = {
        "BANK": {
            title: "BANK",
            leftColumns: [
                {
                    title: "Italian Accounts",
                    link: "#"
                },
                {
                    title: "Credit Cards",
                    link: "/credit-cards"
                },
                {
                    title: "Online & Mobile Banking",
                    link: "#"
                },
                {
                    title: "Why Bank with Italian?",
                    link: "/about-us"
                }
            ],
            rightSection: {
                title: "Get rewards on Us",
                description: "For a limited time, get a reward when you bank with us! Additional terms apply.",
                buttonText: "LEARN MORE",
                buttonLink: "/checking-accounts"
            }
        },
        "SAVE": {
            title: "SAVE",
            leftColumns: [
                {
                    title: "Italian High Yield Savings",
                    link: "/save#HighYielSavings"
                },
                {
                    title: "Italian Star Savings",
                    link: "/save#StarSavings"
                },
                {
                    title: "Italian Certificates",
                    link: "/save#Certificates"
                },
                {
                    title: "Italian Holiday Club & Auxiliary Savings",
                    link: "/save#HolidayClub"
                },
                {
                    title: "Italian Kids Club",
                    link: "/save#KidsClub"
                },
                {
                    title: "Italian Money Market",
                    link: "/save#MoneyMarket"
                }
            ],
            rightSection: {
                title: "Italian Certificates",
                description: "Build your savings with a low-risk, fixed rate.* Additional terms apply.",
                buttonText: "LEARN MORE",
                buttonLink: "#"
            }
        },
        "BORROW": {
            title: "BORROW",
            leftColumns: [
                {
                    title: "Italian Credit Cards",
                    link: "/borrow#creditcard"
                },
                {
                    title: "Italian Mortgage and Home Loan Center",
                    link: "/borrow#mortgage"
                },
                {
                    title: "Italian Personal Loans",
                    link: "/borrow#personal"
                },
                {
                    title: "Italian Auto & Motorcycle Loans",
                    link: "/borrow#auto"
                },
                {
                    title: "Italian Auto Refinance",
                    link: "/borrow#refinance"
                },
                {
                    title: "Italian Student Loans",
                    link: "/borrow#student"
                }
            ],
            rightSection: {
                title: "0% Intro APR* for 15 Months",
                description: "Pay no interest until 2026 on all purchases with a new credit card from Italian.",
                buttonText: "LEARN MROE",
                buttonLink: "/borrow#creditcard"
            }
        },
        "WEALTH & RETIRE": {
            title: "WEALTH & RETIRE",
            leftColumns: [
                {
                    title: "Our Investment Team",
                    link: "/invest#investmentTeam"
                },
                {
                    title: "Retirement Planning",
                    link: "/invest#retirement"
                },
                {
                    title: "Financial Planning",
                    link: "/invest#financial"
                },
                {
                    title: "Estate Planning & Wealth Transfer",
                    link: "/invest/#estate"
                },
                {
                    title: "IRA Rollover Assistance",
                    link: "/invest/#ira"
                },
                {
                    title: "Online Investing & Brokerage",
                    link: "/invest/#online"
                }
            ],
            rightSection: {
                title: "Partner With Our CFS Advisors",
                description: "Build strength for tomorrow. Schedule your complimentary consultation today.",
                buttonText: "GET STARTED",
                buttonLink: "/invest"
            }
        },
        "INSURE": {
            title: "INSURE",
            leftColumns: [
                {
                    title: "Medicare Insurance",
                    link: "/insure/#medicare"
                },
                {
                    title: "Auto Insurance",
                    link: "/insure/#auto"
                },
                {
                    title: "Homeowners and Renters Insurance",
                    link: "/insure/#homeowners"
                },
                {
                    title: "Life Insurance",
                    link: "/insure/#life"
                },
                {
                    title: "Accidental Death & Dismemberment Insurance",
                    link: "/insure/#accidental"
                },
                {
                    title: "Hospital Accident Insurance",
                    link: "/insure/#hospital"
                }
            ],
            rightSection: {
                title: "Let’s Navigate Medicare Together",
                description: "Italian offers dedicated Medicare Specialists to help you better prepare and understand your Medicare options.",
                buttonText: "LEARN MORE",
                buttonLink: "/insure"
            }
        },
        "LEARN & PLAN": {
            title: "LEARN & PLAN",
            leftColumns: [
                {
                    title: "Tax Checklist: 5 Things to Remember",
                    link: "/tax-checklist-5-things-to-remember"
                },
                {
                    title: "How to Start Saving for Summer Vacation",
                    link: "/how-to-save-for-summer-vacation"
                },
                {
                    title: "Simple Ways to Manage a Checking Account",
                    link: "/simple-ways-to-manage-a-checking-account"
                },
                {
                    title: "The Impact of Rising Rates and Inflation on Your Business",
                    link: "/the-impact-of-rising-rates-and-inflation-on-your-business"
                },
            ],
            rightSection: {
                title: "Looking For Ways to Grow Your Nest Egg?",
                description: "When it comes to saving wisely and investing for your future, Italian has plenty of great options to help you reach your goals.",
                buttonText: "LEARN MORE",
                buttonLink: "#"
            }
        },
        "PAYMENTS": {
            title: "PAYMENTS",
            leftColumns: [
                {
                    title: "Auto Loan Customer Center",
                    link: "/payments/#auto"
                },
                {
                    title: "One Time Payments",
                    link: "/payments/#one"
                },
                {
                    title: "Pay by Mail",
                    link: "/payments/#two"
                },
                {
                    title: "Pay at Branch",
                    link: "/payments/#three"
                },
            ],
            rightSection: {
                title: "Real-Time Account Alerts",
                description: "Manage your loan and stay current on statements, payments, and more with personalized alerts and reminders.",
                buttonText: "LOGIN NOW",
                buttonLink: "login"
            }
        }
    };

    return (
        <header className="sticky top-0 z-50">
            {/* Top blue bar */}
            <div className="bg-tertiary">
                <div className="container">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src="/assets/images/logo.png" className="w-auto h-4 md:h-6" alt="Italian National" />
                        </div>

                        {/* Desktop actions */}
                        <div className="hidden md:flex items-center gap-4 pt-2">
                            <button className="flex flex-col items-center text-white font-bold text-lg px-5 py-4 bg-primary uppercase gap-2" onClick={() => setLoginOpen(true)}>
                                Login
                                <span className="w-10 h-[2px] bg-accent" />
                            </button>
                            <button className="text-white text-lg font-bold uppercase px-5 py-4 transition" onClick={() => setRegisterOpen(true)}>Open Account</button>

                            <Lock className="w-4 h-4 opacity-90 text-white" />
                            <div className="flex items-center gap-1 font-bold opacity-90 text-white">
                                <img src="https://flagcdn.com/24x18/gb.png" className="w-5 h-4" />
                                <span>English</span>
                            </div>
                        </div>

                        {/* Mobile actions */}
                        <div className="md:hidden flex items-center gap-4 py-3">
                            <Lock className="w-4 h-4 opacity-90 text-white" />
                            <div className="flex items-center gap-1 font-bold opacity-90 text-white">
                                <img src="https://flagcdn.com/24x18/gb.png" className="w-5 h-4" />
                                <span className="text-sm">English</span>
                            </div>
                            <button
                                aria-label="Open menu"
                                className="text-white p-2"
                                onClick={() => setMobileOpen(!mobileOpen)}
                            >
                                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation (desktop only) */}
            <div className="text-white relative bg-primary">
                <div className="container">
                    <nav className={`hidden md:flex justify-between tracking-wide items-center h-14 ${activeMegaMenu ? 'border-b-2 border-white/10' : ''}`}>
                        {mainMenuItems.map((item, index) => (
                            <a
                                key={item.name}
                                href={item.href}
                                data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, "-").replace("&", "")}`}
                                className={`px-4 text-base font-semibold py-4 hover:opacity-100 transition-colors ${index === 0 ? 'font-bold' : ''
                                    } ${activeMegaMenu === item.name ? 'font-bold border-b-2 border-white' : ''}`}
                                onMouseEnter={() => item.hasMegaMenu ? setActiveMegaMenu(item.name) : setActiveMegaMenu(null)}
                                onMouseLeave={() => { setActiveMegaMenu(null) }}
                                onClick={() => console.log(`${item.name} clicked`)}
                            >
                                {item.name}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Mega Menu (desktop only) */}
                {activeMegaMenu && megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent] && (
                    <div
                        className="absolute top-full left-0 w-full text-white bg-[#155e7a] shadow-lg z-50 hidden md:block"
                        onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
                        onMouseLeave={() => setActiveMegaMenu(null)}
                    >
                        <div className="container py-8">
                            <div className="grid grid-cols-4 gap-8">
                                {/* Menu Title */}
                                <div className="col-span-1">
                                    <h2 className="text-2xl font-semibold text-white">
                                        {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].title}
                                    </h2>
                                </div>

                                {/* Menu Items - Two Columns */}
                                <div className="col-span-2 grid grid-cols-2 gap-5">
                                    {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].leftColumns.map((item, itemIndex) => (
                                        <Link
                                            key={itemIndex}
                                            href={item.link}
                                            className="flex items-center gap-4 py-2 cursor-pointer transition-colors"
                                            onClick={() => console.log(`${item} clicked`)}
                                        >
                                            <span className="text-lg font-medium">{item.title}</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>

                                    ))}
                                </div>

                                {/* Promotional Section */}
                                <div className="col-span-1">
                                    <div className="p-4">
                                        <h3 className="text-white text-lg font-semibold mb-2">
                                            {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].rightSection.title}
                                        </h3>
                                        <p className="text-base mb-4 leading-relaxed">
                                            {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].rightSection.description}
                                        </p>

                                        {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].rightSection.buttonLink == 'login' ? (
                                            <Button
                                                size="lg"
                                                className="bg-accent text-black hover:bg-white hover:text-black border border-transparent hover:border-accent rounded-full px-8 py-2.5"
                                                data-testid={`button-mega-menu-${activeMegaMenu.toLowerCase().replace(/\s+/g, "-")}`}
                                                onClick={() => setLoginOpen(true)}
                                            >
                                                {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].rightSection.buttonText}
                                            </Button>
                                        ) : (
                                            <Button
                                                size="lg"
                                                className="bg-accent text-black hover:bg-white hover:text-black border border-transparent hover:border-accent rounded-full px-8 py-2.5"
                                                data-testid={`button-mega-menu-${activeMegaMenu.toLowerCase().replace(/\s+/g, "-")}`}
                                                onClick={() => console.log(`${megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].rightSection.buttonText} clicked`)}
                                            >
                                                <Link href={megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].rightSection.buttonLink}>{megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].rightSection.buttonText}</Link>
                                            </Button>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile full-screen menu */}
            {
                mobileOpen && (
                    <div className="md:hidden fixed inset-0 top-[56px] z-[60] flex flex-col bg-primary">
                        {/* Blue header within the drawer */}
                        <div className="bg-tertiary text-white">
                            <div className="text-center font-semibold py-2">
                                Routing # 21084429
                            </div>
                        </div>

                        {/* Root menu list */}
                        {!mobileSubmenu && (
                            <div className="bg-primary text-white overflow-y-auto">
                                <div className="container py-2">
                                    {mainMenuItems.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            onClick={(e) => {
                                                if (item.hasMegaMenu) {
                                                    e.preventDefault();
                                                    setMobileSubmenu(item.name);
                                                } else {
                                                    setMobileOpen(false);
                                                }
                                            }}
                                            className="flex items-center justify-between py-4 px-2 border-b border-white/10"
                                        >
                                            <span className="text-sm font-semibold">{item.name}</span>
                                            {item.hasMegaMenu ? (
                                                <ChevronRight className="w-4 h-4 opacity-90" />
                                            ) : (
                                                <span className="w-4 h-4" />
                                            )}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Submenu view for items with mega menu */}
                        {mobileSubmenu && (
                            <div className="flex-1 flex flex-col bg-white">
                                {/* Teal header with back and title */}
                                <div className="bg-[#22c3c8] text-primary">
                                    <div className="container">
                                        <div className="h-12 flex items-center gap-3">
                                            <button
                                                aria-label="Back to main menu"
                                                className="p-2 -ml-2 text-primary"
                                                onClick={() => setMobileSubmenu(null)}
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <span className="font-semibold tracking-wide">{mobileSubmenu}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Submenu items list */}
                                <div className="flex-1 overflow-y-auto">
                                    <div className="container">
                                        <div className="divide-y divide-primary/10">
                                            {(megaMenuContent[mobileSubmenu as keyof typeof megaMenuContent]?.leftColumns || [])
                                                .flat()
                                                .map((item, idx) => (
                                                    <a
                                                        key={idx}
                                                        href="#"
                                                        className="block py-5 text-primary font-semibold"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setMobileOpen(false);
                                                            setMobileSubmenu(null);
                                                        }}
                                                    >
                                                        {item.title}
                                                    </a>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }

            {/* Login Dialog (match supplied design) */}
            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <DialogContent className="max-w-[40rem] p-0 overflow-hidden sm:rounded-xl">
                    <div className="p-8 sm:p-10">
                        <div className="flex items-center justify-center">
                            <DialogHeader className="w-full">
                                <DialogTitle className="flex items-center justify-center gap-3 text-2xl md:text-3xl leading-none font-semibold text-tertiary">
                                    <Lock className="w-5 h-5 md:w-6 md:h-6 text-black" />
                                    Log In
                                </DialogTitle>
                            </DialogHeader>
                        </div>

                        <form
                            className="mt-4 space-y-4"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setLoginError(null);
                                setLoggingIn(true);
                                try {
                                    const res = await apiRequest("POST", "/api/auth/login", { username, password });
                                    const json = await res.json();
                                    if (json && json.requireOtp) {
                                        setOtpPhase(true);
                                    } else {
                                        const meRes = await apiRequest("GET", "/api/auth/me");
                                        const me = await meRes.json();
                                        queryClient.setQueryData(["/api/auth/me"], me);
                                        setLoginOpen(false);
                                        setUsername("");
                                        setPassword("");
                                        setLocation("/dashboard");
                                    }
                                } catch (err: any) {
                                    setLoginError(err.message || "Login failed");
                                } finally {
                                    setLoggingIn(false);
                                }
                            }}
                        >
                            {!otpPhase && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Account ID</Label>
                                        <Input
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            className="bg-[#f1f3f5] h-13"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="bg-[#f1f3f5] h-13"
                                        />
                                    </div>
                                </div>
                            )}

                            {otpPhase && (
                                <div className="space-y-4">
                                    <div className="text-sm text-tertiary">
                                        Two‑factor verification required. Contact your admin for the OTP code.
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="otp">One‑Time Passcode</Label>
                                        <Input
                                            id="otp"
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value)}
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={6}
                                            className="bg-[#f1f3f5] h-13 tracking-widest"
                                        />
                                    </div>
                                </div>
                            )}
                            {loginError && (
                                <div className="text-red-600 text-sm">{loginError}</div>
                            )}
                            <div className="pt-4 text-center">
                                {!otpPhase ? (
                                    <Button
                                        type="submit"
                                        disabled={loggingIn}
                                        variant="gold"
                                        size="lg"
                                        className="rounded-full px-12"
                                    >
                                        {loggingIn ? "Signing in..." : "LOGIN"}
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        disabled={loggingIn || !otpCode}
                                        variant="gold"
                                        size="lg"
                                        className="rounded-full px-12"
                                        onClick={async () => {
                                            setLoginError(null);
                                            setLoggingIn(true);
                                            try {
                                                const res = await apiRequest("POST", "/api/auth/otp/verify", { username, code: otpCode });
                                                const me = await res.json();
                                                queryClient.setQueryData(["/api/auth/me"], me);
                                                setLoginOpen(false);
                                                setUsername("");
                                                setPassword("");
                                                setOtpCode("");
                                                setOtpPhase(false);
                                                setLocation("/dashboard");
                                            } catch (err: any) {
                                                setLoginError(err.message || "OTP verification failed");
                                            } finally {
                                                setLoggingIn(false);
                                            }
                                        }}
                                    >
                                        {loggingIn ? "Verifying..." : "VERIFY OTP"}
                                    </Button>
                                )}
                            </div>
                            <div className="pt-4 text-center font-semibold text-sm text-tertiary">
                                Forgot Password? - Contact Support
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Register Dialog (match supplied design) */}
            <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                <DialogContent className="max-w-[40rem] p-0 overflow-hidden sm:rounded-xl">
                    <div className="p-8 sm:p-10">
                        <div className="flex items-center justify-center">
                            <DialogHeader className="w-full">
                                <DialogTitle className="flex items-center justify-center gap-3 text-2xl md:text-3xl leading-none font-semibold text-tertiary">
                                    <Lock className="w-5 h-5 md:w-6 md:h-6 text-black" />
                                    Open Account
                                </DialogTitle>
                            </DialogHeader>
                        </div>

                        <form
                            className="mt-4 space-y-4"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setRegisterError(null);
                                setRegistering(true);
                                try {
                                    const params = new URLSearchParams({
                                        name,
                                        email,
                                    }).toString();
                                    setLocation(`/open_account?${params}`);
                                } catch (err: any) {
                                    setRegisterError(err.message || "Register failed");
                                } finally {
                                    setRegistering(false);
                                }
                            }}
                        >
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="bg-[#f1f3f5] h-13"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="bg-[#f1f3f5] h-13"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            {registerError && (
                                <div className="text-red-600 text-sm">{registerError}</div>
                            )}
                            <div className="pt-4 text-center">
                                <Button
                                    type="submit"
                                    disabled={registering}
                                    variant="gold"
                                    size="lg"
                                    className="rounded-full px-12 uppercase"
                                >
                                    {registering ? "Signing in..." : "Continue"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </header >
    );
}