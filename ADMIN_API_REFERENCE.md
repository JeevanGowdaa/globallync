# Admin Dashboard - Code Reference & API

## Component APIs

### KPICard

Display key performance indicators with optional trend indicators.

```tsx
import { KPICard } from '../components/admin';

<KPICard
  label="Total Transfers"
  value={15234}
  icon="📊"
  color="blue"
  trend={{ direction: 'up', percentage: 12 }}
/>
```

**Props:**
```tsx
interface KPICardProps {
  label: string;              // Card label/title
  value: string | number;     // Displayed metric
  icon: string;               // Emoji or icon
  trend?: {                   // Optional trend
    direction: 'up' | 'down';
    percentage: number;
  };
  color?: 'blue' | 'green' | 'red' | 'amber';
}
```

**Colors:**
- `blue` - Primary/Information
- `green` - Success/Available
- `amber` - Warning/Reserved
- `red` - Danger/Failed

---

### DataTable

Sortable, filterable data table with custom cell rendering.

```tsx
import { DataTable } from '../components/admin';

<DataTable
  title="Pool Balances"
  columns={[
    {
      key: 'country',
      label: 'Country',
      sortable: true
    },
    {
      key: 'balance',
      label: 'Balance',
      sortable: true,
      render: (value) => `$${(value / 1000000).toFixed(2)}M`
    }
  ]}
  data={poolData}
  onRowClick={(row) => console.log(row)}
  striped={true}
/>
```

**Props:**
```tsx
interface DataTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  onRowClick?: (row: any) => void;
  striped?: boolean;
}

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => ReactNode;
}
```

**Features:**
- Click headers to sort (ascending/descending)
- Custom cell rendering with `render` prop
- Click rows to handle events
- Striped background option

---

### Chart

Bar and line chart visualization component.

```tsx
import { Chart } from '../components/admin';

// Bar Chart
<Chart
  title="Pool Distribution"
  type="bar"
  data={[
    { label: 'India', value: 50000000 },
    { label: 'USA', value: 2500000 },
    { label: 'UK', value: 1200000 }
  ]}
/>

// Line Chart
<Chart
  title="Volume Trend"
  type="line"
  data={[
    { label: 'Week 1', value: 2500000, color: 'bg-blue-500' },
    { label: 'Week 2', value: 3100000, color: 'bg-blue-500' },
    { label: 'Week 3', value: 3850000, color: 'bg-blue-500' }
  ]}
/>
```

**Props:**
```tsx
interface ChartProps {
  title: string;
  type?: 'bar' | 'line';
  data: {
    label: string;
    value: number;
    color?: string;
  }[];
}
```

**Color Classes:**
- `bg-blue-500` - Primary blue
- `bg-green-500` - Success green
- `bg-red-500` - Danger red
- `bg-amber-500` - Warning amber
- `bg-purple-500` - Purple

---

### SideNav

Fixed sidebar navigation component.

```tsx
import { SideNav } from '../components/admin';

<div className="flex">
  <SideNav />
  <main className="flex-1 md:ml-64">
    {/* Content */}
  </main>
</div>
```

**Features:**
- Responsive (hamburger on mobile)
- Active link highlighting
- Icon + label navigation
- Smooth transitions

**Navigation Items:**
```
📊 Dashboard → /admin
💰 Pool Balances → /admin/pools
📤 Transfers Log → /admin/transfers
🚩 AML Flags → /admin/aml-flags
⛓️ Blockchain Settlements → /admin/blockchain
⚙️ Manual Actions → /admin/actions
```

---

### AdminNavbar

Top navigation bar with user info and logout.

```tsx
import { AdminNavbar } from '../components/admin';

<AdminNavbar />
```

**Features:**
- Displays user name/email
- Logout button
- Fixed positioning
- Responsive design

---

## Service APIs

### blockchainService

Blockchain integration and utilities for Polygon Mumbai.

**Imports:**
```tsx
import {
  getSettlements,
  getPolygonScanLink,
  formatTxHash,
  formatAmount,
  getStatusColor,
  Settlement,
  getRPCUrl,
  getContractABI
} from '../services/admin/blockchainService';
```

#### getSettlements()

Fetch all settlement transactions.

```tsx
const settlements = await getSettlements();
```

