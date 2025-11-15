# Admin Dashboard Documentation

## Overview

The Global Remit Admin Dashboard is a comprehensive fintech administration system built with React, Vite, and Tailwind CSS. It provides complete oversight and management of international money transfer operations, including pool management, AML compliance, blockchain settlements, and manual administrative actions.

## Project Structure

```
globallync/
├── components/admin/
│   ├── SideNav.tsx           # Navigation sidebar with menu items
│   ├── AdminNavbar.tsx       # Top navigation bar with user info
│   ├── KPICard.tsx          # Reusable KPI card component
│   ├── DataTable.tsx        # Sortable data table with filtering
│   ├── Chart.tsx            # Bar and line chart visualization
│   └── index.ts             # Component exports
├── pages/
│   ├── AdminHomePage.tsx              # Dashboard overview
│   ├── PoolBalancesPage.tsx           # Liquidity pool management
│   ├── TransfersLogPage.tsx           # Transaction history
│   ├── AMLFlagsPage.tsx               # AML compliance review
│   ├── BlockchainSettlementsPage.tsx  # On-chain settlement tracking
│   └── ManualActionsPage.tsx          # Administrative actions
├── services/admin/
│   ├── blockchainService.ts          # Blockchain integration (Polygon Mumbai)
│   ├── mockDataService.ts            # Mock data for demo
│   └── index.ts                      # Service exports
└── App.tsx                           # Routes configuration
```

## Pages Overview

### 1. Admin Dashboard (`/admin`)
**File:** `pages/AdminHomePage.tsx`

Main overview dashboard showing key performance indicators:
- **Total Transfers:** All transactions processed
- **Total Volume:** Sum of all transfer amounts
- **Active Users:** Number of registered users
- **Success Rate:** Percentage of successful transfers
- **AML Flags:** Number of flagged transactions
- **Pending Reviews:** Items requiring attention

**Features:**
- Real-time KPI cards with trend indicators
- Bar chart showing transfers by corridor
- Line chart showing volume trends over 30 days
- Alert notifications for pending AML reviews
- Responsive grid layout

### 2. Pool Balances (`/admin/pools`)
**File:** `pages/PoolBalancesPage.tsx`

Manage liquidity pools across different countries and currencies.

**Features:**
- **KPI Cards:**
  - Total Pool Balance
  - Available Balance
  - Reserved Amount
- **Search & Filters:**
  - Search by country or currency
  - Sort by country, balance, or available amount
- **Data Table:**
  - Country and currency information
  - Balance breakdown
  - Last updated timestamp
- **Distribution Chart:** Visual representation of pool allocation

### 3. Transfers Log (`/admin/transfers`)
**File:** `pages/TransfersLogPage.tsx`

Track and audit all transactions on the platform.

**Features:**
- **Advanced Filters:**
  - Search by transaction ID, email
  - Filter by status (Completed, Pending, Failed)
  - Date range filtering (Today, 7 days, 30 days, All time)
- **Statistics:**
  - Total transfers count
  - Total transaction volume
  - Success rate percentage
- **Status Badges:** Visual indicators for transaction states
- **Data Export Ready:** Click on rows for detailed information

### 4. AML Flags (`/admin/aml-flags`)
**File:** `pages/AMLFlagsPage.tsx`

Review and manage suspicious transactions flagged by AML rules.

**Features:**
- **Severity Levels:**
  - Low (Blue) - Minor concerns
  - Medium (Amber) - Requires review
  - High (Red) - Urgent attention needed
- **Bulk Actions:**
  - Mark multiple flags as reviewed
  - Clear selection
  - Batch approval/rejection
- **Filtering:**
  - By severity level
  - By review status (Pending/Reviewed)
  - Search by transaction, email, reason
- **One-Click Actions:** Mark individual flags as reviewed

### 5. Blockchain Settlements (`/admin/blockchain`)
**File:** `pages/BlockchainSettlementsPage.tsx`

Monitor on-chain settlement transactions on Polygon Mumbai testnet.

**Features:**
- **Network Information:**
  - Connected network display
  - RPC endpoint information
- **KPI Metrics:**
  - Total settlements count
  - Confirmed transactions
  - Total on-chain volume
  - Average FX rate
- **Settlement Table:**
  - Settlement ID and corridor
  - Amount in local currency and USD
  - FX rate applied
  - Timestamp
  - Transaction hash (with copy button)
  - Settlement status
  - PolygonScan link (one-click view on explorer)
- **Smart Contract Integration:**
  - Read-only ABI access
  - RPC endpoint configuration
  - Transaction verification

### 6. Manual Actions (`/admin/actions`)
**File:** `pages/ManualActionsPage.tsx`

Perform administrative actions on the platform with full audit logging.

**Features:**
- **Action Types:**
  - ✓ Approve AML Flag - Mark suspicious transactions as legitimate
  - ✗ Reject AML Flag - Mark false positives
  - ⤴️ Reverse Transfer - Undo and refund completed transfers
  - ⭐ Add User to Whitelist - Fast-track trusted users
  - 📊 Adjust User Limit - Modify daily transfer caps
- **Action Form:**
  - Select action type
  - Enter target ID (auto-uppercase)
  - Add notes for audit trail
- **Action History:**
  - Complete audit log
  - Status tracking (Pending/Completed/Failed)
  - Performer identification
  - Timestamps

## Shared Components

### KPICard
Displays key performance indicators with optional trend indicators.

```tsx
<KPICard
  label="Total Transfers"
  value={15234}
  icon="📊"
  color="blue"
  trend={{ direction: 'up', percentage: 12 }}
/>
```

**Props:**
- `label`: Card title
- `value`: Displayed metric
- `icon`: Emoji or icon
- `color`: 'blue' | 'green' | 'red' | 'amber'
- `trend?`: Optional trend indicator

