// components/statements/StatementSummary.jsx
import React from 'react';
import { Transaction } from '@shared/schema';

const StatementSummary = ({ transactions, filters }: { transactions: Transaction[], filters: any }) => {
    const calculateSummary = () => {
        if (!transactions) return null;

        const summary = {
            totalIncome: 0,
            totalExpenses: 0,
            netFlow: 0,
            transactionCount: transactions.length,
            largestTransaction: 0
        };

        transactions.forEach(transaction => {
            const amount = parseFloat(transaction.amount);

            if (amount > 0) {
                summary.totalIncome += amount;
            } else {
                summary.totalExpenses += Math.abs(amount);
            }

            if (Math.abs(amount) > Math.abs(summary.largestTransaction)) {
                summary.largestTransaction = amount;
            }
        });

        summary.netFlow = summary.totalIncome - summary.totalExpenses;

        return summary;
    };

    const summary = calculateSummary();

    if (!summary) {
        return null;
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const StatCard = ({ title, value, subtitle, color = 'gray' }: { title: string, value: string, subtitle: string, color: string }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="mt-1">
                <div className={`text-2xl font-semibold ${color}`}>{value}</div>
                {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
            </dd>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Total Income"
                value={formatCurrency(summary.totalIncome)}
                subtitle="All incoming funds"
                color="text-green-600"
            />
            <StatCard
                title="Total Expenses"
                value={formatCurrency(summary.totalExpenses)}
                subtitle="All outgoing funds"
                color="text-red-600"
            />
            <StatCard
                title="Net Flow"
                value={formatCurrency(summary.netFlow)}
                subtitle={summary.netFlow >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
                color={summary.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}
            />
            <StatCard
                title="Transactions"
                value={summary.transactionCount.toString()}
                subtitle={`Largest: ${formatCurrency(Math.abs(summary.largestTransaction))}`}
                color="text-gray-500"
            />
        </div>
    );
};

export default StatementSummary;