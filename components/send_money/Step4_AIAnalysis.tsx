
import React, { useState, useEffect } from 'react';

interface Step4AIAnalysisProps {
  onNext: () => void;
  onBack: () => void;
}

const analysisSteps = [
    'Analyzing transfer corridors',
    'Checking fraud risk score',
    'Verifying liquidity availability',
    'Optimizing route selection',
];

const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white bg-blue-600 rounded-full p-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-7 w-7 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const CircleIcon = () => <div className="h-7 w-7 bg-gray-300 rounded-full"></div>;


const Step4AIAnalysis: React.FC<Step4AIAnalysisProps> = ({ onNext, onBack }) => {
    const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
    const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentAnalysisStep(prev => {
                if (prev < analysisSteps.length) {
                    return prev + 1;
                } else {
                    clearInterval(timer);
                    setIsAnalysisComplete(true);
                    return prev;
                }
            });
        }, 1200);

        return () => clearInterval(timer);
    }, []);

    const renderProcessingView = () => (
        <>
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">AI Route Analysis</h2>
                <p className="mt-2 text-gray-600">Our AI is finding the best route for your transfer</p>
            </div>
            <div className="space-y-6">
                {analysisSteps.map((step, index) => (
                    <div key={step} className="flex items-center">
                         <div className="w-10">
                            {index < currentAnalysisStep ? <CheckCircleIcon/> : index === currentAnalysisStep ? <SpinnerIcon/> : <CircleIcon/>}
                        </div>
                        <div className="ml-4">
                            <p className="font-semibold text-lg text-gray-800">{step}</p>
                            <p className="text-sm">
                                {index < currentAnalysisStep ? <span className="text-green-600">Complete</span> : index === currentAnalysisStep ? <span className="text-blue-600">Processing...</span> : <span className="text-gray-500">Pending</span>}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

    const renderCompleteView = () => (
        <>
            <div className="text-center mb-10">
                <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">AI Analysis Complete</h2>
                <p className="mt-2 text-gray-600">We found the optimal route for your transfer</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-6 shadow-sm">
                 <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">AI Confidence Score</p>
                        <p className="text-5xl font-bold text-blue-600">98%</p>
                    </div>
                     <div className="p-3 bg-white rounded-full shadow-md"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></div>
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div className="bg-white p-3 rounded-lg border"> <span className="text-gray-500">Provider</span> <span className="font-bold float-right">Blockchain Network</span> </div>
                <div className="bg-white p-3 rounded-lg border"> <span className="text-gray-500">Risk Score</span> <span className="font-bold text-green-600 float-right">Low (2.1/10)</span> </div>
                <div className="bg-white p-3 rounded-lg border"> <span className="text-gray-500">Speed</span> <span className="font-bold text-green-600 float-right">Instant</span> </div>
                <div className="bg-white p-3 rounded-lg border"> <span className="text-gray-500">Liquidity</span> <span className="font-bold text-green-600 float-right">High</span> </div>
                <div className="bg-white p-3 rounded-lg border"> <span className="text-gray-500">Cost</span> <span className="font-bold text-blue-600 float-right">Lowest</span> </div>
                <div className="bg-green-100 p-3 rounded-lg border border-green-200"> <span className="text-green-800">You Save</span> <span className="font-bold text-green-800 float-right">$12.50</span> </div>
            </div>
            
            <div className="p-6 border rounded-lg bg-white">
                <h3 className="font-bold text-center mb-6">Optimal Route</h3>
                <div className="flex justify-between items-center">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg></div>
                        <p className="mt-2 font-semibold">UK Bank</p>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></div>
                        <p className="mt-2 font-semibold">Blockchain</p>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
                    <div className="text-center">
                         <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg></div>
                        <p className="mt-2 font-semibold">India Bank</p>
                    </div>
                </div>
            </div>
            
             <div className="flex justify-between items-center mt-12">
                <button onClick={onBack} className="flex items-center px-6 py-3 font-bold text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                    Back
                </button>
                <button
                    onClick={onNext}
                    className="flex items-center px-8 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
            </div>
        </>
    );

    return (
        <div className="w-full max-w-2xl mx-auto">
            {!isAnalysisComplete ? renderProcessingView() : renderCompleteView()}
        </div>
    );
};

export default Step4AIAnalysis;
