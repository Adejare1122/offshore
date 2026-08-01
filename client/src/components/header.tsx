import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
    const [location, navigate] = useLocation();
    const [unread, setUnread] = useState<number>(0);

    useEffect(() => {
        let timer: any;
        const fetchCount = async () => {
            try {
                const res = await fetch('/api/admin/notifications/unread-count');
                if (res.ok) {
                    const data = await res.json();
                    setUnread(Number(data?.count || 0));
                }
            } catch { }
        };
        if (location.startsWith('/admin')) {
            fetchCount();
            timer = setInterval(fetchCount, 15000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [location]);

    const handleLogout = async () => {
        let target = "/";
        try {
            const meRes = await fetch("/api/auth/me");
            if (meRes.ok) {
                const me: any = await meRes.json();
                if (me?.role === 'ADMIN') target = "/admin/login";
            }
        } catch { }
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch { }
        navigate(target);
    };

    return (
        <header className="bg-primary sticky top-0 z-40">
            <div className="px-4 py-3 mx-auto flex items-center justify-between">
                {/* Language Selector */}
                <div className="flex items-center text-white">
                    <img
                        src="/assets/images/gb.png"
                        alt="English flag"
                        className="w-6 h-4 mr-2 rounded-sm shadow"
                    />
                    <span className="text-sm font-medium">English</span>
                </div>

                {/* Centered Logo */}
                <div className="flex-1 flex justify-center">
                    <Link href="/dashboard" className="bg-white shadow-sm">
                        <img src="/assets/images/favicon.png" alt="Logo" className="w-8 h-6" />
                    </Link>
                </div>

                {/* Notifications and Profile */}
                <div className="flex items-center space-x-3">
                    {location.startsWith('/admin') ? (
                        <Link href="/admin/notifications" className="relative inline-flex">
                            <BellIcon className="text-white w-5 h-5" />
                            {unread > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-none rounded-full h-4 min-w-4 px-1 flex items-center justify-center">{unread > 9 ? '9+' : unread}</span>
                            )}
                        </Link>
                    ) : (
                        <Link href="/dashboard/notifications" className="relative inline-flex">
                            <BellIcon className="text-white w-5 h-5" />
                        </Link>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <UserIcon className="text-primary w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[160px]">
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="w-full text-left">
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}