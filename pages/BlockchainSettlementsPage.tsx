import { useEffect, useState } from 'react';
import { SideNav } from '../components/admin/SideNav';
import { AdminNavbar } from '../components/admin/AdminNavbar';
import { KPICard } from '../components/admin/KPICard';
import { DataTable } from '../components/admin/DataTable';
import {
  getSettlements,
  Settlement,
  getPolygonScanLink,
  formatTxHash,
  formatAmount,
  getStatusColor,
} from '../services/admin/blockchainService';
import { Search, ExternalLink, Copy } from 'lucide-react';

export function BlockchainSettlementsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [filteredSettlements, setFilteredSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'failed'>(
    'all'
  );
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    loadSettlements();
  }, []);

  async function loadSettlements() {
    try {
      const data = await getSettlements();
      setSettlements(data);
      setFilteredSettlements(data);
    } catch (error) {
      console.error('Error loading settlements:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let filtered = settlements;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.senderCountry.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.receiverCountry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSettlements(filtered);
  }, [searchTerm, statusFilter, settlements]);

  const copyToClipboard = (text: string, hash: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string; icon: string }> = {
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed', icon: '✓' },
      pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending', icon: '⏳' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed', icon: '✗' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        {badge.icon} {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const confirmedCount = settlements.filter((s) => s.status === 'confirmed').length;
  const totalVolume = settlements.reduce((sum, s) => sum + parseFloat(s.total), 0);
  const averageFxRate = settlements.length > 0
    ? settlements.reduce((sum, s) => sum + s.fxRate, 0) / settlements.length
    : 0;

  return (
    <div className="flex h-screen bg-slate-50">
      <SideNav />
      <div className="flex-1 flex flex-col md:ml-64">
        <AdminNavbar />
        <main className="flex-1 pt-20 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Blockchain Settlements</h1>
              <p className="text-slate-600 mt-2">
                On-chain settlement tracking on Polygon Mumbai
              </p>
            </div>

            {/* Network Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">⛓️</span>
                <h3 className="font-semibold text-blue-900">Network Information</h3>
              </div>
              <p className="text-sm text-blue-700">
                Connected to: <span className="font-mono font-semibold">Polygon Mumbai Testnet</span>
              </p>
              <p className="text-sm text-blue-700 mt-1">
                RPC: <span className="font-mono text-xs">https://rpc-mumbai.maticvigil.com</span>
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KPICard
                label="Total Settlements"
                value={settlements.length}
                icon="📊"
                color="blue"
              />
              <KPICard
                label="Confirmed"
                value={confirmedCount}
                icon="✅"
                color="green"
              />
              <KPICard
                label="Total Volume"
                value={`$${formatAmount(totalVolume)}`}
                icon="💰"
                color="green"
              />
              <KPICard
                label="Avg. FX Rate"
                value={averageFxRate.toFixed(2)}
                icon="📈"
                color="blue"
              />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search hash, country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as 'all' | 'pending' | 'confirmed' | 'failed')
                  }
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>

                {/* Info */}
                <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600">Settlements Found</p>
                  <p className="text-lg font-bold text-slate-900">{filteredSettlements.length}</p>
                </div>
              </div>
            </div>

            {/* Settlement Table */}
            <DataTable
              title="Settlement Transactions"
              columns={[
                {
                  key: 'id',
                  label: 'Settlement ID',
                  sortable: true,
                  render: (value) => <span className="font-semibold text-slate-900">{value}</span>,
                },
                {
                  key: 'senderCountry',
                  label: 'Corridor',
                  sortable: true,
                  render: (value, row: Settlement) =>
                    `${value} → ${row.receiverCountry}`,
                },
                {
                  key: 'total',
                  label: 'Amount',
                  sortable: true,
                  render: (value, row: Settlement) =>
                    `${row.senderAmount} ${row.currency} ($${formatAmount(value)})`,
                },
                {
                  key: 'fxRate',
                  label: 'FX Rate',
                  sortable: true,
                  render: (value) => value.toFixed(4),
                },
                {
                  key: 'timestamp',
                  label: 'Timestamp',
                  sortable: true,
                  render: (value) => new Date(value * 1000).toLocaleString(),
                },
                {
                  key: 'txHash',
                  label: 'Transaction Hash',
                  render: (value) => (
                    <div className="flex items-center gap-2">
                      <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                        {formatTxHash(value)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(value, value)}
                        title="Copy hash"
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                      >
                        <Copy size={14} className="text-slate-600" />
                      </button>
                    </div>
                  ),
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (value) => getStatusBadge(value),
                },
                {
                  key: 'txHash',
                  label: 'Action',
                  render: (value) => (
                    <a
                      href={getPolygonScanLink(value)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View <ExternalLink size={14} />
                    </a>
                  ),
                },
              ]}
              data={filteredSettlements}
            />

            {/* Info Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Contract Information</h3>
              <p className="text-sm text-slate-600 mb-2">
                Settlement Contract ABI and RPC endpoint are read-only and integrated for viewing
                on-chain data. All transaction hashes are clickable links to PolygonScan for full
                transaction verification and analysis.
              </p>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                View Contract Details →
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
