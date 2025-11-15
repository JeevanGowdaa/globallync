import { useState, useEffect } from 'react';
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

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const userName = user?.name?.split(' ')[0] || 'User';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/user/dashboard');
                // Assuming the API returns { user: {...}, transactions: [...] }
                setTransactions(response.data.transactions || []);
                setError(null);
            } catch (err) {
                setError('Failed to load transaction history.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {userName}!</h1>
                        <p className="text-gray-600 mt-1">Ready to send money to your loved ones?</p>
                    </div>
                    <button 
                        onClick={() => navigate('/send')} 
                        className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        Send Money
                    </button>
                </div>

                <SummaryCards />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-2 space-y-8">
                        <QuickActions />
                        {renderTransactionHistory()}
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
