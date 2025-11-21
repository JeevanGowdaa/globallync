
import React from 'react';
import { Transaction } from '../types';

interface TransactionHistoryProps {
    transactions: Transaction[];
}

const StatusBadge: React.FC<{ status: 'Completed' | 'Pending' | 'Failed' | 'Reviewed' | 'Processing' }> = ({ status }) => {
    const baseClasses = "px-2.5 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5";
    const statusConfig = {
        Completed: { text: "bg-green-100 text-green-800", icon: <div className="w-2 h-2 bg-green-500 rounded-full"></div> },
        Processing: { text: "bg-yellow-100 text-yellow-800", icon: <div className="w-2 h-2 bg-yellow-500 rounded-full"></div> },
        Pending: { text: "bg-yellow-100 text-yellow-800", icon: <div className="w-2 h-2 bg-yellow-500 rounded-full"></div> },
        Failed: { text: "bg-red-100 text-red-800", icon: <div className="w-2 h-2 bg-red-500 rounded-full"></div> },
        Reviewed: { text: "bg-blue-100 text-blue-800", icon: <div className="w-2 h-2 bg-blue-500 rounded-full"></div> },
    };
    return (
        <span className={`${baseClasses} ${statusConfig[status].text}`}>
            {statusConfig[status].icon}
            {status}
        </span>
    );
};

const TransactionCard: React.FC<{ tx: Transaction }> = ({ tx }) => {
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            // Can add a toast notification here
        });
    };

    const isReceived = tx.transactionType === 'received';
    const otherParty = isReceived ? tx.senderName || 'Sender' : tx.receiver;
    const displayAmount = isReceived ? tx.amountReceived : tx.amountSent;
    const displayCurrency = isReceived ? (tx.toCountry?.currency || 'INR') : (tx.fromCountry?.currency || 'USD');
    const currencySymbol = displayCurrency === 'INR' ? '₹' : displayCurrency === 'USD' ? '$' : displayCurrency === 'GBP' ? '£' : '€';
    
    return (
        <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                         isReceived ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                     }`}>
                        {otherParty.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-800">
                                {isReceived ? 'Received from' : 'Sent to'} {otherParty}
                            </p>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                isReceived ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                                {isReceived ? 'Received' : 'Sent'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">{tx.timeline}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`font-bold text-xl ${isReceived ? 'text-green-600' : 'text-gray-800'}`}>
                        {currencySymbol}{displayAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <StatusBadge status={tx.status} />
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Route</span>
                    <span className="font-semibold text-gray-700">{tx.route}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-500">Risk Score</span>
                    <div className="flex items-center gap-2">
                         <div className="w-24 bg-gray-200 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${tx.riskScore}%` }}></div>
                        </div>
                        <span className="font-semibold text-gray-700">{tx.riskScore}</span>
                    </div>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500">Transaction Hash</span>
                    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded">
                        <span className="font-mono text-xs text-gray-600">{tx.blockchainHash.substring(0,12)}...</span>
                        <button onClick={() => copyToClipboard(tx.blockchainHash)} title="Copy hash">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
    return (
        <div className="space-y-4">
            {transactions.map((tx) => (
                <TransactionCard key={tx._id} tx={tx} />
            ))}
        </div>
    );
};

export default TransactionHistory;