**Returns:**
```tsx
Settlement[]

interface Settlement {
  id: string;
  total: string;           // USD amount as string
  fxRate: number;          // Exchange rate applied
  timestamp: number;       // Unix timestamp
  txHash: string;          // Transaction hash
  status: 'pending' | 'confirmed' | 'failed';
  senderCountry: string;
  receiverCountry: string;
  senderAmount: number;
  currency: string;        // Sender currency code
}
```

#### getPolygonScanLink(txHash)

Generate PolygonScan URL for transaction.

```tsx
const link = getPolygonScanLink('0x123abc...');
// Output: https://mumbai.polygonscan.com/tx/0x123abc...

// Use in link
<a href={getPolygonScanLink(txHash)} target="_blank">
  View on PolygonScan
</a>
```

#### formatTxHash(txHash)

Shorten transaction hash for display.

```tsx
formatTxHash('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')
// Output: "0x1234...cdef"
```

#### formatAmount(amount)

Format large numbers with commas and decimals.

```tsx
formatAmount(12500000)      // "12,500,000.00"
formatAmount('12500000.5')  // "12,500,000.50"
formatAmount(1234.56)       // "1,234.56"
```

#### getStatusColor(status)

Get color class for status badge.

```tsx
getStatusColor('confirmed')  // 'green'
getStatusColor('pending')    // 'amber'
getStatusColor('failed')     // 'red'
```

---

### mockDataService

Mock data generation for development and testing.

**Imports:**
```tsx
import {
  getPoolBalances,
  getTransfers,
  getAMLFlags,
  getDashboardStats,
  PoolBalance,
  Transfer,
  AMLFlag,
} from '../services/admin/mockDataService';
```

#### getPoolBalances()

Fetch liquidity pool data.

```tsx
const pools = await getPoolBalances();
```

**Returns:**
```tsx
PoolBalance[]

interface PoolBalance {
  id: string;
  country: string;
  currency: string;
  balance: number;         // Total balance
  reserved: number;        // Amount reserved
  available: number;       // Available for transfers
  lastUpdated: number;     // Timestamp
}
```

#### getTransfers()

Fetch transaction history.

```tsx
const transfers = await getTransfers();
```

**Returns:**
```tsx
Transfer[]

interface Transfer {
  id: string;              // Transaction ID
  senderEmail: string;
  receiverEmail: string;
  amount: number;
  currency: string;
  senderCountry: string;
  receiverCountry: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  txHash?: string;         // Optional blockchain hash
}
```

#### getAMLFlags()

Fetch flagged transactions.

```tsx
const flags = await getAMLFlags();
```

**Returns:**
```tsx
AMLFlag[]

interface AMLFlag {
  id: string;
  transferId: string;
  reason: string;          // Reason for flag
  severity: 'low' | 'medium' | 'high';
  amount: number;
  senderEmail: string;
  timestamp: number;
  reviewed: boolean;       // Review status
}
```

#### getDashboardStats()

Fetch aggregated statistics.

```tsx
const stats = await getDashboardStats();
```

**Returns:**
```tsx
{
  totalTransfers: number;
  totalVolume: number;
  activeUsers: number;
  averageTransferAmount: number;
  successRate: number;     // Percentage
  amlFlags: number;
  pendingReviews: number;
}
```

---

## Common Patterns

### Loading State

```tsx
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    try {
      const data = await getSettlements();
      setData(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, []);

if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
```

### Search and Filter

```tsx
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('all');
const [filteredData, setFilteredData] = useState([]);

useEffect(() => {
  let filtered = data;

  // Status filter
  if (statusFilter !== 'all') {
    filtered = filtered.filter(item => item.status === statusFilter);
  }

  // Search
  if (searchTerm) {
    filtered = filtered.filter(item =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  setFilteredData(filtered);
}, [searchTerm, statusFilter, data]);
```

### Status Badge

```tsx
const getStatusBadge = (status) => {
  const badges = {
    completed: { bg: 'bg-green-100', text: 'text-green-800', label: '✓ Completed' },
    pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: '⏳ Pending' },
    failed: { bg: 'bg-red-100', text: 'text-red-800', label: '✗ Failed' },
  };
  const badge = badges[status] || badges.pending;
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
      {badge.label}
    </span>
  );
};
```

### Bulk Actions

```tsx
const [selectedItems, setSelectedItems] = useState<string[]>([]);

const handleBulkAction = (action: 'approve' | 'reject') => {
  // Perform action on selected items
  selectedItems.forEach(id => {
    // Update item
  });
  setSelectedItems([]);
};

{selectedItems.length > 0 && (
  <div className="flex gap-2">
    <button onClick={() => handleBulkAction('approve')}>
      Approve ({selectedItems.length})
    </button>
    <button onClick={() => setSelectedItems([])}>
      Clear
    </button>
  </div>
)}
```

