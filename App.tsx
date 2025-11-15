
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import SendMoneyFlowPage from './pages/SendMoneyFlowPage';

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
                  <AdminDashboardPage />
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
