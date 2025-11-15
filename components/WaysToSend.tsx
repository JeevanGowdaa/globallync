
import React from 'react';

const WebsiteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" />
    </svg>
);

const AppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);


const WaysToSend: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
                    Easy ways to send money with GlobalRemit
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
                    <div>
                        <div className="flex justify-center mb-4">
                            <WebsiteIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Website</h3>
                        <a href="#" className="text-purple-600 underline">Sign up on GlobalRemit.com</a>
                    </div>
                    <div>
                        <div className="flex justify-center mb-4">
                            <AppIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">App</h3>
                        <p className="text-gray-600">
                            Download the app on <a href="#" className="text-purple-600 underline">Google Play</a> or <a href="#" className="text-purple-600 underline">App Store</a>
                        </p>
                    </div>
                    <div>
                        <div className="flex justify-center mb-4">
                            <WhatsAppIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">WhatsApp</h3>
                         <a href="#" className="text-purple-600 underline">Start your transfer in WhatsApp</a>
                    </div>
                </div>
                 <p className="text-center text-xs text-gray-500 mt-12 max-w-4xl mx-auto">
                    WhatsApp is currently available for transfers from the U.S., Canada, Spain and the United Kingdom to Mexico, Colombia, the Dominican Republic, El Salvador, Guatemala, Peru, Nicaragua, Honduras, Ecuador, India, Pakistan, Nepal, Venezuela, and the Philippines.
                </p>
            </div>
        </section>
    );
};

export default WaysToSend;