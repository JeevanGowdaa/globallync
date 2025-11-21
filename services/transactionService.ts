/**
 * Transaction Service
 * Handles complete money transfer flow:
 * Frontend → Backend → AI Engine → Liquidity Pools → Blockchain
 */

import api from './api';
import { Transaction, TransferDetails } from '../types';

export interface TransactionResponse {
  success: boolean;
  transactionId: string;
  transaction: Transaction;
  blockchainHash: string;
  message: string;
}

export interface AIAnalysisResult {
  bestRoute: string;
  expectedFees: number;
  fraudScore: number;
  confidenceScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  estimatedDeliveryTime: string;
}

export interface LiquidityCheckResult {
  senderPoolAvailable: boolean;
  senderBalance: number;
  receiverPoolCapacity: number;
  canProcess: boolean;
}

export interface BlockchainSettlementResult {
  transactionHash: string;
  blockNumber: number;
  confirmed: boolean;
  networkFee: number;
  confirmationTime: number;
}

/**
 * Step 1: Send transaction to backend for processing
 */
export const initiateTransfer = async (
  transferDetails: TransferDetails
): Promise<{ transactionId: string }> => {
  try {
    const response = await api.post<{ transactionId: string }>(
      '/api/transactions/initiate',
      {
        sendAmount: transferDetails.sendAmount,
        receiveAmount: transferDetails.receiveAmount,
        fromCountry: transferDetails.fromCountry,
        toCountry: transferDetails.toCountry,
        exchangeRate: transferDetails.exchangeRate,
        transferFee: transferDetails.transferFee,
        deliveryMethod: transferDetails.deliveryMethod,
        receiver: transferDetails.receiver,
        timestamp: new Date().toISOString(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error initiating transfer:', error);
    throw new Error('Failed to initiate transfer. Please try again.');
  }
};

/**
 * Step 2: Get AI Analysis from backend
 * Backend sends data to AI Engine and returns results
 */
export const getAIAnalysis = async (
  transactionId: string,
  transferDetails: TransferDetails
): Promise<AIAnalysisResult> => {
  try {
    const response = await api.post<AIAnalysisResult>(
      `/api/transactions/${transactionId}/analyze`,
      {
        amount: transferDetails.sendAmount,
        senderCountry: transferDetails.fromCountry.code,
        receiverCountry: transferDetails.toCountry.code,
        receiver: transferDetails.receiver,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting AI analysis:', error);
    throw new Error('Failed to analyze transfer. Please try again.');
  }
};

/**
 * Step 3: Check liquidity pools
 */
export const checkLiquidityPools = async (
  transactionId: string,
  transferDetails: TransferDetails
): Promise<LiquidityCheckResult> => {
  try {
    const response = await api.post<LiquidityCheckResult>(
      `/api/transactions/${transactionId}/check-liquidity`,
      {
        senderCurrency: transferDetails.fromCountry.currency,
        receiverCurrency: transferDetails.toCountry.currency,
        amount: transferDetails.sendAmount,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error checking liquidity:', error);
    throw new Error('Insufficient liquidity. Please try again later.');
  }
};

/**
 * Step 4: Process transfer
 * - Debit sender country pool
 * - Credit receiver country pool
 * - Store transaction in MongoDB
 */
export const processTransfer = async (
  transactionId: string,
  transferDetails: TransferDetails,
  aiAnalysis: AIAnalysisResult
): Promise<{ transaction: any; pools: any }> => {
  try {
    const response = await api.post<{ transaction: any; pools: any; success: boolean }>(
      `/api/transactions/${transactionId}/process`,
      {
        sendAmount: transferDetails.sendAmount,
        receiveAmount: transferDetails.receiveAmount,
        fromCountry: transferDetails.fromCountry,
        toCountry: transferDetails.toCountry,
        exchangeRate: transferDetails.exchangeRate,
        transferFee: transferDetails.transferFee,
        deliveryMethod: transferDetails.deliveryMethod,
        receiver: transferDetails.receiver,
        riskScore: aiAnalysis.fraudScore,
        route: aiAnalysis.bestRoute,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error processing transfer:', error);
    throw new Error('Failed to process transfer. Please try again.');
  }
};

/**
 * Step 5: Settle on blockchain (optional)
 */
export const settleOnBlockchain = async (
  transactionId: string,
  transaction: Transaction | any
): Promise<BlockchainSettlementResult> => {
  try {
    const amount = transaction?.amountSent || transaction?.sendAmount || 0;
    const fromCurrency = transaction?.fromCountry?.currency || 'USD';
    const toCurrency = transaction?.toCountry?.currency || 'INR';
    const receiver = transaction?.receiver || 'Unknown';

    const response = await api.post<BlockchainSettlementResult>(
      `/api/transactions/${transactionId}/settle-blockchain`,
      {
        transactionId,
        amount,
        fromCurrency,
        toCurrency,
        receiver,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error settling on blockchain:', error);
    throw new Error('Failed to settle on blockchain.');
  }
};

/**
 * Complete transfer flow
 * Orchestrates all steps: Initiate → Analyze → Check Liquidity → Process → Blockchain
 */
export const completeTransferFlow = async (
  transferDetails: TransferDetails
): Promise<{
  transaction: Transaction;
  blockchainHash: string;
  aiAnalysis: AIAnalysisResult;
}> => {
  try {
    // Step 1: Initiate
    const { transactionId } = await initiateTransfer(transferDetails);
    console.log('✓ Transfer initiated:', transactionId);

    // Step 2: AI Analysis
    const aiAnalysis = await getAIAnalysis(transactionId, transferDetails);
    console.log('✓ AI Analysis complete:', aiAnalysis);

    // Step 3: Check Liquidity
    const liquidityCheck = await checkLiquidityPools(transactionId, transferDetails);
    if (!liquidityCheck.canProcess) {
      throw new Error('Insufficient liquidity in pools');
    }
    console.log('✓ Liquidity check passed');

    // Step 4: Process Transfer
    const processResult = await processTransfer(transactionId, transferDetails, aiAnalysis);
    console.log('✓ Transfer processed:', processResult);
    const transactionData = processResult.transaction;

    // Step 5: Blockchain Settlement (optional)
    const blockchainResult = await settleOnBlockchain(transactionId, {
      ...transactionData,
      ...transferDetails
    });
    console.log('✓ Blockchain settled:', blockchainResult.transactionHash);

    return {
      transaction: transactionData,
      blockchainHash: blockchainResult.transactionHash,
      aiAnalysis,
    };
  } catch (error) {
    console.error('Transfer flow failed:', error);
    throw error;
  }
};

/**
 * Fetch user transactions (only for logged-in user)
 */
export const fetchUserTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get<Transaction[]>('/api/transactions');
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
};

/**
 * Save transaction to database (creates records for both sender and receiver)
 */
export const saveTransaction = async (transactionData: {
  receiver: string;
  receiverEmail: string;
  receiverId: string; // Now required
  amountSent: number;
  amountReceived: number;
  rate: number;
  route: string;
  riskScore?: number;
  fromCountry?: any;
  toCountry?: any;
  transferFee?: number;
  deliveryMethod?: string;
  feeSaved?: number;
  blockchainHash?: string;
  status?: string;
}): Promise<{ senderTransaction: Transaction; receiverTransaction: Transaction }> => {
  try {
    const response = await api.post<{ senderTransaction: Transaction; receiverTransaction: Transaction }>('/api/transactions', transactionData);
    return response.data;
  } catch (error) {
    console.error('Error saving transaction:', error);
    throw new Error('Failed to save transaction');
  }
};

/**
 * Fetch single transaction details
 */
export const fetchTransactionDetails = async (
  transactionId: string
): Promise<Transaction> => {
  try {
    const response = await api.get<Transaction>(`/api/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw new Error('Failed to fetch transaction details');
  }
};

/**
 * Get transaction status updates (real-time)
 */
export const subscribeToTransactionUpdates = (
  transactionId: string,
  onUpdate: (update: Partial<Transaction>) => void
): (() => void) => {
  // In a real app, this would use WebSocket
  // For now, polling implementation
  const interval = setInterval(async () => {
    try {
      const transaction = await fetchTransactionDetails(transactionId);
      onUpdate(transaction);
    } catch (error) {
      console.error('Error getting transaction update:', error);
    }
  }, 2000);

  return () => clearInterval(interval);
};
