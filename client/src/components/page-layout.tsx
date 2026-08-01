import { useQuery } from "@tanstack/react-query";
import { Account, User, CreditCard } from "@shared/schema";
import { AccountCarousel } from "@/components/account-carousel";
import { BellIcon, UserIcon, SettingsIcon, HeadphonesIcon, LogOutIcon, HomeIcon } from "lucide-react";
import { useLocation } from "wouter";
import { getQueryFn } from "@/lib/queryClient";
import { useEffect, ReactNode } from "react";
import Header from "@/components/header";
import { CreditCard as CreditCardComponent } from "@/components/credit-card";
import { CreditCardNew } from "@/components/credit-card-new";
import { TipsSection } from "@/components/tips-section";

interface PageLayoutProps {
    children: ReactNode;
    showAccountCarousel?: boolean;
}

export default function PageLayout({ children, showAccountCarousel = true }: PageLayoutProps) {
    const [location, setLocation] = useLocation();

    const { data: me, isLoading: meLoading } = useQuery<User | null>({
        queryKey: ["/api/auth/me"],
        queryFn: getQueryFn({ on401: "returnNull" }),
    });

    useEffect(() => {
        if (!meLoading && me === null) {
            setLocation("/");
        }
    }, [meLoading, me, setLocation]);

    const userId = me?.id;

    const { data: accounts = [], isLoading: accountsLoading } = useQuery<Account[]>({
        queryKey: ["/api/accounts", String(userId ?? "")],
        enabled: !!userId,
    });

    const { data: creditCards = [] } = useQuery<CreditCard[]>({
        queryKey: ["/api/credit-cards", String(userId ?? "")],
        enabled: !!userId,
    });

    const handleNavigation = (section: string) => {
        switch (section) {
            case "settings":
                setLocation("/profile");
                break;
            case "notifications":
                setLocation("/notifications");
                break;
            case "support":
                setLocation("/support");
                break;
            case "home":
                setLocation("/dashboard");
                break;
            case "logout":
                // In a real app, this would handle logout
                console.log("Logging out...");
                break;
            default:
                console.log(`Navigating to: ${section}`);
        }
    };

    if (meLoading || accountsLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <Header />

            {/* Account Carousel */}
            {showAccountCarousel && <AccountCarousel accounts={accounts} />}

            {/* Main Content */}
            <main className="bg-white -mt-4 rounded-t-lg relative font-sans z-10">
                <div className="max-w-8xl mx-auto px-4 md:px-[5%] pt-8 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Quick Actions and Services */}
                        <div className={`space-y-8 ${location.startsWith('/admin') ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
                            {children}
                        </div>

                        {/* Right Sidebar */}
                        {!location.startsWith('/admin') && (
                            <>
                                <div className="lg:col-span-1 space-y-6">
                                    <CreditCardComponent creditCard={creditCards[0]} />
                                    <TipsSection />
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </main >

            {/* Footer Navigation */}
            < footer className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-40" >
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex justify-center space-x-8">
                        <button
                            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-banking-primary transition-colors"
                            onClick={() => handleNavigation('settings')}
                        >
                            <SettingsIcon className="w-5 h-5" />
                            <span className="text-xs font-medium">Settings</span>
                        </button>

                        <button
                            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-banking-primary transition-colors"
                            onClick={() => handleNavigation('notifications')}
                        >
                            <BellIcon className="w-5 h-5" />
                            <span className="text-xs font-medium">Notifications</span>
                        </button>

                        <button
                            className="flex flex-col items-center space-y-1 text-banking-primary"
                            onClick={() => handleNavigation('home')}
                        >
                            <HomeIcon className="w-5 h-5" />
                            <span className="text-xs font-medium">Home</span>
                        </button>

                        <button
                            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-banking-primary transition-colors"
                            onClick={() => handleNavigation('support')}
                        >
                            <HeadphonesIcon className="w-5 h-5" />
                            <span className="text-xs font-medium">Support</span>
                        </button>

                        <button
                            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-banking-primary transition-colors"
                            onClick={() => handleNavigation('logout')}
                        >
                            <LogOutIcon className="w-5 h-5" />
                            <span className="text-xs font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </footer >
        </div >
    );
}
