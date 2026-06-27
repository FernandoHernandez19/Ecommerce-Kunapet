import React from 'react';

export default function AdminStatCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl flex items-center justify-center text-xl shadow-sm ${stat.iconBg} ${stat.iconColor}`}>
              {stat.icon}
            </div>
            {stat.trend && (
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                ↗ {stat.trend}
              </span>
            )}
            {stat.urgentCount && (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                {stat.urgentCount} urgentes
              </span>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold mb-1">{stat.title}</p>
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}