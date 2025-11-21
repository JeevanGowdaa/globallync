import { useState, useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardHeader from '../components/DashboardHeader';
import TransactionHistory from '../components/TransactionHistory';
import { Transaction } from '../types';
import SummaryCards from '../components/SummaryCards';
import QuickActions from '../components/QuickActions';
import LiveExchangeRates from '../components/LiveExchangeRates';
import FeeComparison from '../components/FeeComparison';
import api from '../services/api';

const DashboardPage: FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<{ totalSent: number; totalReceived: number; totalTransactions: number } | null>(null);
    
    const userName = user?.name?.split(' ')[0] || 'User';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/user/dashboard');
                // API returns { user: {...}, transactions: [...], summary: {...} }
                setTransactions(response.data.transactions || []);
                setSummary(response.data.summary || null);
                setError(null);
            } catch (err: any) {
                // If API fails, try to fetch transactions separately
                try {
                    const txResponse = await api.get('/api/transactions');
                    setTransactions(txResponse.data || []);
                    // Calculate summary from transactions
                    const sentTotal = txResponse.data
                        .filter((tx: Transaction) => tx.transactionType === 'sent')
                        .reduce((sum: number, tx: Transaction) => sum + tx.amountSent, 0);
                    const receivedTotal = txResponse.data
                        .filter((tx: Transaction) => tx.transactionType === 'received')
                        .reduce((sum: number, tx: Transaction) => sum + tx.amountReceived, 0);
                    setSummary({
                        totalSent: sentTotal,
                        totalReceived: receivedTotal,
                        totalTransactions: txResponse.data.length
                    });
                } catch (txErr) {
                    setError('Failed to load transaction history.');
                    console.error(txErr);
                }
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const renderTransactionHistory = () => {
        if (loading) {
            return <div className="text-center p-8 bg-white rounded-lg border">Loading transactions...</div>;
        }
        if (error) {
            return <div className="text-center p-8 bg-red-50 text-red-600 rounded-lg border border-red-200">{error}</div>;
        }
        if (transactions.length === 0) {
            return <div className="text-center p-8 bg-white rounded-lg border">No transactions yet.</div>;
        }
        return <TransactionHistory transactions={transactions} />;
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <DashboardHeader />
            <main className="container mx-auto p-4 md:p-8">
                {/* User Profile Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 md:p-8 mb-8 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold text-2xl">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
                                <p className="text-blue-100 mt-1">{user?.email}</p>
                                <p className="text-blue-100 text-sm mt-1">
                                    Member since {user ? new Date(user.createdAt || Date.now()).toLocaleDateString() : ''}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate('/send')} 
                            className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 font-bold text-blue-600 bg-white rounded-lg shadow-md hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            Send Money
                        </button>
                    </div>
                </div>

                <SummaryCards summary={summary} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-2 space-y-8">
                        <QuickActions />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction History</h2>
                            <p className="text-gray-600 mb-4">Your sent and received money transfers</p>
                            {renderTransactionHistory()}
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <LiveExchangeRates />
                        <FeeComparison />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
