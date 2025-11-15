
import React from 'react';
import Header from '../components/Header';
import LandingSendMoneyForm from '../components/LandingSendMoneyForm';
import TrustFeatures from '../components/TrustFeatures';
import AppDownload from '../components/AppDownload';
import PartnerBanks from '../components/PartnerBanks';
import WaysToSend from '../components/WaysToSend';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <div className="relative bg-cyan-50 pt-12 pb-20 lg:pt-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap -mx-4">
              <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
                <div className="lg:max-w-md">
                  <span className="inline-block py-1 px-3 mb-6 text-xs font-semibold text-teal-600 bg-teal-100 rounded-full">
                    NEW CUSTOMER OFFER
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
                    Send money to India from the United States
                  </h1>
                  <p className="text-lg text-gray-600 mb-8">
                    Get a special rate and no fees on your first transfer. Join millions of customers who trust GlobalRemit.
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-1/2 px-4">
                <div className="relative">
                  {/* Decorative image elements */}
                  <div className="hidden lg:block absolute w-48 h-48 bg-yellow-300 rounded-full -top-12 -right-12"></div>
                  <div className="hidden lg:block absolute w-32 h-32 bg-rose-200 rounded-full top-24 -right-24"></div>
                   <div className="hidden lg:block absolute w-60 h-60 bg-teal-200 rounded-lg top-32 right-0 transform rotate-12"></div>
                  
                  <LandingSendMoneyForm />
                </div>
              </div>
            </div>
          </div>
        </div>
        <TrustFeatures />
        <AppDownload />
        <PartnerBanks />
        <WaysToSend />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;