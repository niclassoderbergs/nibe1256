import React from 'react';
import { Activity, Zap, AlertTriangle } from 'lucide-react';
import { MY_SYSTEM } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_CURVE_DATA } from '../constants';

export const SystemOverview: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          Driftdata
        </h2>
        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
          Normal
        </span>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">Framledning</div>
            <div className="text-xl font-mono font-semibold text-red-500">42.5°C</div>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">Beräknad</div>
            <div className="text-xl font-mono font-semibold text-slate-700">43.0°C</div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[180px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_CURVE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#cbd5e1" tick={{fontSize: 9}} tickLine={false} axisLine={false} />
                <YAxis stroke="#cbd5e1" tick={{fontSize: 9}} width={30} tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px'}}
                />
                <Line type="monotone" dataKey="flowTemp" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="returnTemp" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Warning */}
      <div className="mt-4 flex gap-2 items-start bg-amber-50 p-3 rounded border border-amber-100 text-amber-800 text-[11px] leading-tight">
          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
          <p>
            Systemet begränsas av <strong>Golvvärme (Plan 2)</strong>. Framledning >45°C kan skada stengolv eller ge komfortproblem, men krävs för radiatorerna (Plan 3) vid sträng kyla.
          </p>
      </div>
    </div>
  );
};