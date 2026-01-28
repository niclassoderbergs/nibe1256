
import React from 'react';
import { MY_SYSTEM } from '../constants';
import { calculateActualPower, calculateEfficiencyPercent } from '../utils/heatingPhysics';
import { Activity, Zap, TrendingDown, ArrowDownRight } from 'lucide-react';
import { EmitterType } from '../types';

export const PowerAnalysis: React.FC = () => {
  const roomTemp = 21;

  // Calculate totals
  const totalRatedPower = MY_SYSTEM.emitters.reduce((sum, e) => sum + (e.specs?.ratedPowerW || 0), 0);
  
  const totalActualPower = MY_SYSTEM.emitters.reduce((sum, e) => {
    if (e.type === 'Golvvärme') return sum + 0; // Hard to calc without area, skipping for total sum
    return sum + calculateActualPower(e.specs?.ratedPowerW || 0, e.observedPeakTemp || 0, roomTemp);
  }, 0);

  const efficiency = calculateEfficiencyPercent(totalRatedPower, totalActualPower);

  const renderEmitterRow = (e: EmitterType) => {
    if (e.type === 'Golvvärme') return null; // Handle separately

    const rated = e.specs?.ratedPowerW || 0;
    const observed = e.observedPeakTemp || 0;
    const actual = calculateActualPower(rated, observed, roomTemp);
    const eff = calculateEfficiencyPercent(rated, actual);

    return (
      <div key={e.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-700 truncate">{e.location.split('-')[1] || e.location}</p>
          <p className="text-[10px] text-slate-400">{e.specs?.model}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs font-mono font-bold text-slate-800">{actual}W</span>
            <span className="text-[10px] text-slate-400 line-through decoration-slate-300">{rated}W</span>
          </div>
          <div className="flex items-center justify-end gap-1 text-[10px]">
             <span className="text-red-500 font-medium">{observed}°C</span>
             <span className="text-slate-300">|</span>
             <span className={`${eff < 50 ? 'text-amber-600' : 'text-green-600'}`}>{eff}% effekt</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Effektanalys (vid 21°C inne)
        </h2>
      </div>

      {/* Main KPI */}
      <div className="bg-slate-900 rounded-lg p-4 text-white mb-4 relative overflow-hidden">
        <div className="relative z-10">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Beräknad Total Effekt</p>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-amber-400">{totalActualPower}W</span>
                <span className="text-sm text-slate-500 font-medium">av {totalRatedPower}W (Nom.)</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-300 bg-slate-800/50 w-fit px-2 py-1 rounded">
                <TrendingDown className="w-3 h-3 text-red-400" />
                <span>Systemet ger ca {efficiency}% av radiatorernas maxkapacitet</span>
            </div>
        </div>
        {/* Background deco */}
        <Activity className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-slate-800/50" />
      </div>

      {/* Detailed List */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Per Enhet (Baserat på dina grafer)</h3>
         <div className="space-y-1">
            {MY_SYSTEM.emitters.map(renderEmitterRow)}
         </div>

         <div className="mt-4 p-3 bg-indigo-50 rounded border border-indigo-100">
             <div className="flex justify-between items-start mb-1">
                 <span className="text-xs font-bold text-indigo-900">Golvvärme Entré</span>
                 <span className="text-xs font-mono font-bold text-indigo-700">~28°C</span>
             </div>
             <p className="text-[10px] text-indigo-700 leading-tight">
                 Svårt att effektberäkna exakt utan yta/slinglängd, men 28°C yttemp indikerar bra värmeavgivning. 
                 Vid 21°C inne ger golvet ca 77 W/m².
             </p>
         </div>
      </div>
    </div>
  );
};
