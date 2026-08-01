import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/page-layout";
import { Account, Transaction, User } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import TransactionsTable from "@/components/statements/TransactionsTable";

function formatCurrency(amount: string) {
    const num = parseFloat(amount || "0");
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num);
}

export default function SavingsStatement() {
    const { data: me } = useQuery<User | null>({
        queryKey: ["/api/auth/me"],
        queryFn: getQueryFn({ on401: "returnNull" }),
    });

    const userId = me?.id;

    const { data: accounts = [], isLoading: accountsLoading } = useQuery<Account[]>({
        queryKey: ["/api/accounts", String(userId ?? "")],
        enabled: !!userId,
    });

    const savingsAccounts = useMemo(
        () => accounts.filter((a) => (a.accountType || "").toUpperCase().includes("SAVING")),
        [accounts]
    );

    // Fetch transactions for the first savings account (or merge across all)
    const primarySavings = savingsAccounts[0];

    const { data: transactions = [], isLoading: txLoading } = useQuery<Transaction[]>({
        queryKey: primarySavings ? ["/api/transactions", String(primarySavings.id)] : ["/api/transactions", "none"],
        enabled: !!primarySavings,
        queryFn: async () => {
            const res = await fetch(`/api/transactions/${primarySavings!.id}`, { credentials: "include" });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
    });

    // Datatable UI state (must be declared before any early return)
    const [pageSize, setPageSize] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const [sortKey, setSortKey] = useState<"date" | "type" | "amount">("date");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const processed = useMemo(() => {
        const list = (transactions || []).map((t) => t);
        const filtered = search
            ? list.filter((t) => {
                const hay = `${t.completedAt} ${t.description ?? ""} ${t.transactionType} ${t.amount}`.toLowerCase();
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

    if (accountsLoading || (primarySavings && txLoading)) {
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
                    <h1 className="text-xl font-semibold text-white">Savings Account Statement</h1>
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

                    {/* Table */}
                    {/* <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-700">
                                    <th className="text-left px-4 py-3 font-semibold">
                                        <button className="inline-flex items-center gap-2" onClick={() => toggleSort("date")}>Date
                                            <span className="text-gray-400">{sortKey === "date" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
                                        </button>
                                    </th>
                                    <th className="text-left px-4 py-3 font-semibold">
                                        <button className="inline-flex items-center gap-2" onClick={() => toggleSort("type")}>Type
                                            <span className="text-gray-400">{sortKey === "type" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
                                        </button>
                                    </th>
                                    <th className="text-right px-4 py-3 font-semibold">
                                        <button className="inline-flex items-center gap-2" onClick={() => toggleSort("amount")}>Amount
                                            <span className="text-gray-400">{sortKey === "amount" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
                                        </button>
                                    </th>
                                    <th className="text-left px-4 py-3 font-semibold">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pageItems.map((t) => (
                                    <tr key={t.id}>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-700">{t.date}</td>
                                        <td className="px-4 py-3">
                                            <span className={"font-medium " + (t.type === "DEBIT" ? "text-red-600" : "text-green-600")}>{t.type === "DEBIT" ? "Debit" : "Credit"}</span>
                                        </td>
                                        <td className={"px-4 py-3 text-right font-semibold " + (t.type === "DEBIT" ? "text-red-600" : "text-emerald-600")}>{formatCurrency(String(t.amount))}</td>
                                        <td className="px-4 py-3">
                                            <button className="px-3 py-1.5 bg-teal-700 text-white rounded-full text-xs tracking-wide">RECEIPT</button>
                                        </td>
                                    </tr>
                                ))}
                                {!primarySavings && (
                                    <tr>
                                        <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>No savings account found.</td>
                                    </tr>
                                )}
                                {primarySavings && pageItems.length === 0 && (
                                    <tr>
                                        <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>No transactions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div> */}

                    {/* Footer */}
                    {/* <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600">
                        <div>
                            Showing {total === 0 ? 0 : start + 1} to {Math.min(start + pageSize, total)} of {total} entries
                        </div>
                        <div className="inline-flex items-center gap-1">
                            <button
                                className="px-3 py-1.5 border border-gray-300 rounded-md disabled:opacity-50"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >Previous</button>
                            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md">{currentPage}</button>
                            <button
                                className="px-3 py-1.5 border border-gray-300 rounded-md disabled:opacity-50"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >Next</button>
                        </div>
                    </div> */}
                </div>


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


