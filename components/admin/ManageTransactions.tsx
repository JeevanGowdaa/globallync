import React from 'react';
import { Transaction } from '../../types';

interface ManageTransactionsProps {
    transactions: Transaction[];
    onUpdateStatus: (txId: string, status: 'Reviewed') => void;
}

// FIX: Added 'Processing' to the status prop type to handle all possible transaction statuses.
const AdminStatusBadge: React.FC<{ status: 'Completed' | 'Pending' | 'Failed' | 'Reviewed' | 'Processing' }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block";
    const statusClasses = {
        Completed: "bg-green-100 text-green-800",
        Pending: "bg-yellow-100 text-yellow-800",
        Failed: "bg-red-100 text-red-800",
        Reviewed: "bg-blue-100 text-blue-800",
        // FIX: Added styling for the 'Processing' status.
        Processing: "bg-yellow-100 text-yellow-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const ManageTransactions: React.FC<ManageTransactionsProps> = ({ transactions, onUpdateStatus }) => {
    
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    return (
        <div>
            <h2 className="mb-8 text-3xl font-bold text-gray-800">Manage All Transactions</h2>
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Receiver</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Amount (Sent/Rcvd)</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((tx) => (
                                <tr key={tx._id}>
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                        <div className="font-medium">{tx.user.name}</div>
                                        <div className="text-gray-500">{tx.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{tx.receiver}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        <div>£{tx.amountSent.toFixed(2)}</div>
                                        <div>₹{tx.amountReceived.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"><AdminStatusBadge status={tx.status} /></td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDateTime(tx.timeline)}</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                        {tx.status === 'Pending' && (
                                            <button 
                                                onClick={() => onUpdateStatus(tx._id, 'Reviewed')}
                                                className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                                            >
                                                Mark as Reviewed
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageTransactions;