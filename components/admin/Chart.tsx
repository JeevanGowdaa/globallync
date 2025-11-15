interface ChartProps {
  title: string;
  data: {
    label: string;
    value: number;
    color?: string;
  }[];
  type?: 'bar' | 'line';
}

export function Chart({ title, data, type = 'bar' }: ChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-amber-500', 'bg-purple-500'];

  if (type === 'bar') {
    return (
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">{title}</h3>
        <div className="space-y-4">
          {data.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-slate-600">{item.label}</label>
                <span className="text-sm font-medium text-slate-900">{item.value}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${item.color || colors[idx % colors.length]}`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Line chart mock
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="h-64 flex items-end justify-around gap-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div
              className={`w-12 rounded-t ${item.color || colors[idx % colors.length]}`}
              style={{ height: `${(item.value / maxValue) * 250}px` }}
              title={`${item.label}: ${item.value}`}
            />
            <label className="text-xs text-slate-600 text-center max-w-12">{item.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
