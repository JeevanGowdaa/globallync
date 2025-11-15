
import React from 'react';

const FeeComparison: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Fee Comparison</h2>
            <p className="text-sm text-gray-500 mb-4">See how much you save compared to other services</p>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                <div>
                    <p className="text-sm text-gray-500">Sending Amount</p>
                    <p className="text-lg font-bold text-gray-800">£100</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-green-600">You Save Up To</p>
                    <p className="text-lg font-bold text-green-600">₹2701.75</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Our Service */}
                <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50 relative">
                    <div className="absolute top-2 right-2 px-2 py-0.5 text-xs font-bold text-blue-800 bg-blue-200 rounded-full">★ Best Deal</div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg text-gray-800">Our Service</h3>
                        <p className="font-bold text-lg text-blue-600">₹10426.75</p>
                    </div>
                    <p className="text-sm font-semibold text-green-600 mb-3">Instant</p>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Fee: <span className="font-semibold text-gray-800">£0.99</span></span>
                        <span>Rate: <span className="font-semibold text-gray-800">105.25</span></span>
                    </div>
                </div>

                {/* Western Union */}
                <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-700">Western Union</h3>
                        <p className="font-semibold text-gray-700">₹9927.55</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">1-2 days</p>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Fee: <span className="font-semibold text-gray-800">£4.99</span></span>
                        <span>Rate: <span className="font-semibold text-gray-800">104.50</span></span>
                    </div>
                    <div className="text-right text-sm font-semibold text-red-500">
                        You lose with this service -₹499.20
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FeeComparison;
