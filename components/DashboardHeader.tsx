
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardHeader: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm sticky top-0 z-20">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex justify-between items-center py-3">
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
                           GlobalRemit
                           <span className="block text-xs font-normal text-gray-500 -mt-1">Promises Delivered</span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-6">
                            <Link to="/dashboard" className="text-sm font-semibold text-gray-700 hover:text-blue-600">Send money</Link>
                            <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-600">Transfer history</a>
                            <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-600">Refer friends</a>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                         <div className="hidden md:flex items-center space-x-2 text-sm">
                            <a href="#" className="font-semibold p-2 hover:bg-gray-100 rounded-md">English</a>
                        </div>
                        <div className="relative group">
                             <button className="flex items-center space-x-1 text-sm font-semibold p-2 hover:bg-gray-100 rounded-md">
                                <span>Welcome, {user?.name?.split(' ')[0]}</span>
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Help Center</a>
                                <div className="border-t my-1"></div>
                                <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
