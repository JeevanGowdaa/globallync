import { useState, useEffect } from 'react';
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

// Complete money flow steps
const steps = [
    { name: 'Initiating Transfer', description: 'Setting up your transaction' },
    { name: 'Analyzing with AI Engine', description: 'Calculating best route & fraud check' },
    { name: 'Checking Liquidity Pools', description: 'Debiting sender pool and crediting receiver pool' },
    { name: 'Processing with Blockchain', description: 'Settling transaction on smart contract' },
    { name: 'Transfer Successful', description: 'Transaction complete!' },
];

const TransactionProgressModal = ({ isOpen, onClose, details }: TransactionProgressModalProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [blockchainHash, setBlockchainHash] = useState('');
    const [stepTimestamps, setStepTimestamps] = useState<Record<number, string>>({});

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setBlockchainHash('');
            setStepTimestamps({});
            
            const interval = setInterval(() => {
                setCurrentStep(prev => {
                    const newStep = prev + 1;
                    
                    // Record timestamp for each step
                    setStepTimestamps(prev => ({
                        ...prev,
                        [newStep - 1]: new Date().toLocaleTimeString()
                    }));

                    if (newStep >= steps.length) {
                        clearInterval(interval);
                        // Generate mock blockchain hash
                        setBlockchainHash(`0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`);
                        return steps.length - 1;
                    }
                    return newStep;
                });
            }, 1500);

            return () => clearInterval(interval);
        }
    }, [isOpen]);
    
    if (!isOpen) return null;

    const isComplete = currentStep === steps.length - 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" aria-modal="true" role="dialog">
            <div className="w-full max-w-2xl m-4 bg-white rounded-lg shadow-xl transform transition-all">
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-center text-gray-800">
                        {isComplete ? '✓ Transfer Complete!' : '⏳ Transaction in Progress'}
                    </h3>
                    <p className="mt-2 text-center text-gray-600">
                        Sending <strong className="text-blue-600">${details.amount.toFixed(2)}</strong> to <strong className="text-blue-600">{details.receiverName}</strong>
                    </p>

                    {/* Flow Timeline */}
                    <div className="mt-8 ml-4 space-y-0">
                        {steps.map((step, index) => (
                            <div key={index} className="flex pb-4">
                                <div className="flex flex-col items-center mr-4">
                                    {index < currentStep ? <CheckCircleIcon /> : (index === currentStep ? <SpinnerIcon /> : <DotIcon />)}
                                    {index < steps.length - 1 && (
                                        <div className={`w-px h-16 mt-1 ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    )}
                                </div>
                                <div className={`pt-0.5 flex-1 ${index > currentStep ? 'text-gray-400' : 'text-gray-800'}`}>
                                    <p className="font-semibold text-lg">{step.name}</p>
                                    <p className="text-sm text-gray-500">{step.description}</p>
                                    {stepTimestamps[index] && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            ✓ Completed at {stepTimestamps[index]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary on completion */}
                    {isComplete && (
                        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <h4 className="font-bold text-green-900 mb-4">Transaction Summary</h4>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Amount Sent:</span>
                                    <span className="font-bold text-gray-900">${details.amount.toFixed(2)}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Exchange Rate:</span>
                                    <span className="font-bold text-gray-900">1 = {details.quote.rate.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-700">Amount Received:</span>
                                    <span className="font-bold text-green-600">₹{(details.amount * details.quote.rate).toLocaleString('en-IN')}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-700">Transfer Fee:</span>
                                    <span className="font-bold text-gray-900">${details.quote.fee.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between bg-white px-3 py-2 rounded">
                                    <span className="text-gray-700">Fee Saved w/ AI Engine:</span>
                                    <span className="font-bold text-green-600">+${details.quote.feeSaved.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-700">Estimated Delivery:</span>
                                    <span className="font-bold text-gray-900">{details.quote.estimatedDelivery}</span>
                                </div>

                                <div className="border-t border-green-300 my-3 pt-3">
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-700">Blockchain Hash:</span>
                                        <div className="text-right">
                                            <p className="font-mono text-xs text-gray-600 break-all bg-white px-2 py-1 rounded border border-gray-300">
                                                {blockchainHash}
                                            </p>
                                            <a 
                                                href={`https://mumbai.polygonscan.com/tx/${blockchainHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 text-xs mt-1 inline-block"
                                            >
                                                View on PolygonScan ↗
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-8 py-4 text-right bg-gray-50 rounded-b-lg border-t border-gray-200">
                    <button 
                        onClick={onClose} 
                        disabled={!isComplete}
                        className="px-8 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all"
                    >
                        {isComplete ? '✓ Done' : 'Processing...'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionProgressModal;