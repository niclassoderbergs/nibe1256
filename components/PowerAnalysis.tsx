
import React from 'react';
import { MY_SYSTEM } from '../constants';
import { calculateActualPower, calculateEfficiencyPercent, calculateFloorHeatingPower, calculateHousePowerDemand } from '../utils/heatingPhysics';
import { Activity, Zap, TrendingDown, AlertTriangle } from 'lucide-react';
import { EmitterType } from '../types';

interface PowerAnalysisProps {
  outdoorTemp: number;
}

export const PowerAnalysis: React.FC<PowerAnalysisProps> = ({ outdoorTemp }) => {
  const roomTemp = 20;

  // Calculate totals from Emitters
  let totalRatedPower = 0;
  let totalActualRadiatorPower = 0;
  let totalActualFloorPower = 0;

  MY_SYSTEM.emitters.forEach(e => {
    if (e.type === 'Golvvärme') {
        totalActualFloorPower += calculateFloorHeatingPower(e.specs?.area || 0, e.observedPeakTemp || 0, roomTemp);
    } else {
        const rated = e.specs?.ratedPowerW || 0;
        const actual = calculateActualPower(rated, e.observedPeakTemp || 0, roomTemp);
        totalRatedPower += rated;
        totalActualRadiatorPower += actual;
    }
  });

  const totalActualPower = totalActualRadiatorPower + totalActualFloorPower;
  
  // Calculate House Demand based on Slider Temp
  const requiredPower = calculateHousePowerDemand(outdoorTemp);
  const coveragePercent = requiredPower > 0 ? Math.round((totalActualPower / requiredPower) * 100) : 100;
  const deficit = Math.max(0, requiredPower - totalActualPower);
  
  // Efficiency is based on how well radiators perform vs their rating
  const efficiency = calculateEfficiencyPercent(totalRatedPower, totalActualRadiatorPower);

  const renderEmitterRow = (e: EmitterType) => {
    if (e.type === 'Golvvärme') {
        const area = e.specs?.area || 0;
        const observed = e.observedPeakTemp || 0;
        const actual = calculateFloorHeatingPower(area, observed, roomTemp);

        return (
            <div key={e.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{e.location.split('-')[1]?.trim() || e.location}</p>
                    <p className="text-[10px] text-indigo-500">Golvvärme ({area} m²)</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <span className="text-xs font-mono font-bold text-slate-800">{actual}W</span>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[10px]">
                        <span className="text-indigo-600 font-medium">{observed}°C</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-400">~{(actual / area).toFixed(0)} W/m²</span>
                    </div>
                </div>
            </div>
        );
    }

    const rated = e.specs?.ratedPowerW || 0;
    const observed = e.observedPeakTemp || 0;
    const actual = calculateActualPower(rated, observed, roomTemp);
    const eff = calculateEfficiencyPercent(rated, actual);

    return (
      <div key={e.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-700 truncate">{e.location.split('-')[1]?.trim() || e.location}</p>
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
          Effektanalys (vid 20°C inne)
        </h2>
      </div>

      {/* Main KPI */}
      <div className="bg-slate-900 rounded-lg p-4 text-white mb-4 relative overflow-hidden transition-all duration-300">
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Avgiven Effekt</p>
                    <span className="text-3xl font-bold font-mono text-amber-400">{totalActualPower}W</span>
                </div>
                <div className="text-right">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Behov ({outdoorTemp}°C)</p>
                    <span className="text-xl font-bold font-mono text-slate-200">{requiredPower}W</span>
                </div>
            </div>

            {/* Coverage Bar */}
            <div className="mt-2 mb-2">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Täckningsgrad</span>
                    <span className={coveragePercent < 100 ? "text-red-400" : "text-green-400"}>{coveragePercent}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-500 ${coveragePercent < 90 ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(100, coveragePercent)}%` }}
                    ></div>
                </div>
            </div>

            {deficit > 0 && (
                <div className="flex items-center gap-2 text-xs text-red-300 bg-red-950/30 px-2 py-1.5 rounded mt-2 border border-red-900/50 animate-pulse">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span>Underskott: <strong>{deficit}W</strong> (Radiatorerna begränsar)</span>
                </div>
            )}
            
             <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700">
                 <span className="text-[10px] text-slate-500 font-medium">Element/Konvektor:</span>
                 <span className="text-xs text-slate-300 font-mono">{totalActualRadiatorPower}W</span>
                 <span className="text-slate-600">|</span>
                 <span className="text-[10px] text-slate-500 font-medium">Golvvärme:</span>
                 <span className="text-xs text-slate-300 font-mono">{totalActualFloorPower}W</span>
            </div>
            
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-300 bg-slate-800/50 w-fit px-2 py-1 rounded">
                <TrendingDown className="w-3 h-3 text-red-400" />
                <span>Radiatorerna ger ca {efficiency}% av sin kapacitet</span>
            </div>
        </div>
        {/* Background deco */}
        <Activity className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-slate-800/50" />
      </div>

      {/* Detailed List */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Per Enhet</h3>
         <div className="space-y-1">
            {MY_SYSTEM.emitters.map(renderEmitterRow)}
         </div>
      </div>
    </div>
  );
};
