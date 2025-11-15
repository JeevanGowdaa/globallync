# Admin Dashboard - Component Showcase

This document demonstrates all available admin dashboard components with live examples.

## 🎨 KPICard Component

### Basic Usage
```tsx
<KPICard
  label="Total Transfers"
  value="15,234"
  icon="📊"
/>
```

### With Trend Indicator
```tsx
<KPICard
  label="Total Volume"
  value="$12.5M"
  icon="💰"
  color="green"
  trend={{ direction: 'up', percentage: 12 }}
/>
```

### All Color Variants
```tsx
<div className="grid grid-cols-4 gap-4">
  <KPICard label="Primary" value="100" icon="📊" color="blue" />
  <KPICard label="Success" value="200" icon="✅" color="green" />
  <KPICard label="Warning" value="300" icon="⚠️" color="amber" />
  <KPICard label="Danger" value="400" icon="❌" color="red" />
</div>
```

---

## 📊 DataTable Component

### Basic Table
```tsx
<DataTable
  title="Users"
  columns={[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' }
  ]}
  data={[
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' }
  ]}
/>
```

### With Sorting
```tsx
<DataTable
  columns={[
    { key: 'country', label: 'Country', sortable: true },
    { key: 'balance', label: 'Balance', sortable: true }
  ]}
  data={poolData}
/>
```
*Click column headers to sort ascending/descending*

### With Custom Rendering
```tsx
<DataTable
  columns={[
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => `$${value.toFixed(2)}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={value === 'active' ? 'text-green-600' : 'text-red-600'}>
          {value}
        </span>
      )
    }
  ]}
  data={data}
/>
```

### With Row Click Handler
```tsx
<DataTable
  columns={columns}
  data={data}
  onRowClick={(row) => {
    console.log('Clicked:', row);
    // Navigate to detail page
  }}
/>
```

---

## 📈 Chart Component

### Bar Chart
```tsx
<Chart
  title="Top Corridors"
  type="bar"
  data={[
    { label: 'USA → India', value: 3245 },
    { label: 'UK → Nigeria', value: 2890 },
    { label: 'USA → Philippines', value: 2145 }
  ]}
/>
```

### Line Chart
```tsx
<Chart
  title="Monthly Volume"
  type="line"
  data={[
    { label: 'Jan', value: 2100000 },
    { label: 'Feb', value: 2850000 },
    { label: 'Mar', value: 3200000 }
  ]}
/>
```

### With Custom Colors
```tsx
<Chart
  title="Transaction Status"
  type="bar"
  data={[
    { label: 'Completed', value: 1500, color: 'bg-green-500' },
    { label: 'Pending', value: 300, color: 'bg-amber-500' },
    { label: 'Failed', value: 50, color: 'bg-red-500' }
  ]}
/>
```

---

## 🧭 SideNav Component

The sidebar automatically includes these navigation items:

```
📊 Dashboard          → /#/admin
💰 Pool Balances     → /#/admin/pools
📤 Transfers Log     → /#/admin/transfers
🚩 AML Flags         → /#/admin/aml-flags
⛓️ Blockchain        → /#/admin/blockchain
⚙️ Manual Actions    → /#/admin/actions
```

### Features
- **Mobile Responsive:** Hamburger menu on small screens
- **Active State:** Current page highlighted in blue
- **Smooth Transitions:** Animated menu items
- **Icons:** Emoji-based for simplicity

---

## 🎯 AdminNavbar Component

Displays in the top-right:
- User name/email
- Administrator badge
- Logout button

```tsx
<AdminNavbar />
```

Automatically integrated with auth context.

---

## 🔄 Complete Page Example

```tsx
import { useEffect, useState } from 'react';
import { SideNav, AdminNavbar, KPICard, DataTable, Chart } from '../components/admin';
import { getPoolBalances, PoolBalance } from '../services/admin/mockDataService';

