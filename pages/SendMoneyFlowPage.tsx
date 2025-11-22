import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransferDetails } from '../types';

import Stepper from '../components/send_money/Stepper';
import Step1Countries from '../components/send_money/Step1_Countries';
import Step2Amount from '../components/send_money/Step2_Amount';
import Step3Receiver from '../components/send_money/Step3_Receiver';
import Step4AIAnalysis from '../components/send_money/Step4_AIAnalysis';
import Step5Confirm from '../components/send_money/Step5_Confirm';
import DashboardHeader from '../components/DashboardHeader';
import { completeTransferFlow, AIAnalysisResult, saveTransaction } from '../services/transactionService';
import { useAuth } from '../hooks/useAuth';
import TransactionProgressModal from '../components/TransactionProgressModal';

const initialTransferDetails: TransferDetails = {
  fromCountry: { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  toCountry: { code: 'IN', name: 'India', currency: 'INR' },
  sendAmount: 100,
  receiveAmount: 0,
  exchangeRate: 0,
  transferFee: 0,
  totalCost: 0,
  deliveryMethod: 'Bank Deposit',
  receiver: {
    fullName: 'Basavaraj C K',
    email: 'basavarajck2005@gmail.com',
    phone: '+91 7483165044',
    address: '123 Main St, Bangalore',
  },
  aiAnalysis: {
    confidenceScore: 98,
    provider: 'Blockchain Network',
    riskScore: 'Low (2.1/10)',
    speed: 'Instant',
    liquidity: 'High',
    cost: 'Lowest',
    savings: 12.50,
  }
};

const stepsConfig = [
    { name: 'Countries', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.884 5.064A9 9 0 1016.116 5.064M12 21V19" /></svg> },
    { name: 'Amount', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg> },
    { name: 'Receiver', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { name: 'AI Analysis', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" /><circle cx="12" cy="12" r="4" /></svg> },
    { name: 'Confirm', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
];


const SendMoneyFlowPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [transferDetails, setTransferDetails] = useState<TransferDetails>(initialTransferDetails);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Receiver validation state
  const [isReceiverValid, setIsReceiverValid] = useState<boolean | null>(null);
  const [receiverId, setReceiverId] = useState<string | null>(null);

  // Validate receiver account existence
  const validateReceiver = async (email: string) => {
    try {
      setError(null);
      // Call backend API to check receiver (requires authentication)
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to send money.');
        return false;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/transactions/check-receiver?email=${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        setError('Your session has expired. Please log in again.');
        return false;
      }

      const data = await res.json();
      if (data.exists) {
        setIsReceiverValid(true);
        setReceiverId(data.id || null); // Store receiver ID
        return true;
      } else {
        setIsReceiverValid(false);
        setReceiverId(null);
        setError(data.message || 'Receiver not found. They need to sign up first.');
        return false;
      }
    } catch (err) {
      setIsReceiverValid(false);
      setReceiverId(null);
      setError('Error validating receiver. Please try again.');
      return false;
    }
  };

  const updateTransferDetails = (details: Partial<TransferDetails>) => {
    setTransferDetails(prev => ({ ...prev, ...details }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleConfirm = async () => {
    // Require receiver validation before proceeding
    const receiverEmail = transferDetails.receiver.email;
    const receiverOk = await validateReceiver(receiverEmail);

    if (!receiverOk) {
      // Ask user whether to proceed when receiver is not registered
      const proceed = window.confirm('Receiver not found. The receiver does not have an account. Do you want to continue and send to this email anyway? (They will be notified to sign up)');
      if (!proceed) {
        setError('Transfer cancelled. Please invite the receiver to sign up first.');
        return;
      }
      // clear any previous error and continue; receiverId will be null
      setError(null);
    }

    try {
      setIsProcessing(true);
      setError(null);
      setShowProgressModal(true);

      // Execute complete transfer flow
      const result = await completeTransferFlow(transferDetails);
      setAiAnalysis(result.aiAnalysis);
      console.log('Transfer successful:', result);

      // Save transaction to database for both sender and receiver
      if (!receiverId) {
        console.error('Receiver ID not available after validation');
      } else {
        try {
          await saveTransaction({
            receiver: transferDetails.receiver.fullName,
            receiverEmail: transferDetails.receiver.email,
            receiverId: receiverId, // Required: receiver's user ID
            amountSent: transferDetails.sendAmount,
            amountReceived: transferDetails.receiveAmount,
            rate: transferDetails.exchangeRate,
            route: result.aiAnalysis.bestRoute || transferDetails.fromCountry.currency + ' → ' + transferDetails.toCountry.currency,
            riskScore: result.aiAnalysis.fraudScore || 0,
            fromCountry: transferDetails.fromCountry,
            toCountry: transferDetails.toCountry,
            transferFee: transferDetails.transferFee,
            deliveryMethod: transferDetails.deliveryMethod,
            feeSaved: result.aiAnalysis?.savings || 0,
            blockchainHash: result.blockchainHash || '',
            status: 'Completed'
          });
          console.log('Transaction saved to database for both sender and receiver');
        } catch (saveError) {
          console.error('Error saving transaction:', saveError);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setShowProgressModal(false);
      console.error('Transfer failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProgressModalClose = () => {
    setShowProgressModal(false);
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Countries
            fromCountry={transferDetails.fromCountry}
            toCountry={transferDetails.toCountry}
            setFromCountry={(country) => updateTransferDetails({ fromCountry: country })}
            setToCountry={(country) => updateTransferDetails({ toCountry: country })}
            onNext={handleNext}
          />
        );
      case 2:
        return (
            <Step2Amount
                transferDetails={transferDetails}
                setTransferDetails={updateTransferDetails}
                onNext={handleNext}
                onBack={handleBack}
            />
        );
      case 3:
        return (
            <Step3Receiver
                transferDetails={transferDetails}
                setTransferDetails={updateTransferDetails}
                onNext={handleNext}
                onBack={handleBack}
            />
        );
      case 4:
        return (
            <Step4AIAnalysis
                onNext={handleNext}
                onBack={handleBack}
            />
        );
      case 5:
        return (
            <Step5Confirm
                transferDetails={transferDetails}
                onConfirm={handleConfirm}
                onBack={handleBack}
            />
        );
      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-12">
        <Stepper currentStep={step} steps={stepsConfig} />
        <div className="mt-10 bg-white p-8 rounded-xl shadow-lg">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {renderStep()}
        </div>
      </div>
      
      {showProgressModal && (
        <TransactionProgressModal 
          isOpen={showProgressModal}
          onClose={handleProgressModalClose}
          details={{
            amount: transferDetails.sendAmount,
            receiverName: transferDetails.receiver.fullName,
            quote: {
              rate: transferDetails.exchangeRate,
              fee: transferDetails.transferFee,
              feeSaved: aiAnalysis?.fraudScore ? 0 : transferDetails.transferFee * 0.2,
              estimatedDelivery: aiAnalysis?.estimatedDeliveryTime || 'Calculating...'
            }
          }}
        />
      )}
    </div>
  );
};

export default SendMoneyFlowPage;
