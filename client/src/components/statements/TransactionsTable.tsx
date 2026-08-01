// components/statements/TransactionsTable.jsx
import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Transaction } from '@shared/schema';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { DotIcon } from 'lucide-react';

const TransactionsTable = ({ transactions, isLoading }: { transactions: Transaction[], isLoading: boolean }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Transaction | null>(null);
    const getTransactionIcon = (type: string) => {
        const icons = {
            internal_transfer: '🔄',
            local_transfer: '🏦',
            wire_transfer: '🌍',
            incoming_transfer: '🌍',
            bill_payment: '🧾',
            airtime_topup: '📱',
            data_topup: '📶',
            crypto_buy: '₿',
            crypto_sell: '₿',
            deposit: '📥',
            fee: '💸'
        };
        return icons[type as keyof typeof icons] || '💰';
    };

    const getAmountColor = (amount: number, type: string) => {
        // if (type === 'crypto_buy' || type === 'withdrawal' || amount < 0) {
        //     return 'text-red-600';
        // }
        return 'text-primary font-semibold';
    };

    const maskAccountNumber = (accountNumber: string) => {
        return `****${accountNumber.slice(-4)}`;
    }

    const getStatusBadge = (status: string) => {
        const statusStyles = {
            completed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            failed: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    const formatAmount = (amount: number, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(Math.abs(amount));
    };

    const receiptHtml = useMemo(() => {
        if (!selected) return '';
        const meta: any = selected.metadata || {};
        const rows = [
            { label: 'Reference', value: selected.reference || '-' },
            { label: 'Type', value: String(selected.transactionType).replace(/_/g, ' ') },
            { label: 'Status', value: String(selected.status).toUpperCase() },
            { label: 'Amount', value: formatAmount(Number(selected.amount), 'USD') },
            { label: 'Balance After', value: formatAmount(Number(selected.balance || 0), 'USD') },
            { label: 'Date', value: format(new Date(selected.createdAt), 'PPPp') },
            { label: 'Completed', value: selected.completedAt ? format(new Date(selected.completedAt), 'PPPp') : '-' },
            { label: 'From Account', value: selected.fromAccountId ? `#${selected.fromAccountId}` : '-' },
            { label: 'To Account', value: selected.toAccountId ? `#${selected.toAccountId}` : (meta.beneficiary_account || '-') },
            { label: 'Beneficiary', value: meta.beneficiary_name || '-' },
            { label: 'Bank', value: meta.beneficiary_bank || '-' },
            { label: 'Routing/SWIFT', value: meta.routing_number || meta.swift_code || '-' },
            { label: 'Description', value: selected.description || '-' },
        ];
        const style = `
			<style>
				:root{--ink:#0f172a;--muted:#64748b;--line:#e2e8f0;--brand:#0ea5e9;--badge:#eef2ff;--badge-ink:#3730a3}
				*{box-sizing:border-box}
				body{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:var(--ink);background:#f8fafc}
				/* Screen (preview) styles */
				.wrap{max-width:720px;margin:32px auto;padding:28px;border:1px solid var(--line);border-radius:16px;background:#fff;box-shadow:0 10px 25px rgba(2,6,23,.06)}
				.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
				.brand{display:flex;align-items:center;gap:12px}
				.brand img{width:44px;height:44px;border-radius:8px;box-shadow:0 2px 10px rgba(2,6,23,.08)}
				.brand h1{font-size:20px;margin:0;letter-spacing:.2px}
				.muted{color:var(--muted);font-size:12px}
				.section{margin-top:16px;padding-top:6px;border-top:1px dashed var(--line)}
				.row{display:flex;flex-direction:column;gap:4px;padding:10px 0;border-bottom:1px solid #f1f5f9}
				.label{font-size:11px;letter-spacing:.4px;color:var(--muted);text-transform:uppercase}
				.value{font-size:15px;font-weight:600}
				.badge{padding:4px 12px;border-radius:999px;background:var(--badge);color:var(--badge-ink);font-weight:700;font-size:12px}
				.footer{margin-top:18px;display:flex;justify-content:space-between;align-items:center}
				.note{font-size:12px;color:var(--muted)}

				/* Print: narrow receipt size (80mm roll) */
				@page{ size: 80mm auto; margin: 5mm 4mm; }
				@media print{
					body{ background:#fff; }
					.wrap{ width:72mm; max-width:none; margin:0; padding:0 2mm; border:none; box-shadow:none; border-radius:0; }
					.head{ margin-bottom:8px; }
					.brand img{ width:28px; height:28px; border-radius:6px; box-shadow:none; }
					.brand h1{ font-size:16px; }
					.section{ margin-top:8px; padding-top:4px; }
					.row{ padding:6px 0; border-bottom:1px solid #eee; }
					.label{ font-size:10px; }
					.value{ font-size:13px; }
					.footer{ display:none; }
				}
			</style>
		`;
        const logo = '/assets/images/logo.png';
        return `<!DOCTYPE html><html><head><meta charset="utf-8"/>${style}</head><body>
			<div class="wrap">
				<div class="head">
					<div class="brand">
						<img src="${logo}" alt="logo"/>
						<div>
							<h1>Transaction Receipt</h1>
							<div class="muted">This is an official record of your transaction</div>
						</div>
					</div>
					<div class="badge">${String(selected.status).toUpperCase()}</div>
				</div>
				<div class="section">
					${rows.map(r => `
						<div class="row">
							<div class="label">${r.label}</div>
							<div class="value">${String(r.value)}</div>
						</div>
					`).join('')}
				</div>
				<div class="footer">
					<div class="note">If you have questions about this receipt, contact support.</div>
					<div class="muted">Generated ${format(new Date(), 'PPPp')}</div>
				</div>
			</div>
			<script>window.onload=()=>{window.print();}</script>
		</body></html>`;
    }, [selected]);

    const handleOpenReceipt = (tx: Transaction) => {
        setSelected(tx);
        setOpen(true);
    };

    const handlePrint = () => {
        if (!receiptHtml) return;
        const w = window.open('', '_blank');
        if (!w) return;
        w.document.open();
        w.document.write(receiptHtml);
        w.document.close();
        setTimeout(() => {
            try {
                w.focus();
                w.print();
            } catch (e) {
                // ignore
            }
        }, 150);
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex space-x-4">
                            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                    Try adjusting your filters or select a different date range to see more transactions.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr className='uppercase'>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Transaction
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Receipt
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-700 text-lg">
                                            {getTransactionIcon(transaction.transactionType)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="inline-flex gap-2 text-sm font-medium text-gray-900 capitalize">
                                                {transaction.transactionType.replace(/_/g, ' ')}

                                                {getStatusBadge(transaction.status)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {format(new Date(transaction.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {/* <div className="text-sm text-gray-900">{transaction.description}</div> */}
                                    <div className="text-sm text-gray-500">
                                        Ref: {transaction.reference}
                                    </div>
                                    {transaction.metadata && (
                                        <div className="inline-flex gap-1 text-xs text-gray-400 mt-1">
                                            {transaction.metadata.sender_account && (
                                                <>
                                                    From:
                                                    {transaction.metadata.sender_name}
                                                    /
                                                    {transaction.metadata.sender_bank}
                                                    /
                                                    {maskAccountNumber((transaction.metadata as any).sender_account.toString())}
                                                </>
                                            )}

                                            {!transaction.metadata.sender_account && (
                                                <>
                                                    To: {transaction.metadata && (transaction.metadata as any).beneficiary_name as string}

                                                    {transaction.metadata.toAccount && (
                                                        <>
                                                            /
                                                            {maskAccountNumber((transaction.metadata as any).toAccount.number.toString())}
                                                        </>
                                                    )}

                                                    {!transaction.toAccountId && (
                                                        <>
                                                            {transaction.metadata?.beneficiary_bank && (
                                                                <>
                                                                    /
                                                                    {transaction.metadata?.beneficiary_bank}
                                                                </>
                                                            )}
                                                            {transaction.metadata?.beneficiary_account && (
                                                                <>
                                                                    /
                                                                    {maskAccountNumber(transaction.metadata?.beneficiary_account as string)}
                                                                </>
                                                            )}

                                                        </>
                                                    )}
                                                </>
                                            )}





                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className={`text-base font-medium ${getAmountColor(Number(transaction.amount), transaction.transactionType)}`}>
                                        {formatAmount(Number(transaction.amount), 'USD')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Button size="sm" onClick={() => handleOpenReceipt(transaction)}>Receipt</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Transaction Receipt</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        {selected && (
                            <div className="text-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src="/assets/images/favicon.png" alt="logo" className="w-8 h-8 rounded-md shadow" />
                                        <div>
                                            <div className="font-semibold">Transaction Receipt</div>
                                            <div className="text-xs text-gray-500">{selected.transactionType.replace(/_/g, ' ')}</div>
                                        </div>
                                    </div>
                                    <div>
                                        {getStatusBadge(selected.status as any)}
                                    </div>
                                </div>
                                <div className="text-primary font-semibold my-2 text-center">Ref: {selected.reference || '-'}</div>
                                <div className="mt-3 border-t border-gray-100 divide-y divide-gray-100 rounded-md bg-white">
                                    {[
                                        { label: 'Amount', value: formatAmount(Number(selected.amount)) },
                                        { label: 'Date', value: format(new Date(selected.createdAt), 'PPPp') },
                                        {
                                            label: 'From Account', value: (
                                                selected.metadata?.fromAccount ? (
                                                    <>
                                                        <span className='uppercase'> {selected.metadata?.fromAccount?.type}</span>
                                                        {maskAccountNumber(selected.metadata?.fromAccount?.number as string)}
                                                    </>
                                                ) : (selected.metadata?.sender_bank ? (
                                                    <>
                                                        <span className='uppercase'> {selected.metadata?.sender_name} </span>
                                                        <span className='uppercase'> {selected.metadata?.sender_bank}</span>
                                                        {maskAccountNumber(selected.metadata?.sender_account as string)}
                                                    </>
                                                ) :
                                                    ''
                                                )
                                            )
                                        },
                                        {
                                            label: 'To', value: (
                                                selected.metadata?.toAccount ? (
                                                    <>
                                                        <span className='uppercase'> {selected.metadata?.toAccount?.type}</span>
                                                        {maskAccountNumber(selected.metadata?.toAccount?.number as string)}
                                                    </>
                                                ) : (
                                                    <>
                                                        {selected.transactionType != 'fee' ? (
                                                            <>
                                                                {selected.metadata?.beneficiary_name}
                                                                /
                                                                {selected.metadata?.beneficiary_bank}
                                                                /
                                                                {maskAccountNumber(selected.metadata?.beneficiary_account)}
                                                            </>
                                                        ) : (' - ')}

                                                    </>
                                                )
                                            )
                                        },
                                        { label: 'Description', value: selected.description || '-' },
                                    ].map((r, idx) => (
                                        r.value && (
                                            <div key={idx} className="p-3">
                                                <div className="text-[11px] text-gray-500 uppercase tracking-wide">{r.label}</div>
                                                <div className="text-[15px] font-semibold mt-0.5">{r.value as any}</div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
                        <Button onClick={handlePrint}>Print / Download</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default TransactionsTable;