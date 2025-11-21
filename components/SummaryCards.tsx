
import React from 'react';

interface SummaryCardsProps {
    summary?: {
        totalSent: number;
        totalReceived: number;
        totalTransactions: number;
    } | null;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; colorClass: string }> = ({ title, value, icon, colorClass }) => (
    <div className={`p-6 rounded-xl shadow-sm flex items-center justify-between ${colorClass}`}>
        <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-4xl opacity-30">{icon}</div>
    </div>
);

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
    const formatCurrency = (amount: number, currency: string = 'USD') => {
        const symbol = currency === 'USD' ? '$' : currency === 'INR' ? '₹' : currency === 'GBP' ? '£' : '€';
        return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
                title="Total Sent" 
                value={summary ? formatCurrency(summary.totalSent, 'USD') : '$0.00'} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>}
                colorClass="bg-blue-100 text-blue-900"
            />
            <StatCard 
                title="Total Received" 
                value={summary ? formatCurrency(summary.totalReceived, 'INR') : '₹0.00'} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>}
                colorClass="bg-green-100 text-green-900"
            />
            <StatCard 
                title="Total Transactions" 
                value={summary ? summary.totalTransactions.toString() : '0'} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>}
                colorClass="bg-purple-100 text-purple-900"
            />
        </div>
    );
}

export default SummaryCards;
