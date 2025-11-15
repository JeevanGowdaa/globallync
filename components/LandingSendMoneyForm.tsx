
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const USFlag: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 72 72" className="rounded-full">
        <path fill="#eee" d="M0 0h72v72H0z"/>
        <path fill="#d22f27" d="M0 6v6h72V6Zm0 12v6h72v-6Zm0 12v6h72v-6Zm0 12v6h72v-6Zm0 12v6h72v-6Z"/>
        <path fill="#192f5d" d="M0 0h36v36H0z"/>
        <g fill="#fff"><path d="M7.2 4.8 6 6.9l-1.2-2.1L3.6 6l1.2 2.1L6 10.2l1.2-2.1 1.2-2.1-1.2-2.1z m9 0L15 6.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L24 6.9l-1.2-2.1L21.6 6l1.2 2.1L24 10.2l1.2-2.1 1.2-2.1-1.2-2.1z"/><path d="M11.7 10.8 10.5 12.9l-1.2-2.1L8.1 12l1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L19.5 12.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L28.5 12.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z"/><path d="M7.2 16.8 6 18.9l-1.2-2.1L3.6 18l1.2 2.1L6 22.2l1.2-2.1 1.2-2.1-1.2-2.1z m9 0L15 18.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L24 18.9l-1.2-2.1L21.6 18l1.2 2.1L24 22.2l1.2-2.1 1.2-2.1-1.2-2.1z"/><path d="M11.7 22.8 10.5 24.9l-1.2-2.1L8.1 24l1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L19.5 24.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L28.5 24.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z"/><path d="M7.2 28.8 6 30.9l-1.2-2.1L3.6 30l1.2 2.1L6 34.2l1.2-2.1 1.2-2.1-1.2-2.1z m9 0L15 30.9l-1.2-2.1-1.2 2.1 1.2 2.1 1.2 2.1 1.2-2.1 1.2-2.1-1.2-2.1z m9 0L24 30.9l-1.2-2.1L21.6 30l1.2 2.1L24 34.2l1.2-2.1 1.2-2.1-1.2-2.1z"/></g>
    </svg>
);

const IndiaFlag: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 72 72" className="rounded-full">
        <path fill="#eee" d="M0 0h72v72H0z"/>
        <path fill="#f15b25" d="M0 0h72v24H0z"/>
        <path fill="#128807" d="M0 48h72v24H0z"/>
        <circle cx="36" cy="36" r="8" fill="none" stroke="#192f5d" strokeWidth="2"/>
        <g stroke="#192f5d" strokeWidth="1.5" strokeLinecap="round">{Array.from({length: 24}).map((_, i) => (<path key={i} d={`m36 36 0-8`} transform={`rotate(${i * 15} 36 36)`}/>))}</g>
    </svg>
);

const LandingSendMoneyForm: React.FC = () => {
    const [sendAmount, setSendAmount] = useState('100.00');
    const [receiveAmount, setReceiveAmount] = useState('');
    const navigate = useNavigate();
    const exchangeRate = 88.84;
    const fee = 3.99;

    const calculateReceiveAmount = (send: string) => {
        const sendValue = parseFloat(send);
        if (!isNaN(sendValue) && sendValue > 0) {
            setReceiveAmount((sendValue * exchangeRate).toFixed(2));
        } else {
            setReceiveAmount('');
        }
    };

    useEffect(() => {
        calculateReceiveAmount(sendAmount);
    }, [sendAmount]);

    const handleSendAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSendAmount(e.target.value);
    };

    const handlePresetAmountClick = (amount: number) => {
        setSendAmount(amount.toFixed(2));
    };

    return (
        <div className="relative z-10 p-8 bg-white rounded-lg shadow-xl">
            <div className="mb-6">
                <label className="text-sm font-semibold text-gray-600">You send</label>
                <div className="flex items-center mt-1 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                    <input
                        type="text"
                        value={sendAmount}
                        onChange={handleSendAmountChange}
                        className="w-full p-3 text-2xl font-bold bg-transparent border-none focus:ring-0"
                        placeholder="100.00"
                    />
                    <div className="flex items-center pr-3 space-x-2">
                        <USFlag />
                        <span className="font-bold text-gray-800">USD</span>
                    </div>
                </div>
            </div>

            <div className="mb-6 text-center">
                <span className="text-sm text-gray-500">Or select an amount</span>
                <div className="flex justify-center mt-2 space-x-2">
                    {[200, 500, 1000].map(amount => (
                         <button key={amount} onClick={() => handlePresetAmountClick(amount)} className="px-4 py-2 text-sm font-semibold bg-gray-100 rounded-full hover:bg-gray-200">
                            ${amount.toLocaleString()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                 <label className="text-sm font-semibold text-gray-600">They receive</label>
                <div className="flex items-center mt-1 bg-gray-50 border border-gray-300 rounded-md">
                     <input
                        type="text"
                        value={receiveAmount ? parseFloat(receiveAmount).toLocaleString('en-IN') : ''}
                        readOnly
                        className="w-full p-3 text-2xl font-bold text-gray-700 bg-transparent border-none focus:ring-0"
                        placeholder="8,884.00"
                    />
                    <div className="flex items-center pr-3 space-x-2">
                        <IndiaFlag />
                        <span className="font-bold text-gray-800">INR</span>
                    </div>
                </div>
            </div>
            
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-teal-600 font-bold">Special rate</span>
                    <span className="font-semibold text-gray-800">1 USD = {exchangeRate} INR</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Fee</span>
                    <span className="font-semibold text-gray-800">{fee.toFixed(2)} USD</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-green-600">-{fee.toFixed(2)} USD</span>
                </div>
                 <div className="pt-2 mt-2 border-t flex justify-between">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-gray-800">{parseFloat(sendAmount || '0').toFixed(2)} USD</span>
                </div>
            </div>
            
            <button onClick={() => navigate('/login')} className="w-full px-4 py-3 mt-8 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Send Now
            </button>
        </div>
    );
};

export default LandingSendMoneyForm;
