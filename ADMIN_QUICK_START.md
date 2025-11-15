# Admin Dashboard - Quick Start Guide

## 🚀 Getting Started

The Admin Dashboard is fully built and integrated into the GlobalRemit application. Here's how to access and use it.

## 📋 Admin Credentials

```
Email: admin@example.com
Password: admin123
```

## 🌐 Accessing the Dashboard

1. Navigate to `http://localhost:3000`
2. Click "Log In" or go to `/#/login`
3. Enter admin credentials
4. You'll be automatically redirected to the admin dashboard at `/#/admin`

## 📍 Available Admin Pages

### Dashboard Home (`/#/admin`)
**Overview of key metrics and platform health**
- Total transfers and volume
- Active users count
- Success rate metrics
- Transaction trends
- AML alert summary

### Pool Balances (`/#/admin/pools`)
**Manage liquidity across corridors**
- View total, reserved, and available balances
- Search and filter pools
- Sort by country, balance, or available amount
- Real-time pool distribution chart

### Transfers Log (`/#/admin/transfers`)
**Complete transaction history**
- Filter by status (Completed, Pending, Failed)
- Date range filtering
- Search by ID or email
- Success rate statistics
- Status badges and formatting

### AML Flags (`/#/admin/aml-flags`)
**Compliance and risk management**
- View suspicious transactions
- Severity levels (Low, Medium, High)
- Mark as reviewed or bulk approve
- Filter by severity and status
- Real-time AML metrics

### Blockchain Settlements (`/#/admin/blockchain`)
**On-chain transaction tracking**
- Connected to Polygon Mumbai testnet
- View all settlement transactions
- Copy transaction hashes
- PolygonScan links for verification
- FX rates and settlement status

### Manual Actions (`/#/admin/actions`)
**Administrative operations with audit logging**
- Approve/Reject AML flags
- Reverse transfers and refund
- Add users to whitelist
- Adjust transfer limits
- Complete action history

## 🎯 Key Features

### Navigation
- **Sidebar:** Fixed navigation with active link highlighting
- **Top Bar:** User info and quick logout
- **Mobile:** Hamburger menu for responsive design

### Data Tables
- **Sorting:** Click column headers to sort
- **Search:** Real-time filtering
- **Custom Rendering:** Formatted currency, dates, badges
- **Responsive:** Horizontal scroll on mobile

### KPI Cards
- Real-time metrics
- Trend indicators (up/down arrows)
- Color-coded by category
- Quick status overview

### Charts
- **Bar Charts:** Category comparisons
- **Line Charts:** Trend visualization
- **Mock Data:** Realistic sample data

## 🔐 Security Features

1. **Role-Based Access:** Only admins can access (`role: 'admin'`)
2. **Protected Routes:** All admin pages require authentication
3. **Action Logging:** All manual actions are tracked
4. **Audit Trail:** Timestamp and performer on all actions

## 💾 Data Management

### Mock Data
The dashboard currently uses mock data for demonstration:
- `/services/admin/mockDataService.ts` - Pool balances, transfers, AML flags
- `/services/admin/blockchainService.ts` - Blockchain settlements

To replace with real data:
1. Update service functions to call your backend API
2. Update TypeScript interfaces if data structure changes
3. Add error handling and loading states

### Blockchain Integration
- **Network:** Polygon Mumbai (testnet)
- **RPC:** https://rpc-mumbai.maticvigil.com
- **Explorer:** https://mumbai.polygonscan.com
- **View On Explorer:** All tx hashes link directly to PolygonScan

## 🎨 Customization

### Colors
Edit `tailwind.config.js` or override in component props:
- `color="blue"` | `"green"` | `"red"` | `"amber"`

### Layout
Responsive breakpoints:
- Mobile (default)
- Tablet (`md:`)
- Desktop (`lg:`)

### Add New Page
1. Create new file in `/pages/`
2. Use `SideNav` and `AdminNavbar` components
3. Add route to `App.tsx`
4. Add navigation item to `SideNav.tsx`

## 📊 Data Sources

| Page | Service | Data Type |
|------|---------|-----------|
| Dashboard | mockDataService | Dashboard stats |
| Pools | mockDataService | PoolBalance[] |
| Transfers | mockDataService | Transfer[] |
| AML Flags | mockDataService | AMLFlag[] |
| Blockchain | blockchainService | Settlement[] |
| Actions | Local state | ManualAction[] |

## 🔧 Common Tasks

### Search and Filter
All pages support:
- Real-time text search
- Multi-select filters
- Date range selection
- Status filtering

### Export Data
Currently not built-in, but easy to add:
```tsx
const exportCSV = (data) => {
  const csv = [Object.keys(data[0]), ...data.map(d => Object.values(d))]
    .map(row => row.join(','))
    .join('\n');
  const link = document.createElement('a');
  link.href = `data:text/csv,${csv}`;
  link.download = 'export.csv';
  link.click();
}
```

### Add Notifications
Integrate with your notification system:
```tsx
import { toast } from 'react-hot-toast';
// or
import { notification } from 'antd';
```

## 🚨 Troubleshooting

**Can't access admin pages**
- Verify logged in as admin
- Check browser DevTools → Application → LocalStorage → token
- Ensure token contains `role: 'admin'`

**Data not loading**
- Check browser console for errors
- Verify mock services are accessible
- Check network tab in DevTools

**Styling looks off**
- Verify Tailwind CSS is compiled
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server

**Mobile responsiveness issues**
- Check viewport meta tag in index.html
- Verify media queries in CSS
- Test with Chrome DevTools Device Mode

## 📚 File Structure

```
Admin Dashboard/
├── pages/
│   ├── AdminHomePage.tsx
│   ├── PoolBalancesPage.tsx
│   ├── TransfersLogPage.tsx
│   ├── AMLFlagsPage.tsx
│   ├── BlockchainSettlementsPage.tsx
│   └── ManualActionsPage.tsx
├── components/admin/
│   ├── SideNav.tsx
│   ├── AdminNavbar.tsx
│   ├── KPICard.tsx
│   ├── DataTable.tsx
│   ├── Chart.tsx
│   └── index.ts
├── services/admin/
│   ├── blockchainService.ts
│   ├── mockDataService.ts
│   └── index.ts
└── ADMIN_DASHBOARD.md
```

## 🔄 Next Steps

1. **Backend Integration:** Replace mock services with API calls
2. **Real-time Updates:** Add WebSocket for live data
3. **Export Features:** Add CSV/PDF export functionality
4. **Advanced Filtering:** Add date pickers, advanced search
5. **Notifications:** Add toast/notification system
6. **User Management:** Add admin user and role management

## 📞 Support

For detailed information, see:
- `ADMIN_DASHBOARD.md` - Full documentation
- Component JSX files - Implementation details
- `services/admin/` - Data structures and services