export function PoolBalancesPage() {
  const [pools, setPools] = useState<PoolBalance[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <LoadingSpinner />;
  }

  const total = pools.reduce((sum, p) => sum + p.balance, 0);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <SideNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Nav */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="flex-1 pt-20 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <h1 className="text-3xl font-bold text-slate-900">
              Pool Balances
            </h1>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPICard
                label="Total Balance"
                value={`$${(total / 1000000).toFixed(2)}M`}
                icon="💰"
                color="blue"
              />
              <KPICard
                label="Pools Active"
                value={pools.length}
                icon="🏦"
                color="green"
              />
              <KPICard
                label="Last Updated"
                value={new Date().toLocaleTimeString()}
                icon="🕐"
                color="amber"
              />
            </div>

            {/* Chart */}
            <Chart
              title="Balance by Country"
              type="bar"
              data={pools.map(p => ({
                label: `${p.country} (${p.currency})`,
                value: p.balance
              }))}
            />

            {/* Table */}
            <DataTable
              title="Liquidity Pools"
              columns={[
                { key: 'country', label: 'Country', sortable: true },
                { key: 'currency', label: 'Currency' },
                {
                  key: 'balance',
                  label: 'Total Balance',
                  sortable: true,
                  render: (v) => `$${(v / 1000000).toFixed(2)}M`
                },
                {
                  key: 'available',
                  label: 'Available',
                  render: (v) => (
                    <span className="text-green-600 font-medium">
                      $${(v / 1000000).toFixed(2)}M
                    </span>
                  )
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

## 🎨 Styling Patterns

### Responsive Grid
```tsx
{/* 1 col on mobile, 2 on tablet, 3 on desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>
```

### Flexbox Layout
```tsx
<div className="flex items-center justify-between gap-4">
  {/* Left aligned */}
  <div>{/* Content */}</div>
  
  {/* Right aligned */}
  <div>{/* Content */}</div>
</div>
```

### Card Layout
```tsx
<div className="bg-white rounded-lg border border-slate-200 p-6">
  <h3 className="font-semibold text-slate-900 mb-4">Card Title</h3>
  {/* Card content */}
</div>
```

### Status Badge
```tsx
<span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
  ✓ Active
</span>
```

---

## 🧪 Testing Components

### Test DataTable Sorting
```tsx
test('DataTable sorts columns', () => {
  const data = [
    { id: 2, name: 'Bob' },
    { id: 1, name: 'Alice' }
  ];
  
  render(
    <DataTable
      columns={[
        { key: 'id', label: 'ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true }
      ]}
      data={data}
    />
  );
  
  // Click ID header
  const idHeader = screen.getByText('ID');
  fireEvent.click(idHeader);
  
  // Verify sorted
  expect(/* rows are sorted by id */);
});
```

### Test KPICard Rendering
```tsx
test('KPICard displays correct values', () => {
  render(
    <KPICard
      label="Test KPI"
      value={1234}
      icon="📊"
      color="blue"
    />
  );
  
  expect(screen.getByText('Test KPI')).toBeInTheDocument();
  expect(screen.getByText('1234')).toBeInTheDocument();
  expect(screen.getByText('📊')).toBeInTheDocument();
});
```

---

## 📱 Responsive Examples

### Mobile View
- Single column layout
- Hamburger navigation
- Full-width elements
- Touch-friendly spacing

### Tablet View
- 2 column grids
- Sidebar visible
- Compact spacing
- Medium-sized elements

### Desktop View
- 3-4 column grids
- Large sidebar with icons
- Optimal spacing
- Full data tables

---

## 🚀 Performance Tips

### 1. Memoization
```tsx
import { useMemo } from 'react';

const sortedData = useMemo(() => {
  return [...data].sort((a, b) => a.name.localeCompare(b.name));
}, [data]);
```

### 2. Code Splitting
```tsx
import { lazy } from 'react';

const AdminPage = lazy(() => import('./pages/AdminHomePage'));
```

### 3. Debouncing Search
```tsx
import { useDeferredValue } from 'react';

const deferredSearchTerm = useDeferredValue(searchTerm);
```

---

## 🔐 Security Patterns

### Protected Component
```tsx
import AdminProtectedRoute from '../components/AdminProtectedRoute';

<Route
  path="/admin/sensitive"
  element={
    <AdminProtectedRoute>
      <SensitiveAdminPage />
    </AdminProtectedRoute>
  }
/>
```

### Action Logging
```tsx
const logAction = (action: string, details: any) => {
  console.log({
    timestamp: new Date(),
    action,
    details,
    user: currentUser.email
  });
  // Send to backend
};
```

---

## 📚 Component Documentation

For more details, see:
- **ADMIN_DASHBOARD.md** - Full component documentation
- **ADMIN_API_REFERENCE.md** - API signatures and examples
- Individual component files - Source code

---

## 🎯 Quick Copy-Paste Examples

### Simple Dashboard
```tsx
return (
  <div className="flex h-screen bg-slate-50">
    <SideNav />
    <div className="flex-1 flex flex-col md:ml-64">
      <AdminNavbar />
      <main className="flex-1 pt-20 overflow-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Page Title</h1>
        {/* Content here */}
      </main>
    </div>
  </div>
);
```

### Data Filtering with Search
```tsx
const [searchTerm, setSearchTerm] = useState('');
const filtered = data.filter(item =>
  item.name.includes(searchTerm) ||
  item.email.includes(searchTerm)
);

<input
  type="text"
  placeholder="Search..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="px-4 py-2 border border-slate-200 rounded-lg"
/>
```

### Loading State
```tsx
if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
```

---

All components are production-ready and fully typed with TypeScript!
