
import React from 'react';
import { Transaction, LiquidityPool } from '../../types';

interface AdminDashboardViewProps {
    transactions: Transaction[];
    pools: LiquidityPool[];
}

const StatCard: React.FC<{ title: string; value: string; subtext?: string; color: string; }> = ({ title, value, subtext, color }) => (
    <div className="p-6 bg-white rounded-lg shadow-lg">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className={`mt-1 text-3xl font-semibold ${color}`}>{value}</p>
        {subtext && <p className="mt-1 text-xs text-gray-500">{subtext}</p>}
    </div>
);

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ transactions, pools }) => {
    const totalVolume = transactions.reduce((sum, tx) => tx.status === 'Completed' ? sum + tx.amountSent : sum, 0);
    const pendingTransactions = transactions.filter(tx => tx.status === 'Pending').length;
    const liquidityStatus = pools.every(p => p.balance > p.target * 0.8) ? 'Healthy' : 'Needs Attention';
    const liquidityColor = liquidityStatus === 'Healthy' ? 'text-green-600' : 'text-yellow-600';

    return (
        <div>
            <h2 className="mb-8 text-3xl font-bold text-gray-800">Admin Overview</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Volume (GBP)" value={`£${(totalVolume / 1000).toFixed(1)}k`} subtext="All completed transfers" color="text-blue-600" />
                <StatCard title="Liquidity Status" value={liquidityStatus} subtext="Across all currency pools" color={liquidityColor} />
                <StatCard title="Pending Transactions" value={pendingTransactions.toString()} subtext="Awaiting processing" color="text-orange-600" />
                <StatCard title="Active Risk Alerts" value="2" subtext="Flagged by AI Engine" color="text-red-600" />
            </div>

            <div className="p-6 mt-8 bg-white rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800">AI Engine Predictions</h3>
                <div className="mt-4">
                    <h4 className="font-semibold text-gray-700">Predicted Liquidity Needs (Next 24 Hours)</h4>
                    <p className="mt-2 text-gray-600">The AI model predicts a higher than average demand for <span className="font-bold text-blue-600">INR</span> transfers. </p>
                    <ul className="pl-5 mt-2 space-y-1 text-sm list-disc text-gray-500">
                        <li>Predicted Outflow (GBP): <span className="font-mono">£85,000</span></li>
                        <li>Predicted Inflow (INR): <span className="font-mono">₹7,225,000</span></li>
                    </ul>
                    <p className="mt-3 text-sm text-green-700">
                        <span className="font-bold">Recommendation:</span> Current liquidity is sufficient, but monitor GBP pool closely.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardView;
