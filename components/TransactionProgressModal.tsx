import React, { useState, useEffect } from 'react';
import { Quote } from '../types';

interface TransactionProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    details: {
        amount: number;
        receiverName: string;
        quote: Quote;
    };
}

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SpinnerIcon = () => (
    <svg className="w-6 h-6 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const DotIcon = () => (
    <div className="flex items-center justify-center w-6 h-6">
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
    </div>
);

const steps = [
    'Initiating Transfer',
    'Analyzing with AI Engine',
    'Checking Liquidity Pools',
    'Processing with Blockchain',
    'Transfer Successful',
];

const TransactionProgressModal: React.FC<TransactionProgressModalProps> = ({ isOpen, onClose, details }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [blockchainHash, setBlockchainHash] = useState('');

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setBlockchainHash('');
            const interval = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev >= steps.length - 1) {
                        clearInterval(interval);
                        setBlockchainHash(`0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1500);

            return () => clearInterval(interval);
        }
    }, [isOpen]);
    
    if (!isOpen) return null;

    const isComplete = currentStep === steps.length - 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" aria-modal="true" role="dialog">
            <div className="w-full max-w-md m-4 bg-white rounded-lg shadow-xl transform transition-all">
                <div className="p-6">
                    <h3 className="text-2xl font-bold text-center text-gray-800">
                        {isComplete ? 'Transfer Complete!' : 'Transaction in Progress'}
                    </h3>
                    <p className="mt-2 text-center text-gray-500">
                        Sending <strong>£{details.amount.toFixed(2)}</strong> to <strong>{details.receiverName}</strong>
                    </p>

                    <div className="mt-8 ml-4 space-y-0">
                        {steps.map((step, index) => (
                            <div key={index} className="flex">
                                <div className="flex flex-col items-center mr-4">
                                    {index < currentStep ? <CheckCircleIcon /> : (index === currentStep ? <SpinnerIcon /> : <DotIcon />)}
                                    {index < steps.length - 1 && (
                                        <div className={`w-px h-10 mt-1 ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    )}
                                </div>
                                <div className={`pt-0.5 pb-6 ${index > currentStep ? 'text-gray-400' : 'text-gray-800'}`}>
                                    <p className="font-semibold">{step}</p>
                                    {isComplete && step === 'Transfer Successful' && (
                                        <div className="w-full p-4 mt-4 text-sm space-y-2 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Amount Received:</span>
                                                <span className="font-bold text-gray-900">₹{(details.amount * details.quote.rate).toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Fee Saved w/ AI:</span>
                                                <span className="font-bold text-green-600">£{details.quote.feeSaved.toFixed(2)}</span>
                                            </div>
                                             <div className="flex flex-col">
                                                <span className="text-gray-600">Blockchain Hash:</span>
                                                <span className="font-mono text-xs text-gray-500 break-all">{blockchainHash}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="px-6 py-4 text-right bg-gray-50 rounded-b-lg">
                    <button 
                        onClick={onClose} 
                        disabled={!isComplete}
                        className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionProgressModal;