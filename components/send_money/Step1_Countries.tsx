
import React from 'react';
import { Country } from '../../types';

interface CountryCardProps {
  country: Country;
  selected: boolean;
  onSelect: () => void;
}

const CountryCard: React.FC<CountryCardProps> = ({ country, selected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
      selected ? 'border-blue-600 ring-2 ring-blue-200 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'
    }`}
  >
    <div className="flex items-center">
      <span className="text-2xl font-bold text-gray-500">{country.code}</span>
      <div className="ml-4">
        <p className="font-bold text-gray-800">{country.name}</p>
        <p className="text-sm text-gray-500">{country.currency}</p>
      </div>
      {country.name === "United Kingdom" && selected && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
      )}
    </div>
  </button>
);


interface Step1CountriesProps {
  fromCountry: Country;
  toCountry: Country | null;
  setFromCountry: (country: Country) => void;
  setToCountry: (country: Country) => void;
  onNext: () => void;
}

const sendingCountries: Country[] = [
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
];

const receivingCountries: Country[] = [
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'PH', name: 'Philippines', currency: 'PHP' },
  { code: 'MX', name: 'Mexico', currency: 'MXN' },
];

const Step1Countries: React.FC<Step1CountriesProps> = ({
  fromCountry,
  toCountry,
  setFromCountry,
  setToCountry,
  onNext,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Choose Countries</h2>
        <p className="mt-2 text-gray-600">Select where you're sending money from and to</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="mb-4 font-semibold text-gray-700">Sending from</h3>
          <div className="space-y-3">
            {sendingCountries.map((c) => (
              <CountryCard
                key={c.code}
                country={c}
                selected={fromCountry.code === c.code}
                onSelect={() => setFromCountry(c)}
              />
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-gray-700">Sending to</h3>
          <div className="space-y-3">
            {receivingCountries.map((c) => (
              <CountryCard
                key={c.code}
                country={c}
                selected={toCountry?.code === c.code}
                onSelect={() => setToCountry(c)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12 text-center">
        <button
          onClick={onNext}
          disabled={!fromCountry || !toCountry}
          className="px-12 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step1Countries;
