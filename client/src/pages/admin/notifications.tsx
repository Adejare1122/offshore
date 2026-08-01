import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/page-layout";
import AdminGuard from "@/components/admin-guard";
import AdminNav from "@/components/admin-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Bell } from "lucide-react";

export default function AdminNotifications() {
    const { data: notifications = [], isLoading, refetch } = useQuery({
        queryKey: ["/api/admin/notifications"],
        queryFn: async () => {
            const res = await fetch("/api/admin/notifications");
            if (!res.ok) throw new Error("Failed to load notifications");
            return res.json();
        },
    });

    return (
        <AdminGuard>
            <PageLayout showAccountCarousel={false}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <aside className="md:col-span-1">
                        <div className="border rounded-md p-3">
                            <AdminNav />
                        </div>
                    </aside>

                    <section className="md:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-semibold flex items-center gap-2"><Bell className="w-5 h-5" /> Notifications</h1>
                                <p className="text-gray-600">All notifications sent to your admin account</p>
                            </div>
                            <button className="inline-flex items-center gap-2 text-sm px-3 py-2 border rounded" onClick={() => refetch()}>
                                <RefreshCw className="w-4 h-4" /> Refresh
                            </button>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="py-8 text-center text-gray-500">Loading...</div>
                                ) : notifications.length === 0 ? (
                                    <div className="py-8 text-center text-gray-500">No notifications</div>
                                ) : (
                                    <div className="space-y-3">
                                        {notifications.slice().reverse().map((n: any) => (
                                            <div key={n.id} className="border rounded p-3">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="font-medium flex items-center gap-2">
                                                        <span>{n.title}</span>
                                                        <Badge variant={n.isRead === 'true' ? 'outline' : 'default'}>
                                                            {n.type}{n.isRead === 'true' ? ' • Read' : ''}
                                                        </Badge>
                                                    </div>
                                                    {n.isRead !== 'true' && (
                                                        <button
                                                            className="text-sm px-2 py-1 border rounded hover:bg-gray-50"
                                                            onClick={async () => {
                                                                const res = await fetch(`/api/admin/notifications/${n.id}/read`, { method: 'PATCH' });
                                                                if (res.ok) refetch();
                                                            }}
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{n.message}</div>
                                                <div className="text-xs text-gray-500 mt-2">{new Date(n.createdAt).toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </PageLayout>
        </AdminGuard>
    );
}
