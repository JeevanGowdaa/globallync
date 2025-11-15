// Polygon Mumbai RPC endpoint
const RPC_URL = 'https://rpc-mumbai.maticvigil.com';
const POLYGON_SCAN_URL = 'https://mumbai.polygonscan.com';

export interface Settlement {
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

// Mock ABI for the settlement contract (simplified)
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

// Mock settlement data - in production, this would be fetched from blockchain
export async function getSettlements(): Promise<Settlement[]> {
  // Simulate blockchain query delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: '1',
      total: '5000.00',
      fxRate: 83.45,
      timestamp: Math.floor(Date.now() / 1000) - 86400,
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      status: 'confirmed',
      senderCountry: 'USA',
      receiverCountry: 'India',
      senderAmount: 5000,
      currency: 'USD',
    },
    {
      id: '2',
      total: '2500.50',
      fxRate: 82.8,
      timestamp: Math.floor(Date.now() / 1000) - 172800,
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      status: 'confirmed',
      senderCountry: 'UK',
      receiverCountry: 'Nigeria',
      senderAmount: 2500.5,
      currency: 'GBP',
    },
    {
      id: '3',
      total: '1000.00',
      fxRate: 1.09,
      timestamp: Math.floor(Date.now() / 1000) - 3600,
      txHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
      status: 'pending',
      senderCountry: 'EU',
      receiverCountry: 'Turkey',
      senderAmount: 1000,
      currency: 'EUR',
    },
    {
      id: '4',
      total: '7500.75',
      fxRate: 0.012,
      timestamp: Math.floor(Date.now() / 1000) - 259200,
      txHash: '0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
      status: 'confirmed',
      senderCountry: 'Canada',
      receiverCountry: 'Mexico',
      senderAmount: 7500.75,
      currency: 'CAD',
    },
    {
      id: '5',
      total: '3200.00',
      fxRate: 74.5,
      timestamp: Math.floor(Date.now() / 1000) - 345600,
      txHash: '0xef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
      status: 'confirmed',
      senderCountry: 'Australia',
      receiverCountry: 'India',
      senderAmount: 3200,
      currency: 'AUD',
    },
  ];
}

export function getPolygonScanLink(txHash: string): string {
  return `${POLYGON_SCAN_URL}/tx/${txHash}`;
}

export function getRPCUrl(): string {
  return RPC_URL;
}

export function getContractABI() {
  return SETTLEMENT_CONTRACT_ABI;
}

// Utility to format large numbers
export function formatAmount(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

// Format transaction hash to shorter version
export function formatTxHash(txHash: string): string {
  if (txHash.length < 10) return txHash;
  return `${txHash.substring(0, 6)}...${txHash.substring(txHash.length - 4)}`;
}

// Get status badge color
export function getStatusColor(
  status: 'pending' | 'confirmed' | 'failed'
): 'amber' | 'green' | 'red' {
  switch (status) {
    case 'pending':
      return 'amber';
    case 'confirmed':
      return 'green';
    case 'failed':
      return 'red';
  }
}
