import { useAuth } from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';

export function AdminNavbar() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 md:ml-64">
      <div className="px-6 h-full flex items-center justify-between">
        <div className="ml-10 md:ml-0">
          <h2 className="text-xl font-semibold text-slate-900">Admin Panel</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">{user?.name || user?.email}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} className="text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
