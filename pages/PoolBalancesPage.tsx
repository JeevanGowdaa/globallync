import { useEffect, useState } from 'react';
import { SideNav } from '../components/admin/SideNav';
import { AdminNavbar } from '../components/admin/AdminNavbar';
import { KPICard } from '../components/admin/KPICard';
import { DataTable } from '../components/admin/DataTable';
import { Chart } from '../components/admin/Chart';
import { getPoolBalances, PoolBalance } from '../services/admin/mockDataService';
import { Search } from 'lucide-react';

export function PoolBalancesPage() {
  const [pools, setPools] = useState<PoolBalance[]>([]);
  const [filteredPools, setFilteredPools] = useState<PoolBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'country' | 'balance' | 'available'>('country');

  useEffect(() => {
    loadPoolBalances();
  }, []);

  async function loadPoolBalances() {
    try {
      const data = await getPoolBalances();
      setPools(data);
      setFilteredPools(data);
    } catch (error) {
      console.error('Error loading pool balances:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let filtered = pools.filter((pool) =>
      pool.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pool.currency.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'country':
          return a.country.localeCompare(b.country);
        case 'balance':
          return b.balance - a.balance;
        case 'available':
          return b.available - a.available;
      }
    });

    setFilteredPools(filtered);
  }, [searchTerm, sortBy, pools]);

  const totalBalance = pools.reduce((sum, p) => sum + p.balance, 0);
  const totalAvailable = pools.reduce((sum, p) => sum + p.available, 0);
  const totalReserved = pools.reduce((sum, p) => sum + p.reserved, 0);

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
              <h1 className="text-3xl font-bold text-slate-900">Pool Balances</h1>
              <p className="text-slate-600 mt-2">Manage liquidity pools across all corridors</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPICard
                label="Total Pool Balance"
                value={`$${(totalBalance / 1000000).toFixed(2)}M`}
                icon="💰"
                color="blue"
              />
              <KPICard
                label="Available Balance"
                value={`$${(totalAvailable / 1000000).toFixed(2)}M`}
                icon="✅"
                color="green"
              />
              <KPICard
                label="Reserved Amount"
                value={`$${(totalReserved / 1000000).toFixed(2)}M`}
                icon="🔒"
                color="amber"
              />
            </div>

            {/* Chart */}
            <Chart
              title="Pool Balance Distribution"
              type="bar"
              data={filteredPools.map((pool) => ({
                label: `${pool.country} (${pool.currency})`,
                value: pool.balance,
                color: undefined,
              }))}
            />

            {/* Search and Filters */}
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by country or currency..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="country">Sort by Country</option>
                  <option value="balance">Sort by Balance</option>
                  <option value="available">Sort by Available</option>
                </select>
              </div>
            </div>

            {/* Data Table */}
            <DataTable
              title="Pool Balances by Country"
              columns={[
                { key: 'country', label: 'Country', sortable: true },
                { key: 'currency', label: 'Currency', sortable: true },
                {
                  key: 'balance',
                  label: 'Total Balance',
                  sortable: true,
                  render: (value) => `$${(value / 1000000).toFixed(2)}M`,
                },
                {
                  key: 'reserved',
                  label: 'Reserved',
                  sortable: true,
                  render: (value) => `$${(value / 1000000).toFixed(2)}M`,
                },
                {
                  key: 'available',
                  label: 'Available',
                  sortable: true,
                  render: (value) => (
                    <span className="text-green-600 font-medium">
                      ${(value / 1000000).toFixed(2)}M
                    </span>
                  ),
                },
                {
                  key: 'lastUpdated',
                  label: 'Last Updated',
                  render: (value) => new Date(value).toLocaleString(),
                },
              ]}
              data={filteredPools}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