### DataTable
Sortable, filterable data table with custom rendering.

```tsx
<DataTable
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { 
      key: 'amount',
      label: 'Amount',
      render: (value) => `$${value.toFixed(2)}`
    }
  ]}
  data={data}
  title="Transactions"
/>
```

**Features:**
- Column sorting (click header)
- Custom cell rendering
- Striped rows
- Click handling
- Responsive overflow

### Chart
Bar and line chart visualization.

```tsx
<Chart
  title="Transfer Volume"
  type="bar"
  data={[
    { label: 'Week 1', value: 2500000 },
    { label: 'Week 2', value: 3100000 }
  ]}
/>
```

**Types:**
- `bar`: Horizontal bar chart
- `line`: Vertical line/column chart

### SideNav
Fixed navigation sidebar with active link detection.

**Features:**
- Mobile responsive (hamburger menu)
- Active state highlighting
- Icon + label navigation
- Smooth transitions

### AdminNavbar
Top navigation bar with user info and logout.

**Features:**
- User name/email display
- Logout button
- Fixed position with sidebar offset
- Responsive design

## Services

### blockchainService.ts

**Functions:**

#### `getSettlements(): Promise<Settlement[]>`
Fetches all settlement transactions.

```tsx
const settlements = await getSettlements();
```

#### `getPolygonScanLink(txHash: string): string`
Generates PolygonScan URL for transaction verification.

```tsx
const link = getPolygonScanLink('0x123...');
// Returns: https://mumbai.polygonscan.com/tx/0x123...
```

#### `formatAmount(amount: string | number): string`
Formats large numbers with commas and decimals.

```tsx
formatAmount(12500000) // Returns: "12,500,000.00"
```

#### `formatTxHash(txHash: string): string`
Shortens transaction hash for display.

```tsx
formatTxHash('0x123456789...') // Returns: "0x1234...6789"
```

#### `getStatusColor(status: string): 'amber' | 'green' | 'red'`
Returns color class for status badge.

### mockDataService.ts

**Functions:**

#### `getPoolBalances(): Promise<PoolBalance[]>`
Returns liquidity pool data for all corridors.

#### `getTransfers(): Promise<Transfer[]>`
Returns transaction history.

#### `getAMLFlags(): Promise<AMLFlag[]>`
Returns flagged transactions for review.

#### `getDashboardStats(): Promise<DashboardStats>`
Returns aggregated statistics for dashboard.

**Data Types:**

```tsx
interface Settlement {
  id: string;
  total: string;
  fxRate: number;
  timestamp: number;
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  senderCountry: string;
  receiverCountry: string;
  senderAmount: number;
  currency: string;
}

interface PoolBalance {
  id: string;
  country: string;
  currency: string;
  balance: number;
  reserved: number;
  available: number;
  lastUpdated: number;
}

interface Transfer {
  id: string;
  senderEmail: string;
  receiverEmail: string;
  amount: number;
  currency: string;
  senderCountry: string;
  receiverCountry: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  txHash?: string;
}

interface AMLFlag {
  id: string;
  transferId: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  amount: number;
  senderEmail: string;
  timestamp: number;
  reviewed: boolean;
}
```

## Authentication

All admin routes are protected by `AdminProtectedRoute` component which:
- Checks if user is logged in
- Verifies user role is 'admin'
- Redirects to login if not authenticated
- Redirects to user dashboard if not admin

**Login Credentials:**
```
Email: admin@example.com
Password: admin123
```

## Styling

The dashboard uses Tailwind CSS with custom color scheme:
- **Primary:** Blue (`bg-blue-600`, `text-blue-600`)
- **Success:** Green (`bg-green-600`, `text-green-600`)
- **Alert:** Amber (`bg-amber-600`, `text-amber-600`)
- **Danger:** Red (`bg-red-600`, `text-red-600`)
- **Neutral:** Slate (`bg-slate-50` to `bg-slate-900`)

## Responsive Design

All pages are fully responsive:
- **Mobile:** Single column, hamburger navigation
- **Tablet:** 2-3 column layouts
- **Desktop:** Full multi-column dashboards

Breakpoints:
- `sm`: 640px
- `md`: 768px (primary breakpoint)
- `lg`: 1024px
- `xl`: 1280px

## Performance Considerations

1. **Mock Data Delays:** Services simulate network latency (300-500ms)
2. **Loading States:** All pages show loading spinners
3. **Sorting:** Client-side sorting on tables
4. **Filtering:** Real-time filtering with debounce
5. **Code Splitting:** Each page is a separate component

## Future Enhancements

1. **Real Backend Integration:**
   - Replace mock services with API calls
   - Add WebSocket for real-time updates
   - Implement proper error handling

2. **Advanced Features:**
   - Export to CSV/PDF
   - Scheduled reports
   - User activity logs
   - Role-based access control (RBAC)

3. **Blockchain Integration:**
   - Direct contract calls via ethers.js
   - Gas fee monitoring
   - Multi-signature wallet support

4. **Compliance:**
   - Complete AML/KYC workflows
   - OFAC integration
   - Audit trails and reports

## Troubleshooting

**Admin routes not accessible:**
- Verify logged in as admin
- Check `AdminProtectedRoute` component
- Verify token contains role: 'admin'

**Data not loading:**
- Check browser console for errors
- Verify mock services are exporting correctly
- Check network tab in DevTools

**Styling issues:**
- Verify Tailwind CSS is installed
- Check vite.config.ts has Tailwind plugin
- Clear browser cache

## Support

For issues or questions, refer to:
1. Component JSX files for implementation details
2. Service files for data structures
3. Type definitions in services/admin/mockDataService.ts
