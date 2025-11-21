
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string | Date;
}

export interface Transaction {
  _id: string;
  transactionType?: 'sent' | 'received';
  senderId?: string;
  senderName?: string;
  senderEmail?: string;
  receiver: string;
  receiverEmail?: string;
  receiverId?: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Reviewed' | 'Processing';
  feeSaved: number;
  timeline: string;
  blockchainHash: string;
  amountSent: number;
  amountReceived: number;
  rate: number;
  route: string;
  riskScore: number;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  relatedTransactionId?: string;
}

export interface Quote {
  rate: number;
  fee: number;
  feeSaved: number;
  estimatedDelivery: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, requireAdmin?: boolean) => Promise<User | void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export interface LiquidityPool {
  currency: 'GBP' | 'INR' | 'USD' | 'EUR';
  balance: number;
  target: number;
}

export interface RiskAlert {
  _id: string;
  userId: string;
  userName: string;
  reason: string;
  transactionId: string;
  timestamp: string;
}

export interface Country {
  code: string;
  name: string;
  currency: string;
}

export interface TransferDetails {
  fromCountry: Country;
  toCountry: Country;
  sendAmount: number;
  receiveAmount: number;
  exchangeRate: number;
  transferFee: number;
  totalCost: number;
  deliveryMethod: 'Bank Deposit' | 'Cash Pickup' | 'Mobile Wallet';
  receiver: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  aiAnalysis: {
    confidenceScore: number;
    provider: string;
    riskScore: string;
    speed: string;
    liquidity: string;
    cost: string;
    savings: number;
  };
}