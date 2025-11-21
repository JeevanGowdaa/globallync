/**
 * Enhanced Transaction History
 * Shows complete money flow with pool transactions
 */

import React from 'react';
import { Transaction } from '../types';

interface TransactionHistoryProps {
    transactions: Transaction[];
}

interface PoolTransaction {
    type: 'debit' | 'credit';
    pool: string;
    amount: number;
    currency: string;
}

const StatusBadge: React.FC<{ status: 'Completed' | 'Pending' | 'Failed' | 'Reviewed' | 'Processing' }> = ({ status }) => {
    const baseClasses = "px-2.5 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5";
    const statusConfig = {
        Completed: { text: "bg-green-100 text-green-800", icon: "✓" },
        Processing: { text: "bg-blue-100 text-blue-800", icon: "⟳" },
        Pending: { text: "bg-yellow-100 text-yellow-800", icon: "⋯" },
        Failed: { text: "bg-red-100 text-red-800", icon: "✕" },
        Reviewed: { text: "bg-purple-100 text-purple-800", icon: "✓" },
    };
    const config = statusConfig[status];
    return (
        <span className={`${baseClasses} ${config.text}`}>
            <span>{config.icon}</span>
            {status}
        </span>
    );
};

const PoolTransactionFlow: React.FC<{ tx: Transaction }> = ({ tx }) => {
    // Mock pool transactions for demonstration
    const poolTransactions: PoolTransaction[] = [
        {
            type: 'debit',
            pool: 'Sender Pool (USD)',
            amount: tx.amountSent,
            currency: 'USD'
        },
        {
            type: 'credit',
            pool: 'Receiver Pool (INR)',
            amount: tx.amountReceived,
            currency: 'INR'
        }
    ];

    return (
        <div className="space-y-2 mt-3">
            {poolTransactions.map((pool, idx) => (
                <div
                    key={idx}
                    className={`flex items-center gap-3 px-3 py-2 rounded text-sm ${
                        pool.type === 'debit'
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-green-50 border border-green-200'
                    }`}
                >
                    <span className={`font-bold ${pool.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                        {pool.type === 'debit' ? '↓' : '↑'}
                    </span>
                    <div className="flex-1">
                        <p className={`font-semibold ${pool.type === 'debit' ? 'text-red-900' : 'text-green-900'}`}>
                            {pool.pool}
                        </p>
                    </div>
                    <span className={`font-bold ${pool.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                        {pool.type === 'debit' ? '-' : '+'}{pool.amount.toFixed(2)} {pool.currency}
                    </span>
                </div>
            ))}
        </div>
    );
};

const TransactionCard: React.FC<{ tx: Transaction }> = ({ tx }) => {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard');
        });
    };

    // Calculate route details
    const getRouteDetails = (route: string) => {
        const parts = route.split('→');
        return {
            from: parts[0]?.trim() || 'USD',
            to: parts[1]?.trim() || 'INR'
        };
    };

    const routeDetails = getRouteDetails(tx.route);
    const isReceived = tx.transactionType === 'received';
    const otherParty = isReceived ? tx.senderName || 'Sender' : tx.receiver;
    const displayAmount = isReceived ? tx.amountReceived : tx.amountSent;
    const displayCurrency = isReceived ? (tx.toCountry?.currency || 'INR') : (tx.fromCountry?.currency || 'USD');
    const currencySymbol = displayCurrency === 'INR' ? '₹' : displayCurrency === 'USD' ? '$' : displayCurrency === 'GBP' ? '£' : '€';

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Header */}
            <div className={`p-5 border-b border-gray-100 bg-gradient-to-r ${
                isReceived ? 'from-green-50 to-emerald-50' : 'from-blue-50 to-indigo-50'
            }`}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            isReceived ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                            {otherParty.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-gray-900 text-lg">
                                    {isReceived ? 'Received from' : 'Sent to'} {otherParty}
                                </p>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                    isReceived ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'
                                }`}>
                                    {isReceived ? 'Received' : 'Sent'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">{tx.timeline}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`font-bold text-2xl ${isReceived ? 'text-green-600' : 'text-gray-900'}`}>
                            {currencySymbol}{displayAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <StatusBadge status={tx.status} />
                    </div>
                </div>
            </div>

            {/* Main Details */}
            <div className="p-5 space-y-4">
                {/* Money Flow */}
                {isReceived ? (
                    <div className="grid grid-cols-2 gap-4 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                        <div className="text-center">
                            <p className="text-xs text-gray-600 mb-1">Received Amount</p>
                            <p className="font-bold text-lg text-green-600">₹{tx.amountReceived.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-600 mb-1">From</p>
                            <p className="font-bold text-lg text-gray-900">{tx.senderName || 'Sender'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                        <div className="text-center">
                            <p className="text-xs text-gray-600 mb-1">You Sent</p>
                            <p className="font-bold text-lg text-gray-900">${tx.amountSent.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="flex flex-col items-center">
                                <p className="text-xs text-gray-500 mb-1">Rate</p>
                                <span className="text-2xl text-blue-600">→</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-600 mb-1">They Received</p>
                            <p className="font-bold text-lg text-green-600">₹{tx.amountReceived.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                )}

                {/* Exchange Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <p className="text-gray-600">Exchange Rate</p>
                        <p className="font-semibold text-gray-900">{tx.rate.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <p className="text-gray-600">Route</p>
                        <p className="font-semibold text-gray-900">{tx.route}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                        <p className="text-green-700">Fee Saved</p>
                        <p className="font-semibold text-green-900">${tx.feeSaved.toFixed(2)}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <p className="text-blue-700">Risk Score</p>
                        <p className="font-semibold text-blue-900">{tx.riskScore}/100</p>
                    </div>
                </div>

                {/* Pool Transactions */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Liquidity Pool Transactions
                    </h4>
                    <PoolTransactionFlow tx={tx} />
                </div>

                {/* Blockchain Info */}
                {tx.blockchainHash && (
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-lg">
                        <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                                <p className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    Blockchain Hash (Polygon Mumbai)
                                </p>
                                <p className="font-mono text-xs text-gray-300 break-all">
                                    {tx.blockchainHash}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => copyToClipboard(tx.blockchainHash)}
                                    title="Copy hash"
                                    className="p-2 hover:bg-slate-700 rounded transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                                <a
                                    href={`https://mumbai.polygonscan.com/tx/${tx.blockchainHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-slate-700 rounded transition-colors"
                                    title="View on PolygonScan"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 hover:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                <div className="flex-1">
                    <p className="text-xs text-gray-500">Transaction ID</p>
                    <p className="font-mono text-xs text-gray-700">{tx._id.substring(0, 16)}...</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500">Timestamp</p>
                    <p className="text-xs text-gray-700">{new Date(tx.timeline).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
    return (
        <div className="space-y-4">
            {transactions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <p className="mt-4 text-gray-500 font-medium">No transactions yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start by sending money to see your transaction history</p>
                </div>
            ) : (
                transactions.map((tx) => (
                    <TransactionCard key={tx._id} tx={tx} />
                ))
            )}
        </div>
    );
};

export default TransactionHistory;
