import { Link, useLocation } from "wouter";

function NavLink({ href, label }: { href: string; label: string }) {
    const [location] = useLocation();
    const active = location === href;
    return (
        <Link href={href}>
            <a className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${active ? "bg-banking-primary text-white" : "text-gray-700 hover:bg-gray-100"
                }`}>
                {label}
            </a>
        </Link>
    );
}

export default function AdminNav() {
    return (
        <nav className="space-y-2">
            <NavLink href="/admin" label="Overview" />
            <NavLink href="/admin/users" label="Users" />
            <NavLink href="/admin/bills" label="Bills" />
            <NavLink href="/admin/notifications" label="Notifications" />
            <NavLink href="/admin/statements" label="Statements" />
        </nav>
    );
}


