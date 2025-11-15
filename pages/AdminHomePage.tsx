import { useEffect, useState } from 'react';
import { SideNav } from '../components/admin/SideNav';
import { AdminNavbar } from '../components/admin/AdminNavbar';
import { KPICard } from '../components/admin/KPICard';
import { Chart } from '../components/admin/Chart';
import { getDashboardStats } from '../services/admin/mockDataService';
import { AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalTransfers: number;
  totalVolume: number;
  activeUsers: number;
  averageTransferAmount: number;
  successRate: number;
  amlFlags: number;
  pendingReviews: number;
}

export function AdminHomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <p className="text-slate-600">Error loading dashboard</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <SideNav />
      <div className="flex-1 flex flex-col md:ml-64">
        <AdminNavbar />
        <main className="flex-1 pt-20 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-2">Welcome back! Here's an overview of your platform.</p>
            </div>

            {/* Alert */}
            {stats.pendingReviews > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-gap gap-3">
                <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-amber-900">
                    {stats.pendingReviews} AML flags pending review
                  </p>
                  <p className="text-sm text-amber-700">Please review and take action on flagged transactions.</p>
                </div>
              </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                label="Total Transfers"
                value={stats.totalTransfers.toLocaleString()}
                icon="📊"
                color="blue"
                trend={{ direction: 'up', percentage: 12 }}
              />
              <KPICard
                label="Total Volume"
                value={`$${(stats.totalVolume / 1000000).toFixed(1)}M`}
                icon="💰"
                color="green"
                trend={{ direction: 'up', percentage: 8 }}
              />
              <KPICard
                label="Active Users"
                value={stats.activeUsers.toLocaleString()}
                icon="👥"
                color="blue"
                trend={{ direction: 'up', percentage: 5 }}
              />
              <KPICard
                label="Success Rate"
                value={`${stats.successRate}%`}
                icon="✅"
                color="green"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Chart
                title="Transfers by Corridor"
                type="bar"
                data={[
                  { label: 'USA → India', value: 3245, color: 'bg-blue-500' },
                  { label: 'UK → Nigeria', value: 2890, color: 'bg-green-500' },
                  { label: 'USA → Philippines', value: 2145, color: 'bg-purple-500' },
                  { label: 'Canada → Mexico', value: 1980, color: 'bg-amber-500' },
                ]}
              />
              <Chart
                title="Volume Trend (Last 30 Days)"
                type="line"
                data={[
                  { label: 'Week 1', value: 2500000, color: 'bg-blue-500' },
                  { label: 'Week 2', value: 3100000, color: 'bg-blue-500' },
                  { label: 'Week 3', value: 3850000, color: 'bg-blue-500' },
                  { label: 'Week 4', value: 3050000, color: 'bg-blue-500' },
                ]}
              />
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Avg. Transfer Amount</p>
                <p className="text-2xl font-bold text-slate-900">
                  ${stats.averageTransferAmount.toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">AML Flags (30 days)</p>
                <p className="text-2xl font-bold text-red-600">{stats.amlFlags}</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Pending Actions</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pendingReviews}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
