
import React, { useState } from 'react';
import { TransferDetails } from '../../types';

interface Step3ReceiverProps {
    transferDetails: TransferDetails;
    setTransferDetails: (details: Partial<TransferDetails>) => void;
    onNext: () => void;
    onBack: () => void;
}

const DeliveryMethodCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    duration: string;
    selected: boolean;
    onSelect: () => void;
}> = ({ icon, title, duration, selected, onSelect }) => (
    <button
        onClick={onSelect}
        className={`w-full p-4 border rounded-lg text-center transition-all duration-200 ${
            selected ? 'border-blue-600 ring-2 ring-blue-200 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
    >
        <div className="flex flex-col items-center">
            <div className="mb-2 text-gray-500">{icon}</div>
            <p className="font-bold text-gray-800">{title}</p>
            <p className="text-sm text-gray-500">{duration}</p>
        </div>
    </button>
);

const Step3Receiver: React.FC<Step3ReceiverProps> = ({ transferDetails, setTransferDetails, onNext, onBack }) => {
    const [deliveryMethod, setDeliveryMethod] = useState(transferDetails.deliveryMethod);
    const [receiver, setReceiver] = useState(transferDetails.receiver);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setReceiver(prev => ({ ...prev, [name]: value }));
    };

    const handleContinue = () => {
        setTransferDetails({ deliveryMethod, receiver });
        onNext();
    };

    const isFormValid = receiver.fullName && receiver.email && receiver.phone && receiver.address && deliveryMethod;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">Receiver Details</h2>
                <p className="mt-2 text-gray-600">Enter the recipient's information</p>
            </div>

            <h3 className="mb-4 font-semibold text-gray-700">Delivery Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DeliveryMethodCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                    title="Bank Deposit"
                    duration="1-3 business days"
                    selected={deliveryMethod === 'Bank Deposit'}
                    onSelect={() => setDeliveryMethod('Bank Deposit')}
                />
                <DeliveryMethodCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                    title="Cash Pickup"
                    duration="Within minutes"
                    selected={deliveryMethod === 'Cash Pickup'}
                    onSelect={() => setDeliveryMethod('Cash Pickup')}
                />
                <DeliveryMethodCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                    title="Mobile Wallet"
                    duration="Within minutes"
                    selected={deliveryMethod === 'Mobile Wallet'}
                    onSelect={() => setDeliveryMethod('Mobile Wallet')}
                />
            </div>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" name="fullName" id="fullName" value={receiver.fullName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Recipient's full name" />
                </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" name="email" id="email" value={receiver.email} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="recipient@email.com" />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" name="phone" id="phone" value={receiver.phone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="+91 98765 43210" />
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input type="text" name="address" id="address" value={receiver.address} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Complete address" />
                </div>
            </div>

            <div className="flex justify-between items-center mt-12">
                <button onClick={onBack} className="flex items-center px-6 py-3 font-bold text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                    Back
                </button>
                <button
                    onClick={handleContinue}
                    disabled={!isFormValid}
                    className="flex items-center px-8 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
            </div>
        </div>
    );
};

export default Step3Receiver;
