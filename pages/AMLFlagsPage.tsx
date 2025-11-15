import { useEffect, useState } from 'react';
import { SideNav } from '../components/admin/SideNav';
import { AdminNavbar } from '../components/admin/AdminNavbar';
import { KPICard } from '../components/admin/KPICard';
import { DataTable } from '../components/admin/DataTable';
import { getAMLFlags, AMLFlag } from '../services/admin/mockDataService';
import { Search, AlertTriangle, CheckCircle } from 'lucide-react';

export function AMLFlagsPage() {
  const [flags, setFlags] = useState<AMLFlag[]>([]);
  const [filteredFlags, setFilteredFlags] = useState<AMLFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [reviewedFilter, setReviewedFilter] = useState<'all' | 'reviewed' | 'pending'>('pending');
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);

  useEffect(() => {
    loadAMLFlags();
  }, []);

  async function loadAMLFlags() {
    try {
      const data = await getAMLFlags();
      setFlags(data);
      setFilteredFlags(data);
    } catch (error) {
      console.error('Error loading AML flags:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let filtered = flags;

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter((f) => f.severity === severityFilter);
    }

    // Reviewed filter
    if (reviewedFilter === 'reviewed') {
      filtered = filtered.filter((f) => f.reviewed);
    } else if (reviewedFilter === 'pending') {
      filtered = filtered.filter((f) => !f.reviewed);
    }

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (f) =>
          f.transferId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFlags(filtered);
  }, [searchTerm, severityFilter, reviewedFilter, flags]);

  const getSeverityBadge = (severity: string) => {
    const badges: Record<string, { bg: string; text: string; icon: string }> = {
      low: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '🔵' },
      medium: { bg: 'bg-amber-100', text: 'text-amber-800', icon: '🟡' },
      high: { bg: 'bg-red-100', text: 'text-red-800', icon: '🔴' },
    };
    const badge = badges[severity] || badges.low;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        {badge.icon} {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  const handleMarkReviewed = (flagId: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === flagId ? { ...f, reviewed: !f.reviewed } : f))
    );
  };

  const handleBulkAction = (action: 'approve' | 'reject') => {
    setFlags((prev) =>
      prev.map((f) =>
        selectedFlags.includes(f.id) ? { ...f, reviewed: true } : f
      )
    );
    setSelectedFlags([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingCount = flags.filter((f) => !f.reviewed).length;
  const highSeverityCount = flags.filter((f) => f.severity === 'high' && !f.reviewed).length;

  return (
    <div className="flex h-screen bg-slate-50">
      <SideNav />
      <div className="flex-1 flex flex-col md:ml-64">
        <AdminNavbar />
        <main className="flex-1 pt-20 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">AML Flags</h1>
              <p className="text-slate-600 mt-2">Review and manage suspicious transactions</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPICard
                label="Total Flags"
                value={flags.length}
                icon="🚩"
                color="red"
              />
              <KPICard
                label="Pending Review"
                value={pendingCount}
                icon="⏳"
                color="amber"
              />
              <KPICard
                label="High Severity"
                value={highSeverityCount}
                icon="⚠️"
                color="red"
              />
            </div>

            {/* Alerts */}
            {highSeverityCount > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-red-900">
                    {highSeverityCount} high-severity flags require immediate attention
                  </p>
                  <p className="text-sm text-red-700">
                    Please review these transactions urgently to ensure compliance.
                  </p>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search transaction, email, reason..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Severity Filter */}
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as any)}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Severities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                {/* Review Status */}
                <select
                  value={reviewedFilter}
                  onChange={(e) => setReviewedFilter(e.target.value as any)}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Review</option>
                  <option value="reviewed">Reviewed</option>
                </select>
              </div>

              {/* Bulk Actions */}
              {selectedFlags.length > 0 && (
                <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600">{selectedFlags.length} selected</p>
                  <button
                    onClick={() => handleBulkAction('approve')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Mark Reviewed
                  </button>
                  <button
                    onClick={() => setSelectedFlags([])}
                    className="px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Data Table */}
            <DataTable
              title="AML Flagged Transactions"
              columns={[
                {
                  key: 'transferId',
                  label: 'Transfer ID',
                  sortable: true,
                  render: (value) => <span className="font-mono text-sm">{value}</span>,
                },
                {
                  key: 'senderEmail',
                  label: 'Sender',
                  sortable: true,
                },
                {
                  key: 'amount',
                  label: 'Amount',
                  sortable: true,
                  render: (value, row: AMLFlag) => `$${value.toFixed(2)}`,
                },
                {
                  key: 'reason',
                  label: 'Reason',
                  sortable: true,
                },
                {
                  key: 'severity',
                  label: 'Severity',
                  render: (value) => getSeverityBadge(value),
                },
                {
                  key: 'timestamp',
                  label: 'Flagged Date',
                  sortable: true,
                  render: (value) => new Date(value).toLocaleDateString(),
                },
                {
                  key: 'reviewed',
                  label: 'Status',
                  render: (value, row: AMLFlag) => (
                    <button
                      onClick={() => handleMarkReviewed(row.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        value
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      {value ? '✓ Reviewed' : 'Review'}
                    </button>
                  ),
                },
              ]}
              data={filteredFlags}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
