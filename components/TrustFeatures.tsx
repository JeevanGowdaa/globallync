
import React from 'react';

const PeaceOfMindIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
    </svg>
);

const GreatValueIcon = () => (
    <div className="h-10 w-10 text-teal-500 flex items-center justify-center">
        <svg viewBox="0 0 40 40" fill="currentColor" className="h-full w-full">
            <rect x="5" y="12" width="30" height="16" rx="3"></rect>
            <circle cx="28" cy="20" r="3"></circle>
        </svg>
    </div>
);

const DeliveryGuaranteedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
);


const TrustFeatures: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
                    Find out why millions worldwide trust GlobalRemit
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div>
                        <div className="flex justify-center mb-4">
                           <PeaceOfMindIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Peace of Mind</h3>
                        <p className="text-gray-600">
                            You and your recipients can track your transfer every step of the way.
                        </p>
                    </div>
                    <div>
                        <div className="flex justify-center mb-4">
                           <GreatValueIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Great Value</h3>
                        <p className="text-gray-600">
                            Enjoy consistently great rates and no hidden fees. Whether using the app or online, you'll see <a href="#" className="text-teal-600 underline">all fees</a> before sending.
                        </p>
                    </div>
                    <div>
                        <div className="flex justify-center mb-4">
                            <DeliveryGuaranteedIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Delivery Time Guaranteed</h3>
                        <p className="text-gray-600">
                            You can trust that transfers will be delivered on time or we'll refund your fees.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustFeatures;