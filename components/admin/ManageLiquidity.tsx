import React, { useState, FormEvent } from 'react';
import { LiquidityPool } from '../../types';

interface ManageLiquidityProps {
    pools: LiquidityPool[];
    onRebalance: (currency: string, amount: number) => Promise<string>;
}

const PoolCard: React.FC<{ pool: LiquidityPool }> = ({ pool }) => {
    const percentage = (pool.balance / pool.target) * 100;
    const barColor = percentage > 80 ? 'bg-green-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-lg text-gray-800">{pool.currency}</h4>
                <span className="text-sm font-medium text-gray-600">{percentage.toFixed(1)}% Funded</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div className={barColor} style={{ width: `${percentage}%`, height: '100%', borderRadius: 'inherit' }}></div>
            </div>
            <div className="mt-2 text-sm text-gray-500 text-right">
                {pool.balance.toLocaleString()} / {pool.target.toLocaleString()}
            </div>
        </div>
    )
}


const ManageLiquidity: React.FC<ManageLiquidityProps> = ({ pools, onRebalance }) => {
    const [currency, setCurrency] = useState('GBP');
    const [amount, setAmount] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [txHash, setTxHash] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setTxHash('');
        setSuccessMessage('');
        setIsSubmitting(true);

        const numAmount = parseFloat(amount);
        if (!isNaN(numAmount) && numAmount !== 0) {
            try {
                const hash = await onRebalance(currency, numAmount);
                setTxHash(hash);
                setSuccessMessage(`Successfully added ${numAmount.toLocaleString()} to the ${currency} pool.`);
                setAmount('');
                 setTimeout(() => {
                    setSuccessMessage('');
                    setTxHash('');
                }, 5000);
            } catch (error) {
                 setSuccessMessage('Failed to update pool.'); // Or set a specific error state
            }
        }
        setIsSubmitting(false);
    };

    return (
        <div>
            <h2 className="mb-8 text-3xl font-bold text-gray-800">Manage Liquidity Pools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pools.map(pool => <PoolCard key={pool.currency} pool={pool} />)}
            </div>

            <div className="p-6 mt-8 bg-white rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800">Add / Rebalance Liquidity</h3>
                {successMessage && (
                    <div className={`p-3 my-4 text-sm rounded-md ${txHash !== 'Error' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                        <p>{successMessage}</p>
                        {txHash && txHash !== 'Error' && (
                            <p className="mt-1">
                                <span className="font-semibold">Blockchain Tx Hash:</span>
                                <span className="block font-mono text-xs break-all">{txHash}</span>
                            </p>
                        )}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
                        <select
                            id="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            {pools.map(p => <option key={p.currency} value={p.currency}>{p.currency}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount to Add</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g., 10000"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                    >
                        {isSubmitting ? 'Updating...' : 'Confirm Update'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManageLiquidity;