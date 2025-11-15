import React from 'react';
import { Transaction } from '../../types';

const AnalyticsCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="p-4 bg-white rounded-lg shadow-lg">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="mt-1 text-2xl font-semibold text-gray-800">{value}</p>
    </div>
);

const SimpleBarChart: React.FC<{ data: { label: string; value: number }[]; title: string; }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero
    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <div className="mt-4 flex justify-around items-end h-48 pt-4 space-x-2 sm:space-x-4 border-t border-gray-200">
                {data.map(item => (
                    <div key={item.label} className="flex flex-col items-center flex-1 h-full" title={`${item.label}: ${item.value}`}>
                        <div className="flex flex-col justify-end w-full h-full">
                           <div className="w-full mx-auto bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors" style={{ height: `${(item.value / maxValue) * 100}%` }}></div>
                        </div>
                        <span className="mt-2 text-xs font-medium text-center text-gray-600">{item.label}</span>
                        <span className="text-sm font-bold text-gray-800">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const AnalyticsView: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const volumeByStatus = transactions.reduce((acc, tx) => {
        if (!acc[tx.status]) {
            acc[tx.status] = 0;
        }
        acc[tx.status] += tx.amountSent;
        return acc;
    }, {} as Record<Transaction['status'], number>);

    // Mock daily transaction counts for the last 5 days
    const dailyTxData = [
        { label: '5 days ago', value: 3 },
        { label: '4 days ago', value: 5 },
        { label: '3 days ago', value: 2 },
        { label: 'Yesterday', value: 7 },
        { label: 'Today', value: 4 },
    ];

    return (
        <div>
            <h2 className="mb-8 text-3xl font-bold text-gray-800">Platform Analytics</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <AnalyticsCard title="Completed Volume" value={`£${(volumeByStatus.Completed || 0).toLocaleString()}`} />
                <AnalyticsCard title="Pending Volume" value={`£${(volumeByStatus.Pending || 0).toLocaleString()}`} />
                <AnalyticsCard title="Failed Volume" value={`£${(volumeByStatus.Failed || 0).toLocaleString()}`} />
                <AnalyticsCard title="Reviewed by Admin" value={`${transactions.filter(t => t.status === 'Reviewed').length}`} />
            </div>
            <div className="mt-8">
                <SimpleBarChart data={dailyTxData} title="Transactions This Week" />
            </div>
        </div>
    );
};

export default AnalyticsView;
