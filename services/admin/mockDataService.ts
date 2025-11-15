export interface PoolBalance {
  id: string;
  country: string;
  currency: string;
  balance: number;
  reserved: number;
  available: number;
  lastUpdated: number;
}

export interface Transfer {
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

export interface AMLFlag {
  id: string;
  transferId: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  amount: number;
  senderEmail: string;
  timestamp: number;
  reviewed: boolean;
}

export async function getPoolBalances(): Promise<PoolBalance[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: '1',
      country: 'India',
      currency: 'INR',
      balance: 50000000,
      reserved: 8000000,
      available: 42000000,
      lastUpdated: Date.now(),
    },
    {
      id: '2',
      country: 'USA',
      currency: 'USD',
      balance: 2500000,
      reserved: 350000,
      available: 2150000,
      lastUpdated: Date.now(),
    },
    {
      id: '3',
      country: 'UK',
      currency: 'GBP',
      balance: 1200000,
      reserved: 180000,
      available: 1020000,
      lastUpdated: Date.now(),
    },
    {
      id: '4',
      country: 'Nigeria',
      currency: 'NGN',
      balance: 800000000,
      reserved: 120000000,
      available: 680000000,
      lastUpdated: Date.now(),
    },
    {
      id: '5',
      country: 'Philippines',
      currency: 'PHP',
      balance: 150000000,
      reserved: 25000000,
      available: 125000000,
      lastUpdated: Date.now(),
    },
  ];
}

export async function getTransfers(): Promise<Transfer[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: 'TXN001',
      senderEmail: 'john@example.com',
      receiverEmail: 'priya@example.in',
      amount: 500,
      currency: 'USD',
      senderCountry: 'USA',
      receiverCountry: 'India',
      status: 'completed',
      timestamp: Date.now() - 3600000,
      txHash: '0x123456789abcdef',
    },
    {
      id: 'TXN002',
      senderEmail: 'jane@example.com',
      receiverEmail: 'chioma@example.ng',
      amount: 1000,
      currency: 'GBP',
      senderCountry: 'UK',
      receiverCountry: 'Nigeria',
      status: 'completed',
      timestamp: Date.now() - 7200000,
      txHash: '0xabcdef123456789',
    },
    {
      id: 'TXN003',
      senderEmail: 'mike@example.com',
      receiverEmail: 'sofia@example.ph',
      amount: 300,
      currency: 'USD',
      senderCountry: 'USA',
      receiverCountry: 'Philippines',
      status: 'pending',
      timestamp: Date.now() - 1800000,
    },
    {
      id: 'TXN004',
      senderEmail: 'sarah@example.com',
      receiverEmail: 'ahmed@example.eg',
      amount: 750,
      currency: 'GBP',
      senderCountry: 'UK',
      receiverCountry: 'Egypt',
      status: 'completed',
      timestamp: Date.now() - 86400000,
      txHash: '0x789abcdef123456',
    },
    {
      id: 'TXN005',
      senderEmail: 'test@example.com',
      receiverEmail: 'invalid@invalid',
      amount: 2000,
      currency: 'USD',
      senderCountry: 'USA',
      receiverCountry: 'Unknown',
      status: 'failed',
      timestamp: Date.now() - 172800000,
    },
  ];
}

export async function getAMLFlags(): Promise<AMLFlag[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: 'FLAG001',
      transferId: 'TXN001',
      reason: 'Amount exceeds daily limit',
      severity: 'low',
      amount: 500,
      senderEmail: 'john@example.com',
      timestamp: Date.now() - 3600000,
      reviewed: false,
    },
    {
      id: 'FLAG002',
      transferId: 'TXN002',
      reason: 'High-risk country destination',
      severity: 'medium',
      amount: 1000,
      senderEmail: 'jane@example.com',
      timestamp: Date.now() - 7200000,
      reviewed: true,
    },
    {
      id: 'FLAG003',
      transferId: 'TXN003',
      reason: 'Multiple rapid transactions',
      severity: 'high',
      amount: 300,
      senderEmail: 'mike@example.com',
      timestamp: Date.now() - 1800000,
      reviewed: false,
    },
    {
      id: 'FLAG004',
      transferId: 'TXN004',
      reason: 'Unusual payment pattern',
      severity: 'low',
      amount: 750,
      senderEmail: 'sarah@example.com',
      timestamp: Date.now() - 86400000,
      reviewed: true,
    },
  ];
}

export async function getDashboardStats() {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    totalTransfers: 15234,
    totalVolume: 12500000,
    activeUsers: 8542,
    averageTransferAmount: 820,
    successRate: 98.5,
    amlFlags: 342,
    pendingReviews: 12,
  };
}
