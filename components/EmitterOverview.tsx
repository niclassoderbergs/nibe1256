
import React from 'react';
import { MY_SYSTEM } from '../constants';
import { calculateActualPower, calculateEfficiencyPercent, calculateFloorHeatingPower } from '../utils/heatingPhysics';
import { Wind, Thermometer, Box, Gauge, Layers, LayoutTemplate } from 'lucide-react';
import { EmitterType } from '../types';

export const EmitterOverview: React.FC = () => {
  const roomTemp = 20;

  // Split emitters by floor
  const plan3Emitters = MY_SYSTEM.emitters.filter(e => e.coordinates.floor === 3);
  const plan2Emitters = MY_SYSTEM.emitters.filter(e => e.coordinates.floor === 2);

  const renderEmitterCard = (emitter: EmitterType) => {
    const rated = emitter.specs?.ratedPowerW || 0;
    const observed = emitter.observedPeakTemp || 0;
    const area = emitter.specs?.area || 0;
    
    let actual = 0;
    let efficiency = 0;

    if (emitter.type === 'Golvvärme') {
        // New calculation for floor heating
        actual = calculateFloorHeatingPower(area, observed, roomTemp);
        // Efficiency concept doesn't apply the same way to floor heating (no rated power at dt50), 
        // but we can show power/m2
    } else {
        actual = calculateActualPower(rated, observed, roomTemp);
        efficiency = calculateEfficiencyPercent(rated, actual);
    }

    let icon = <Box className="w-5 h-5" />;
    let colorClass = "text-slate-600 bg-slate-100";
    
    if (emitter.type === 'Golvkonvektor') {
        icon = <Wind className="w-5 h-5" />;
        colorClass = "text-orange-600 bg-orange-100";
    } else if (emitter.type === 'Golvvärme') {
        icon = <Thermometer className="w-5 h-5" />;
        colorClass = "text-indigo-600 bg-indigo-100";
    } else {
        icon = <Box className="w-5 h-5" />;
        colorClass = "text-red-600 bg-red-100";
    }

    return (
        <div key={emitter.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-full">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                    <div className={`p-2.5 rounded-lg h-fit ${colorClass}`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">{emitter.location.split('-')[1]?.trim() || emitter.location}</h3>
                        <p className="text-xs text-slate-500">{emitter.specs?.model || emitter.type}</p>
                        {emitter.type === 'Golvvärme' && (
                            <p className="text-[10px] text-indigo-500 font-medium">{area} m²</p>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold font-mono text-slate-900">
                        {actual} W
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 uppercase font-medium">Nuvarande</span>
                        {rated > 0 && (
                            <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap">
                                (Max {rated} W)
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div>
                {/* Temp Bar */}
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 mb-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-700">{emitter.type === 'Golvvärme' ? 'Yttemp' : 'Vattentemp'}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-indigo-600">{observed}°C</span>
                        {rated > 0 && <span className="text-xs text-slate-400">vs 75°C</span>}
                    </div>
                </div>

                {/* Power/Efficiency Visualization */}
                {emitter.type !== 'Golvvärme' ? (
                    <div>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-slate-500 font-medium">Utnyttjandegrad</span>
                            <span className={`font-bold ${efficiency < 50 ? 'text-amber-600' : 'text-green-600'}`}>{efficiency}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${efficiency < 40 ? 'bg-red-500' : efficiency < 60 ? 'bg-amber-500' : 'bg-green-500'}`}
                                style={{ width: `${efficiency}%` }}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <div className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1.5 rounded border border-indigo-100 flex justify-between items-center">
                        <span>Specifik effekt:</span>
                        <span className="font-bold font-mono">~{(actual / area).toFixed(0)} W/m²</span>
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2 text-lg">
          <Gauge className="w-5 h-5 text-indigo-600" />
          Status Värmekällor
        </h2>
        <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Ögonblicksbild 2026-01-28 kl 23:00
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-8 custom-scrollbar">
        
        {/* PLAN 3 SECTION */}
        <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-white p-1.5 rounded-md shadow-sm border border-slate-200 text-slate-500">
                    <LayoutTemplate className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Plan 3 (Övre plan)</h3>
                <div className="h-px bg-slate-200 flex-1 ml-2"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {plan3Emitters.map(renderEmitterCard)}
            </div>
        </div>

        {/* PLAN 2 SECTION */}
        <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-white p-1.5 rounded-md shadow-sm border border-slate-200 text-slate-500">
                    <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Plan 2 (Entré & Sällskap)</h3>
                <div className="h-px bg-slate-200 flex-1 ml-2"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {plan2Emitters.map(renderEmitterCard)}
            </div>
        </div>

      </div>
    </div>
  );
};
