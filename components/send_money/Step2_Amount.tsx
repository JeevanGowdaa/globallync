
import React, { useState, useEffect, useCallback } from 'react';
import { TransferDetails } from '../../types';

interface Step2AmountProps {
  transferDetails: TransferDetails;
  setTransferDetails: (details: Partial<TransferDetails>) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2Amount: React.FC<Step2AmountProps> = ({
  transferDetails,
  setTransferDetails,
  onNext,
  onBack,
}) => {
  const [sendAmount, setSendAmount] = useState(transferDetails.sendAmount.toString());
  const [receiveAmount, setReceiveAmount] = useState(transferDetails.receiveAmount.toString());

  const exchangeRate = 82.4125;
  const transferFee = 2.99;

  const calculateReceive = useCallback((sendValue: string) => {
    const numericSend = parseFloat(sendValue);
    if (!isNaN(numericSend) && numericSend > 0) {
      setReceiveAmount((numericSend * exchangeRate).toFixed(2));
    } else {
      setReceiveAmount('');
    }
  }, [exchangeRate]);

  useEffect(() => {
    calculateReceive(sendAmount);
  }, [sendAmount, calculateReceive]);

  const handleSendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setSendAmount(value);
    }
  };

  const handleContinue = () => {
    const finalSendAmount = parseFloat(sendAmount) || 0;
    setTransferDetails({
      sendAmount: finalSendAmount,
      receiveAmount: finalSendAmount * exchangeRate,
      exchangeRate,
      transferFee,
      totalCost: finalSendAmount + transferFee,
    });
    onNext();
  };

  const setPresetAmount = (amount: number) => {
    setSendAmount(amount.toString());
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Enter Amount</h2>
        <p className="mt-2 text-gray-600">How much would you like to send?</p>
      </div>

      <div className="p-4 mb-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex justify-between items-center">
            <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                <span className="font-semibold text-green-800">Live Exchange Rate</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
        </div>
        <p className="text-center text-2xl font-bold text-green-700 mt-2">
            1 {transferDetails.fromCountry.currency} = {exchangeRate} {transferDetails.toCountry.currency}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-semibold text-gray-600">You send</label>
          <div className="relative mt-1">
            <input
              type="text"
              value={sendAmount}
              onChange={handleSendChange}
              className="w-full p-3 pl-4 pr-20 text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-4 font-bold text-gray-500">{transferDetails.fromCountry.currency}</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">Recipient gets</label>
           <div className="relative mt-1">
            <input
              type="text"
              readOnly
              value={receiveAmount}
              className="w-full p-3 pl-4 pr-20 text-2xl font-bold bg-gray-100 border border-gray-300 rounded-lg"
              placeholder="0.00"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-4 font-bold text-gray-500">{transferDetails.toCountry.currency}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-3 mt-4">
        {[100, 250, 500, 1000].map(amount => (
            <button key={amount} onClick={() => setPresetAmount(amount)} className="px-5 py-2 text-sm font-semibold bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                {amount}
            </button>
        ))}
      </div>

      <div className="mt-8 p-4 border-t">
        <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
                <span>Transfer fee</span>
                <span>{transferFee.toFixed(2)} {transferDetails.fromCountry.currency}</span>
            </div>
            <div className="flex justify-between">
                <span>Exchange rate</span>
                <span>{exchangeRate}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 pt-2 border-t">
                <span>Total cost</span>
                <span>{(parseFloat(sendAmount || '0') + transferFee).toFixed(2)} {transferDetails.fromCountry.currency}</span>
            </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-12">
        <button onClick={onBack} className="flex items-center px-6 py-3 font-bold text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!parseFloat(sendAmount) || parseFloat(sendAmount) <= 0}
          className="flex items-center px-8 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          Continue
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Step2Amount;
