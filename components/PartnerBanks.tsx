
import React from 'react';

const partnerBanks = [
    { logo: <span className="text-2xl font-bold" style={{color: '#5f259f'}}>Axis Bank</span>, linkName: 'Axis Bank' },
    { logo: <span className="text-2xl font-bold">UPI</span>, linkName: 'UPI' },
    { logo: <span className="text-2xl font-bold" style={{color: '#004c94'}}>HDFC BANK</span>, linkName: 'HDFC Bank' },
    { logo: <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">SBI</div>, linkName: 'State Bank of India (SBI)' },
    { logo: <span className="text-2xl font-bold" style={{color: '#e35205'}}>Bank of Baroda</span>, linkName: 'Bank of Baroda' },
];

const BankCard: React.FC<{ logo: React.ReactNode; linkName: string }> = ({ logo, linkName }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center flex flex-col justify-between items-center h-full">
        <div className="h-16 flex items-center justify-center">
            {logo}
        </div>
        <a href="#" className="mt-4 text-sm text-blue-600 font-semibold hover:underline">
            {linkName} &gt;
        </a>
    </div>
);


const PartnerBanks: React.FC = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Where to send money in India with GlobalRemit
                </h2>
                <p className="max-w-3xl mx-auto text-gray-600 mb-12">
                    Cash pickup, bank deposit, mobile wallet, and more delivery options with our trusted network in India. Click your preferred provider to learn more.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
                   {partnerBanks.map((bank, index) => (
                       <BankCard key={index} logo={bank.logo} linkName={bank.linkName} />
                   ))}
                </div>
                <button className="mt-12 px-8 py-3 bg-slate-700 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors flex items-center mx-auto">
                    View more 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default PartnerBanks;