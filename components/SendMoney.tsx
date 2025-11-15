import React, { useState } from 'react';
import { Quote } from '../types';
import TransactionProgressModal from './TransactionProgressModal';

// Props remain the same to avoid breaking DashboardPage
interface SendMoneyProps {
    onTransferSuccess: (details: { amount: number; receiverName: string; quote: Quote }) => void;
}

// Inline SVGs for flags
const USFlag: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 72 72" className="rounded-full">
        <path fill="#eee" d="M0 0h72v72H0z"/>
        <path fill="#d22f27" d="M0 6v6h72V6Zm0 12v6h72v-6Zm0 12v6h72v-6Zm0 12v6h72v-6Zm0 12v6h72v-6Z"/>
        <path fill="#192f5d" d="M0 0h36v36H0z"/>
        <g fill="#fff">
            <path d="M7.2 4.8 6 6.9l-1.2-2.1L3.6 6l1.2 2.1L6 10.2l1.2-2.1 1.2-2.1-1.2-2.1z m9 0L15 6.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L24 6.9l-1.2-2.1L21.6 6l1.2 2.1L24 10.2l1.2-2.1 1.2-2.1-1.2-2.1z"/>
            <path d="M11.7 10.8 10.5 12.9l-1.2-2.1L8.1 12l1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L19.5 12.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L28.5 12.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z"/>
            <path d="M7.2 16.8 6 18.9l-1.2-2.1L3.6 18l1.2 2.1L6 22.2l1.2-2.1 1.2-2.1-1.2-2.1z m9 0L15 18.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L24 18.9l-1.2-2.1L21.6 18l1.2 2.1L24 22.2l1.2-2.1 1.2-2.1-1.2-2.1z" />
            <path d="M11.7 22.8 10.5 24.9l-1.2-2.1L8.1 24l1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L19.5 24.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L28.5 24.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z"/>
            <path d="M7.2 28.8 6 30.9l-1.2-2.1L3.6 30l1.2 2.1L6 34.2l1.2-2.1 1.2-2.1-1.2-2.1z m9 0L15 30.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L24 30.9l-1.2-2.1L21.6 30l1.2 2.1L24 34.2l1.2-2.1 1.2-2.1-1.2-2.1z"/>
        </g>
    </svg>
);

const IndiaFlag: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 72 72" className="rounded-full">
        <path fill="#eee" d="M0 0h72v72H0z"/>
        <path fill="#f15b25" d="M0 0h72v24H0z"/>
        <path fill="#128807" d="M0 48h72v24H0z"/>
        <circle cx="36" cy="36" r="8" fill="none" stroke="#192f5d" strokeWidth="2"/>
        <g stroke="#192f5d" strokeWidth="1.5" strokeLinecap="round">
            {Array.from({length: 24}).map((_, i) => (
                <path key={i} d={`m36 36 0-8`} transform={`rotate(${i * 15} 36 36)`}/>
            ))}
        </g>
    </svg>
);


const SendMoney: React.FC<SendMoneyProps> = ({ onTransferSuccess }) => {
    const [sendAmount, setSendAmount] = useState('1.13');
    const [receiveAmount, setReceiveAmount] = useState('100');
    const [paymentMethod, setPaymentMethod] = useState('debit');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const exchangeRate = 88.84;

    const handleSendAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setSendAmount(value);
            if (value && !isNaN(parseFloat(value))) {
                setReceiveAmount((parseFloat(value) * exchangeRate).toFixed(2));
            } else {
                setReceiveAmount('');
            }
        }
    };

    const handleReceiveAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setReceiveAmount(value);
            if (value && !isNaN(parseFloat(value))) {
                setSendAmount((parseFloat(value) / exchangeRate).toFixed(2));
            } else {
                setSendAmount('');
            }
        }
    };
    
    const createQuote = (): Quote => ({
        rate: exchangeRate,
        fee: 1.13, // Fee is the same in this mock
        feeSaved: 5.20, // Mock value for fee saved
        estimatedDelivery: paymentMethod === 'debit' ? 'Instantly' : '3-6 days'
    });

    const handleContinue = async () => {
        setIsLoading(true);
        await new Promise(res => setTimeout(res, 500));
        setIsModalOpen(true);
        setIsLoading(false);
    };
    
    const handleModalClose = () => {
        setIsModalOpen(false);
        onTransferSuccess({
            amount: parseFloat(sendAmount),
            receiverName: 'Priya Patel', // Placeholder name for compatibility
            quote: createQuote(),
        });
        setSendAmount('1.13');
        setReceiveAmount('100');
        setPaymentMethod('debit');
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between p-4">
                    <div>
                        <label htmlFor="send-amount" className="text-sm text-gray-500">You send</label>
                        <input
                            id="send-amount"
                            type="text"
                            inputMode="decimal"
                            value={sendAmount}
                            onChange={handleSendAmountChange}
                            className="w-full p-0 text-2xl font-bold bg-transparent border-none focus:ring-0"
                            placeholder="0.00"
                        />
                    </div>
                    <div className="flex items-center flex-shrink-0 space-x-2">
                        <USFlag />
                        <span className="font-semibold text-gray-800">USD</span>
                    </div>
                </div>
                <div className="border-t border-gray-200"></div>
                <div className="flex items-center justify-between p-4">
                    <div>
                        <label htmlFor="receive-amount" className="text-sm text-gray-500">They receive</label>
                        <input
                            id="receive-amount"
                            type="text"
                            inputMode="decimal"
                            value={receiveAmount}
                            onChange={handleReceiveAmountChange}
                            className="w-full p-0 text-2xl font-bold bg-transparent border-none focus:ring-0"
                            placeholder="0.00"
                        />
                    </div>
                    <div className="flex items-center flex-shrink-0 space-x-2">
                        <IndiaFlag />
                        <span className="font-semibold text-gray-800">INR</span>
                    </div>
                </div>
            </div>

            <p className="mt-2 text-sm font-semibold text-center text-green-600">
                1 USD = <a href="#" className="underline">{exchangeRate} INR</a>
            </p>

            <div className="flex items-center p-3 mt-4 bg-green-50 rounded-lg text-green-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="flex-1 text-sm font-semibold">Promo exchange rate applied</span>
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            </div>

            <h3 className="mt-6 mb-4 text-lg font-bold text-gray-800">Select payment method</h3>
            
            <div className="space-y-4">
                <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'debit' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'}`}
                    onClick={() => setPaymentMethod('debit')} role="radio" aria-checked={paymentMethod === 'debit'} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setPaymentMethod('debit')}>
                    <div className="flex items-start">
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-md">
                             <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <div className="flex-grow ml-4">
                             <div className="flex items-center">
                                <span className="px-2 py-0.5 text-xs font-bold text-blue-800 bg-blue-200 rounded-full">EXPRESS</span>
                            </div>
                            <p className="font-bold text-gray-800">Debit card</p>
                            <p className="text-sm text-gray-500">Delivers instantly</p>
                        </div>
                         <p className="ml-2 font-semibold text-gray-800">{sendAmount || '0.00'} USD</p>
                    </div>
                </div>

                 <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'}`}
                    onClick={() => setPaymentMethod('bank')} role="radio" aria-checked={paymentMethod === 'bank'} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setPaymentMethod('bank')}>
                     <div className="flex items-start">
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-grow ml-4">
                            <p className="font-bold text-gray-800">Bank account</p>
                            <p className="text-sm text-gray-500">Delivers in 3 to 6 days</p>
                        </div>
                        <p className="ml-2 font-semibold text-gray-800">{sendAmount || '0.00'} USD</p>
                    </div>
                </div>
            </div>

            <button onClick={handleContinue} disabled={isLoading || !sendAmount || !receiveAmount} className="flex items-center justify-center w-full px-4 py-3 mt-8 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
                {isLoading && (
                    <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {isLoading ? 'Processing...' : 'Continue'}
            </button>
            
            {isModalOpen && (
                <TransactionProgressModal 
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    details={{
                        amount: parseFloat(sendAmount),
                        receiverName: 'Priya Patel',
                        quote: createQuote()
                    }}
                />
            )}
        </div>
    );
};

export default SendMoney;
