import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Transaction, LiquidityPool, RiskAlert } from '../types';
import AdminDashboardView from '../components/admin/AdminDashboardView';
import ManageTransactions from '../components/admin/ManageTransactions';
import ManageLiquidity from '../components/admin/ManageLiquidity';
import RiskAlerts from '../components/admin/RiskAlerts';
import AnalyticsView from '../components/admin/AnalyticsView';
import api from '../services/api';

type UserDetails = { id: string; name: string; email: string };

const AdminDashboardPage = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [pools, setPools] = useState<LiquidityPool[]>([]);
    const [alerts, setAlerts] = useState<RiskAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
    const [selectedUserForModal, setSelectedUserForModal] = useState<UserDetails | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Try real API first
            try {
                const [transRes, poolsRes, alertsRes] = await Promise.all([
                    api.get('/api/admin/transactions'),
                    api.get('/api/admin/liquidity-pools'),
                    api.get('/api/admin/risk-alerts')
                ]);
                setTransactions(transRes.data);
                setPools(poolsRes.data);
                setAlerts(alertsRes.data);
            } catch (apiError: any) {
                // Fallback to mock data if API fails
                if (apiError.response?.status === 404 || !apiError.response) {
                    // Mock data
                    const mockTransactions: Transaction[] = [
                        {
                            _id: '1',
                            receiver: 'John Doe',
                            status: 'Completed',
                            feeSaved: 5.50,
                            timeline: '2 hours',
                            blockchainHash: '0x123abc...',
                            amountSent: 100,
                            amountReceived: 8500,
                            rate: 85,
                            route: 'Bank Transfer',
                            riskScore: 2,
                            user: { id: 'u1', name: 'Alice', email: 'alice@example.com' }
                        },
                        {
                            _id: '2',
                            receiver: 'Jane Smith',
                            status: 'Pending',
                            feeSaved: 3.00,
                            timeline: '4 hours',
                            blockchainHash: '0x456def...',
                            amountSent: 500,
                            amountReceived: 42500,
                            rate: 85,
                            route: 'Mobile Wallet',
                            riskScore: 5,
                            user: { id: 'u2', name: 'Bob', email: 'bob@example.com' }
                        }
                    ];

                    const mockPools: LiquidityPool[] = [
                        { currency: 'INR', balance: 5000000, target: 10000000 },
                        { currency: 'GBP', balance: 500000, target: 1000000 },
                        { currency: 'USD', balance: 2000000, target: 5000000 },
                        { currency: 'EUR', balance: 1000000, target: 2000000 }
                    ];

                    const mockAlerts: RiskAlert[] = [
                        {
                            _id: '1',
                            userId: 'u1',
                            userName: 'Alice Johnson',
                            reason: 'Large transaction amount',
                            transactionId: 'tx-001',
                            timestamp: new Date().toISOString()
                        },
                        {
                            _id: '2',
                            userId: 'u2',
                            userName: 'Bob Smith',
                            reason: 'Unusual destination country',
                            transactionId: 'tx-002',
                            timestamp: new Date().toISOString()
                        }
                    ];

                    setTransactions(mockTransactions);
                    setPools(mockPools);
                    setAlerts(mockAlerts);
                } else {
                    throw apiError;
                }
            }
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdateStatus = async (txId: string, status: 'Reviewed') => {
        try {
            await api.post(`/api/admin/transactions/${txId}/update`, { status });
            setTransactions(prev => prev.map(tx => tx._id === txId ? { ...tx, status } : tx));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Error: Could not update transaction status.");
        }
    };

    const handleRebalance = async (currency: string, amount: number): Promise<string> => {
        try {
            const response = await api.post(`/api/admin/pools/rebalance`, { currency, amount });
            // Refresh pools data after rebalancing
            fetchData(); 
            // Return blockchain hash from server response
            return response.data.blockchainHash || 'N/A';
        } catch (error) {
            console.error("Failed to rebalance pool", error);
            alert("Error: Could not rebalance pool.");
            return 'Error';
        }
    };
    
    const handleViewUserDetails = async (userId: string) => {
        try {
            // Assuming an endpoint to fetch user details by ID
            const response = await api.get(`/api/admin/users/${userId}`);
            setSelectedUserForModal(response.data);
            setIsUserDetailsModalOpen(true);
        } catch (error) {
             console.error("Failed to fetch user details", error);
             alert("Could not load user details.");
        }
    };

    const handleCloseModal = () => {
        setIsUserDetailsModalOpen(false);
        setSelectedUserForModal(null);
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'transactions', label: 'Manage Transactions' },
        { id: 'liquidity', label: 'Manage Pools' },
        { id: 'risk', label: 'Risk Alerts' },
        { id: 'analytics', label: 'Analytics' }
    ];

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        setIsSidebarOpen(false); // Close sidebar on mobile after selection
    };
    
    const sidebarClasses = isSidebarOpen ? 'translate-x-0' : '-translate-x-full';

    return (
        <div className="relative min-h-screen bg-gray-100 md:flex">
            {isUserDetailsModalOpen && selectedUserForModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" aria-modal="true" role="dialog">
                    <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl">
                        <div className="flex items-start justify-between">
                            <h3 className="text-xl font-bold text-gray-800">User Details</h3>
                            <button onClick={handleCloseModal} className="text-2xl font-bold leading-none text-gray-500 hover:text-gray-800" aria-label="Close modal">&times;</button>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div><span className="font-semibold text-gray-600">Name:</span> <span className="text-gray-800">{selectedUserForModal.name}</span></div>
                            <div><span className="font-semibold text-gray-600">Email:</span> <span className="text-gray-800">{selectedUserForModal.email}</span></div>
                            <div><span className="font-semibold text-gray-600">User ID:</span> <span className="font-mono text-sm text-gray-800">{selectedUserForModal.id}</span></div>
                        </div>
                        <div className="mt-6 text-right">
                            <button onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
             {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-black opacity-50 md:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
            
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 p-6 bg-white shadow-md transform ${sidebarClasses} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-600">GlobalRemit</h1>
                        <p className="text-lg font-semibold text-gray-700">Admin Panel</p>
                        <div className="mt-10">
                            <p className="font-semibold text-gray-800">Welcome, {user?.name}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <nav className="mt-8">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    className={`w-full text-left block px-4 py-2 mt-2 text-sm font-medium rounded-md ${
                                        activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <button onClick={logout} className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">
                        Logout
                    </button>
                </div>
            </aside>

            <div className="flex flex-col flex-1">
                 {/* Mobile Header */}
                 <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white shadow-md md:hidden">
                    <div>
                        <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
                        <p className="text-sm text-gray-500">{tabs.find(t => t.id === activeTab)?.label}</p>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} aria-label="Open sidebar">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </header>

                <main className="flex-1 p-4 overflow-y-auto md:p-8">
                    <div className="container px-4 mx-auto">
                        {loading ? (
                            <div className="text-center">Loading admin data...</div>
                        ) : (
                            <>
                                {activeTab === 'dashboard' && <AdminDashboardView transactions={transactions} pools={pools} />}
                                {activeTab === 'transactions' && <ManageTransactions transactions={transactions} onUpdateStatus={handleUpdateStatus} />}
                                {activeTab === 'liquidity' && <ManageLiquidity pools={pools} onRebalance={handleRebalance} />}
                                {activeTab === 'risk' && <RiskAlerts alerts={alerts} onViewUserDetails={handleViewUserDetails} />}
                                {activeTab === 'analytics' && <AnalyticsView transactions={transactions} />}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
