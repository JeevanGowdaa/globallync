import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import SendMoneyFlowPage from './pages/SendMoneyFlowPage';
import { AdminHomePage } from './pages/AdminHomePage';
import { PoolBalancesPage } from './pages/PoolBalancesPage';
import { TransfersLogPage } from './pages/TransfersLogPage';
import { AMLFlagsPage } from './pages/AMLFlagsPage';
import { BlockchainSettlementsPage } from './pages/BlockchainSettlementsPage';
import { ManualActionsPage } from './pages/ManualActionsPage';

function App() {
  return (
    <AuthProvider>
      <div className="bg-gray-100 min-h-screen">
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/send"
              element={
                <ProtectedRoute>
                  <SendMoneyFlowPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminHomePage />
                </AdminProtectedRoute>
              }
            />
            <Route 
              path="/admin/pools"
              element={
                <AdminProtectedRoute>
                  <PoolBalancesPage />
                </AdminProtectedRoute>
              }
            />
            <Route 
              path="/admin/transfers"
              element={
                <AdminProtectedRoute>
                  <TransfersLogPage />
                </AdminProtectedRoute>
              }
            />
            <Route 
              path="/admin/aml-flags"
              element={
                <AdminProtectedRoute>
                  <AMLFlagsPage />
                </AdminProtectedRoute>
              }
            />
            <Route 
              path="/admin/blockchain"
              element={
                <AdminProtectedRoute>
                  <BlockchainSettlementsPage />
                </AdminProtectedRoute>
              }
            />
            <Route 
              path="/admin/actions"
              element={
                <AdminProtectedRoute>
                  <ManualActionsPage />
                </AdminProtectedRoute>
              }
            />
          </Routes>
        </HashRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
