
import React from 'react';

const rates = [
    { from: 'GB', to: 'IN', fromCurrency: 'GBP', toCurrency: 'INR', rate: '105.25', change: 0.50, trend: 'up' },
    { from: 'GB', to: 'US', fromCurrency: 'GBP', toCurrency: 'USD', rate: '1.27', change: 0.20, trend: 'down' },
    { from: 'GB', to: 'EU', fromCurrency: 'GBP', toCurrency: 'EUR', rate: '1.17', change: 0.30, trend: 'up' },
    { from: 'GB', to: 'AU', fromCurrency: 'GBP', toCurrency: 'AUD', rate: '1.92', change: 0.15, trend: 'up' },
];

const TrendArrow: React.FC<{ trend: 'up' | 'down' }> = ({ trend }) => {
    const isUp = trend === 'up';
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isUp ? 'text-green-500' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isUp ? "M5 10l7-7m0 0l7 7m-7-7v12" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
        </svg>
    )
};


const LiveExchangeRates: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Live Exchange Rates</h2>
                <span className="text-xs text-gray-500">Updated 1:12:33 PM</span>
            </div>
            <div className="space-y-4">
                {rates.map(rate => (
                    <div key={rate.to} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="font-bold text-gray-500 p-2 bg-gray-100 rounded-md">{rate.to}</div>
                            <div>
                                <p className="font-semibold text-gray-800">{rate.fromCurrency} → {rate.toCurrency}</p>
                                <p className="text-sm text-gray-500">1 {rate.fromCurrency}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-gray-800">{rate.rate}</p>
                            <div className="flex items-center justify-end space-x-1">
                                <TrendArrow trend={rate.trend as 'up' | 'down'} />
                                <span className={`text-sm font-semibold ${rate.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                    {rate.change.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LiveExchangeRates;