---

## Styling Classes

### Flexbox Layouts
```tsx
<div className="flex items-center justify-between gap-4">
  {/* Flex layout with centering */}
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Responsive grid: 1 col mobile, 2 col tablet, 4 col desktop */}
</div>
```

### Background Colors
```tsx
bg-slate-50      // Light background
bg-white         // White
bg-slate-100     // Very light gray
bg-blue-50       // Light blue background
bg-slate-900     // Dark slate (sidebar)
```

### Text Colors
```tsx
text-slate-900   // Dark text (main)
text-slate-700   // Medium gray text
text-slate-600   // Light gray text
text-slate-500   // Lighter gray
text-blue-600    // Blue primary
text-green-600   // Green success
text-red-600     // Red danger
```

### Borders
```tsx
border                    // 1px border
border-slate-200         // Light gray border
border-blue-200          // Light blue border
border-t border-b        // Top and bottom only
rounded-lg               // Large border radius
```

### Responsive
```tsx
md:ml-64         // Margin-left on tablet and up
md:grid-cols-2   // 2 columns on tablet and up
lg:grid-cols-3   // 3 columns on desktop
hidden md:block   // Hide on mobile, show on tablet+
```

---

## Network Configuration

### Polygon Mumbai
```
Network: Polygon Mumbai Testnet
Chain ID: 80001
RPC: https://rpc-mumbai.maticvigil.com
Explorer: https://mumbai.polygonscan.com
Token: MATIC
```

### Contract ABI Reference
```tsx
const SETTLEMENT_CONTRACT_ABI = [
  {
    inputs: [],
    name: 'getAllSettlements',
    outputs: [
      {
        components: [
          { name: 'total', type: 'uint256' },
          { name: 'fxRate', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'txHash', type: 'bytes32' },
          { name: 'status', type: 'uint8' },
        ],
        type: 'tuple[]',
      },
    ],
    type: 'function',
    stateMutability: 'view',
  },
];
```

---

## Example: Complete Dashboard Page

```tsx
import { useEffect, useState } from 'react';
import { SideNav, AdminNavbar, KPICard, DataTable, Chart } from '../components/admin';
import { getPoolBalances, PoolBalance } from '../services/admin/mockDataService';

export function PoolBalancesPage() {
  const [pools, setPools] = useState<PoolBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPoolBalances();
        setPools(data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalBalance = pools.reduce((sum, p) => sum + p.balance, 0);

  return (
    <div className="flex h-screen bg-slate-50">
      <SideNav />
      <div className="flex-1 flex flex-col md:ml-64">
        <AdminNavbar />
        <main className="flex-1 pt-20 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <h1 className="text-3xl font-bold text-slate-900">Pool Balances</h1>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPICard
                label="Total Balance"
                value={`$${(totalBalance / 1000000).toFixed(2)}M`}
                icon="💰"
                color="blue"
              />
            </div>

            {/* Data Table */}
            <DataTable
              columns={[
                { key: 'country', label: 'Country', sortable: true },
                { 
                  key: 'balance',
                  label: 'Balance',
                  render: (v) => `$${(v / 1000000).toFixed(2)}M`
                }
              ]}
              data={pools}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
```

---

## Performance Tips

1. **Memoization:** Use `useMemo` for expensive calculations
2. **Lazy Loading:** Use React.lazy for route splitting
3. **Debouncing:** Debounce search/filter inputs
4. **Virtualization:** For large lists, use react-window
5. **Caching:** Cache API responses when appropriate

```tsx
import { useMemo } from 'react';

const filteredData = useMemo(() => {
  return data.filter(item => 
    item.name.includes(searchTerm)
  );
}, [data, searchTerm]);
```

---

## Testing

```tsx
// Example: Testing DataTable sorting
test('DataTable sorts by column', () => {
  const data = [{ id: 2, name: 'B' }, { id: 1, name: 'A' }];
  // Click sort header
  // Verify data is sorted ascending/descending
});

// Example: Testing filters
test('Search filters data correctly', () => {
  const { getByRole } = render(<DataTable data={data} />);
  const searchInput = getByRole('textbox');
  fireEvent.change(searchInput, { target: { value: 'test' } });
  // Verify filtered results
});
```

