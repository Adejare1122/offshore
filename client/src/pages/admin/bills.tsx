import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/page-layout";
import AdminGuard from "@/components/admin-guard";
import AdminNav from "@/components/admin-nav";

export default function AdminBills() {
    const { data: bills = [] } = useQuery<any[]>({ queryKey: ["/api/admin/bills"] });
    return (
        <AdminGuard>
            <PageLayout showAccountCarousel={false}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <aside className="md:col-span-1"><div className="border rounded-md p-3"><AdminNav /></div></aside>
                    <section className="md:col-span-3">
                        <h1 className="text-2xl font-semibold mb-4">Manage Bills</h1>
                        <div className="space-y-3">
                            {bills.map(b => (
                                <div key={b.id} className="border rounded-md p-3">
                                    <div className="flex justify-between text-sm">
                                        <span>{b.billerName}</span>
                                        <span>Status: {b.status}</span>
                                    </div>
                                    <div className="text-gray-600 text-sm">Amount: {b.amount} • Due: {new Date(b.dueDate).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </PageLayout>
        </AdminGuard>
    );
}


