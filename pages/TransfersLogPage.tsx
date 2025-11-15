import { useEffect, useState } from 'react';
import { SideNav } from '../components/admin/SideNav';
import { AdminNavbar } from '../components/admin/AdminNavbar';
import { DataTable } from '../components/admin/DataTable';
import { getTransfers, Transfer } from '../services/admin/mockDataService';
import { Search, Filter } from 'lucide-react';

export function TransfersLogPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>(
    'all'
  );
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'all'>('30days');

  useEffect(() => {
    loadTransfers();
  }, []);

  async function loadTransfers() {
    try {
      const data = await getTransfers();
      setTransfers(data);
      setFilteredTransfers(data);
    } catch (error) {
      console.error('Error loading transfers:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let filtered = transfers;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // Date range filter
    const now = Date.now();
    let cutoffDate = now;
    switch (dateRange) {
      case 'today':
        cutoffDate = now - 86400000;
        break;
      case '7days':
        cutoffDate = now - 604800000;
        break;
      case '30days':
        cutoffDate = now - 2592000000;
        break;
    }
    filtered = filtered.filter((t) => t.timestamp >= cutoffDate);

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.receiverEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransfers(filtered);
  }, [searchTerm, statusFilter, dateRange, transfers]);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: '✓ Completed' },
      pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: '⏳ Pending' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: '✗ Failed' },
    };
    const badge = badges[status] || badges.pending;
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
      {badge.label}
    </span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              <h1 className="text-3xl font-bold text-slate-900">Transfers Log</h1>
              <p className="text-slate-600 mt-2">View and track all transactions</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={18} className="text-slate-600" />
                <h3 className="font-semibold text-slate-900">Filters</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search ID, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as 'all' | 'pending' | 'completed' | 'failed')
                  }
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>

                {/* Date Range */}
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-xs text-slate-600">Total Transfers</p>
                  <p className="text-lg font-bold text-slate-900">{filteredTransfers.length}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Total Volume</p>
                  <p className="text-lg font-bold text-slate-900">
                    ${filteredTransfers.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Success Rate</p>
                  <p className="text-lg font-bold text-green-600">
                    {filteredTransfers.length > 0
                      ? (
                          (filteredTransfers.filter((t) => t.status === 'completed').length /
                            filteredTransfers.length) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <DataTable
              title="Transaction History"
              columns={[
                {
                  key: 'id',
                  label: 'Transaction ID',
                  sortable: true,
                  render: (value) => <span className="font-mono text-sm">{value}</span>,
                },
                {
                  key: 'senderEmail',
                  label: 'Sender',
                  sortable: true,
                },
                {
                  key: 'receiverEmail',
                  label: 'Receiver',
                  sortable: true,
                },
                {
                  key: 'amount',
                  label: 'Amount',
                  sortable: true,
                  render: (value, row: Transfer) => `${value} ${row.currency}`,
                },
                {
                  key: 'senderCountry',
                  label: 'Corridor',
                  sortable: true,
                  render: (value, row: Transfer) => `${value} → ${row.receiverCountry}`,
                },
                {
                  key: 'timestamp',
                  label: 'Date',
                  sortable: true,
                  render: (value) => new Date(value).toLocaleDateString(),
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (value) => getStatusBadge(value),
                },
              ]}
              data={filteredTransfers}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
