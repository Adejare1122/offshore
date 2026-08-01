import PageLayout from "@/components/page-layout";
import AdminGuard from "@/components/admin-guard";
import AdminNav from "@/components/admin-nav";

export default function AdminHome() {
    return (
        <AdminGuard>
            <PageLayout showAccountCarousel={false}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <aside className="md:col-span-1">
                        <div className="border rounded-md p-3">
                            <AdminNav />
                        </div>
                    </aside>
                    <section className="md:col-span-3 space-y-4">
                        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600">Use the navigation to manage users, accounts, transfers, bills, and transactions.</p>
                    </section>
                </div>
            </PageLayout>
        </AdminGuard>
    );
}


