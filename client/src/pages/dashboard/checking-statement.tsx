import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/page-layout";
import { Account, Transaction, User } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import TransactionsTable from "@/components/statements/TransactionsTable";

export default function CheckingStatement() {
    const { data: me } = useQuery<User | null>({
        queryKey: ["/api/auth/me"],
        queryFn: getQueryFn({ on401: "returnNull" }),
    });

    const userId = me?.id;

    const { data: accounts = [], isLoading: accountsLoading } = useQuery<Account[]>({
        queryKey: ["/api/accounts", String(userId ?? "")],
        enabled: !!userId,
    });

    const checkingAccounts = useMemo(
        () => accounts.filter((a) => (a.accountType || "").toUpperCase().includes("CHECK")),
        [accounts]
    );

    const primaryChecking = checkingAccounts[0];

    const { data: transactions = [], isLoading: txLoading } = useQuery<Transaction[]>({
        queryKey: primaryChecking ? ["/api/transactions", String(primaryChecking.id)] : ["/api/transactions", "none"],
        enabled: !!primaryChecking,
        queryFn: async () => {
            const res = await fetch(`/api/transactions/${primaryChecking!.id}`, { credentials: "include" });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
    });

    // Datatable UI state
    const [pageSize, setPageSize] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const [sortKey, setSortKey] = useState<"date" | "type" | "amount">("date");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const processed = useMemo(() => {
        const list = (transactions || []).map((t) => t);
        const filtered = search
            ? list.filter((t) => {
                const hay = `${t.createdAt} ${t.description ?? ""} ${t.transactionType} ${t.amount}`.toLowerCase();
                return hay.includes(search.toLowerCase());
            })
            : list;
        return filtered;
    }, [transactions, search, sortKey, sortDir]);

    const total = processed.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * pageSize;
    const pageItems = processed.slice(start, start + pageSize);

    function toggleSort(key: "date" | "type" | "amount") {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    }

    if (accountsLoading || (primaryChecking && txLoading)) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary mx-auto mb-4" />
                        <p className="text-gray-600">Loading statements...</p>
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-primary text-white p-4">
                    <h1 className="text-xl font-semibold text-white">Checking Account Statement</h1>
                </div>

                {/* Datatable Controls */}
                <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span>Show</span>
                            <select
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none"
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPage(1);
                                }}
                            >
                                {[10, 25, 50, 100].map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                            <span>entries</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Search:</label>
                            <input
                                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder=""
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <TransactionsTable
                    transactions={pageItems}
                    isLoading={false}
                />

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600">
                    <div>
                        Showing {total === 0 ? 0 : start + 1} to {Math.min(start + pageSize, total)} of {total} entries
                    </div>
                    <div className="inline-flex items-center gap-1">
                        <button
                            className="px-3 py-1.5 border border-gray-300 rounded-md disabled:opacity-50"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >Previous</button>
                        <button className="px-3 py-1.5 bg-primary text-white rounded-md">{currentPage}</button>
                        <button
                            className="px-3 py-1.5 border border-gray-300 rounded-md disabled:opacity-50"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >Next</button>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}


