
import React from 'react';
import { TransferDetails } from '../../types';

interface Step5ConfirmProps {
  transferDetails: TransferDetails;
  onConfirm: () => void;
  onBack: () => void;
}

const Step5Confirm: React.FC<Step5ConfirmProps> = ({ transferDetails, onConfirm, onBack }) => {
  const { fromCountry, toCountry, sendAmount, receiveAmount, receiver, deliveryMethod, aiAnalysis, transferFee, exchangeRate, totalCost } = transferDetails;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Confirm Transfer</h2>
        <p className="mt-2 text-gray-600">Please review the details of your transfer before confirming.</p>
      </div>

      <div className="p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-8 shadow-sm">
        <p className="text-gray-600">{receiver.fullName} will receive</p>
        <p className="text-4xl font-bold text-blue-800 my-1">
          {receiveAmount.toLocaleString('en-IN', { style: 'currency', currency: toCountry.currency, minimumFractionDigits: 2 })}
        </p>
        <p className="font-semibold text-gray-700">
          You are sending {sendAmount.toLocaleString('en-GB', { style: 'currency', currency: fromCountry.currency, minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4">Transfer Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">From</span><span className="font-semibold">{fromCountry.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">To</span><span className="font-semibold">{toCountry.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="font-semibold">{deliveryMethod}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Speed</span><span className="font-semibold text-green-600">{aiAnalysis.speed}</span></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4">Recipient</h3>
           <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-semibold">{receiver.fullName}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-semibold">{receiver.email}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-semibold">{receiver.phone}</span></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border mt-8">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4">Cost Breakdown</h3>
        <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Send amount</span><span className="font-semibold">{sendAmount.toFixed(2)} {fromCountry.currency}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Transfer fee</span><span className="font-semibold">{transferFee.toFixed(2)} {fromCountry.currency}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Exchange rate</span><span className="font-semibold">{exchangeRate.toFixed(4)}</span></div>
            <div className="flex justify-between text-green-600"><span className="font-semibold">You save with AI route</span><span className="font-bold">${aiAnalysis.savings.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-gray-800 pt-3 border-t"><span >Total cost</span><span>{totalCost.toFixed(2)} {fromCountry.currency}</span></div>
        </div>
      </div>


      <div className="flex justify-between items-center mt-12">
        <button onClick={onBack} className="flex items-center px-6 py-3 font-bold text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
          Back
        </button>
        <button
          onClick={onConfirm}
          className="px-8 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Confirm & Send
        </button>
      </div>
    </div>
  );
};

export default Step5Confirm;
