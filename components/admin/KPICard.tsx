interface KPICardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  color?: 'blue' | 'green' | 'red' | 'amber';
}

const colorClasses = {
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-green-50 border-green-200',
  red: 'bg-red-50 border-red-200',
  amber: 'bg-amber-50 border-amber-200',
};

const iconBgClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  amber: 'bg-amber-100 text-amber-600',
};

export function KPICard({ label, value, icon, trend, color = 'blue' }: KPICardProps) {
  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-2">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg text-2xl ${iconBgClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
