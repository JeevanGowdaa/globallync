import React from 'react';
import { RiskAlert } from '../../types';

interface RiskAlertsProps {
    alerts: RiskAlert[];
    onViewUserDetails: (userId: string) => void;
}

const RiskAlerts: React.FC<RiskAlertsProps> = ({ alerts, onViewUserDetails }) => {
    return (
        <div>
            <h2 className="mb-8 text-3xl font-bold text-gray-800">AI-Powered Risk Alerts</h2>
            <div className="space-y-4">
                {alerts.length > 0 ? alerts.map(alert => (
                    <div key={alert._id} className="p-4 bg-white border-l-4 border-red-500 rounded-r-lg shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1">
                                <p className="font-bold text-red-800">{alert.reason}</p>
                                <p className="mt-1 text-sm text-gray-600">
                                    User: <span className="font-medium text-gray-800">{alert.userName}</span> (ID: {alert.userId})
                                </p>
                                <p className="text-sm text-gray-600">
                                    Transaction ID: <span className="font-mono text-xs">{alert.transactionId}</span>
                                </p>
                            </div>
                            <div className="mt-2 text-left sm:text-right sm:mt-0">
                                <p className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</p>
                                <button 
                                    onClick={() => onViewUserDetails(alert.userId)}
                                    className="mt-2 px-3 py-1 text-xs font-medium text-white bg-gray-700 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    View User Details
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow-lg">
                        No active risk alerts.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiskAlerts;