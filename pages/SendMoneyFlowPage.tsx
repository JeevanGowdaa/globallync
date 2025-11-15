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
import api from '../services/api';

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
  const navigate = useNavigate();

  const updateTransferDetails = (details: Partial<TransferDetails>) => {
    setTransferDetails(prev => ({ ...prev, ...details }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleConfirm = async () => {
    try {
      // Map frontend state to a payload the backend expects
      const payload = {
        amount: transferDetails.sendAmount,
        type: 'SEND',
        status: 'Pending',
        // Assuming backend can take the rich details object
        details: transferDetails
      };
      
      await api.post('/api/transactions/create', payload);

      // On success, navigate to dashboard.
      // A success message could be passed via state if needed.
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create transaction:', error);
      // In a real app, you would show an error message to the user
      alert('There was an error submitting your transfer. Please try again.');
    }
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
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default SendMoneyFlowPage;
