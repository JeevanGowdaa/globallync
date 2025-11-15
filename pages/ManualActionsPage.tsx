import { useState, FormEvent } from 'react';
import { SideNav } from '../components/admin/SideNav';
import { AdminNavbar } from '../components/admin/AdminNavbar';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ManualAction {
  id: string;
  type: 'approve_flag' | 'reject_flag' | 'reverse_transfer' | 'add_user_whitelist' | 'adjust_limit';
  description: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: number;
  performedBy: string;
}

export function ManualActionsPage() {
  const [actions, setActions] = useState<ManualAction[]>([
    {
      id: 'ACT001',
      type: 'approve_flag',
      description: 'Approved AML flag FLAG002 - Transaction was legitimate',
      status: 'completed',
      timestamp: Date.now() - 3600000,
      performedBy: 'admin@example.com',
    },
    {
      id: 'ACT002',
      type: 'reverse_transfer',
      description: 'Reversed transfer TXN005 - Receiver account invalid',
      status: 'completed',
      timestamp: Date.now() - 7200000,
      performedBy: 'admin@example.com',
    },
  ]);

  const [formData, setFormData] = useState({
    actionType: 'approve_flag',
    targetId: '',
    notes: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const actionTypes = [
    { value: 'approve_flag', label: 'Approve AML Flag', icon: '✓' },
    { value: 'reject_flag', label: 'Reject AML Flag', icon: '✗' },
    { value: 'reverse_transfer', label: 'Reverse Transfer', icon: '⤴️' },
    { value: 'add_user_whitelist', label: 'Add User to Whitelist', icon: '⭐' },
    { value: 'adjust_limit', label: 'Adjust User Limit', icon: '📊' },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.targetId.trim()) {
      alert('Please enter a target ID');
      return;
    }

    const newAction: ManualAction = {
      id: `ACT${String(actions.length + 1).padStart(3, '0')}`,
      type: formData.actionType as any,
      description: `${actionTypes.find((a) => a.value === formData.actionType)?.label} - ${formData.targetId}: ${formData.notes}`,
      status: 'pending',
      timestamp: Date.now(),
      performedBy: 'admin@example.com',
    };

    setActions([newAction, ...actions]);
    setFormData({ actionType: 'approve_flag', targetId: '', notes: '' });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getActionIcon = (type: string) => {
    const icons: Record<string, string> = {
      approve_flag: '✓',
      reject_flag: '✗',
      reverse_transfer: '⤴️',
      add_user_whitelist: '⭐',
      adjust_limit: '📊',
    };
    return icons[type] || '⚙️';
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <SideNav />
      <div className="flex-1 flex flex-col md:ml-64">
        <AdminNavbar />
        <main className="flex-1 pt-20 overflow-auto">
          <div className="p-6 space-y-6 max-w-6xl">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Manual Actions</h1>
              <p className="text-slate-600 mt-2">
                Perform administrative actions on the platform
              </p>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-green-900">Action queued successfully</p>
                  <p className="text-sm text-green-700">
                    Your action has been added to the queue and will be processed.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Action Form */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Perform Action</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Action Type
                      </label>
                      <select
                        value={formData.actionType}
                        onChange={(e) =>
                          setFormData({ ...formData, actionType: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {actionTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Target ID (e.g., FLAG001, TXN001)
                      </label>
                      <input
                        type="text"
                        value={formData.targetId}
                        onChange={(e) =>
                          setFormData({ ...formData, targetId: e.target.value.toUpperCase() })
                        }
                        placeholder="Enter ID"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Add additional notes..."
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Execute Action
                    </button>
                  </form>
                </div>

                {/* Action Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">Help</p>
                      <p className="text-blue-700 text-xs mt-1">
                        Each action is logged and can be audited. Make sure to enter the correct
                        target ID to avoid mistakes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action History */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Action History</h2>

                  {actions.length === 0 ? (
                    <p className="text-slate-500 py-8 text-center">No actions performed yet</p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {actions.map((action) => (
                        <div
                          key={action.id}
                          className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">{getActionIcon(action.type)}</span>
                                <p className="font-medium text-slate-900">{action.id}</p>
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    action.status === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : action.status === 'pending'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {action.status}
                                </span>
                              </div>
                              <p className="text-sm text-slate-700">{action.description}</p>
                              <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                                <span>By: {action.performedBy}</span>
                                <span>{new Date(action.timestamp).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Types Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actionTypes.map((type) => (
                <div key={type.value} className="bg-white rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <h3 className="font-semibold text-slate-900">{type.label}</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {type.value === 'approve_flag'
                          ? 'Mark an AML flag as reviewed and approved'
                          : type.value === 'reject_flag'
                            ? 'Mark an AML flag as false positive'
                            : type.value === 'reverse_transfer'
                              ? 'Reverse a completed transfer and refund'
                              : type.value === 'add_user_whitelist'
                                ? 'Add a user to whitelist for faster processing'
                                : 'Adjust daily transfer limits for a user'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
