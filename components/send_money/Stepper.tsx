
import React from 'react';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const StepIcon: React.FC<{ step: number, currentStep: number, icon: React.ReactNode }> = ({ step, currentStep, icon }) => {
    const isCompleted = step < currentStep;
    const isActive = step === currentStep;

    const baseClasses = "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300";
    let statusClasses = "bg-gray-300 text-gray-500";
    if (isActive) {
        statusClasses = "bg-blue-600 text-white shadow-lg";
    } else if (isCompleted) {
        statusClasses = "bg-blue-600 text-white";
    }

    return (
        <div className={`${baseClasses} ${statusClasses}`}>
            {isCompleted ? <CheckIcon /> : icon}
        </div>
    );
};

interface StepperProps {
    currentStep: number;
    steps: { name: string, icon: React.ReactNode }[];
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
    return (
        <div className="w-full max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center text-center w-24">
                            <StepIcon step={index + 1} currentStep={currentStep} icon={step.icon} />
                            <p className={`mt-2 text-sm font-semibold ${index + 1 <= currentStep ? 'text-gray-800' : 'text-gray-500'}`}>
                                {step.name}
                            </p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-1 mx-2 rounded ${index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Stepper;
