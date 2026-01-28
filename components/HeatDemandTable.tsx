
import React from 'react';
import { calculateHousePowerDemand } from '../utils/heatingPhysics';
import { Flame, Info, TrendingUp } from 'lucide-react';

interface HeatDemandTableProps {
  currentTemp?: number;
}

export const HeatDemandTable: React.FC<HeatDemandTableProps> = ({ currentTemp = -25 }) => {
  // Generate temperature steps: 10, 5, 0, -5 ... -35
  const steps = [];
  for (let t = 10; t >= -35; t -= 5) {
    steps.push(t);
  }

  // Calculate max demand for bar chart scaling (at -35)
  const maxDemand = calculateHousePowerDemand(-35);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
        <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          Husets Värmebehov
        </h2>
        <div className="group relative">
             <Info className="w-4 h-4 text-slate-400 cursor-help" />
             <div className="absolute bottom-full right-0 mb-2 w-64 bg-slate-900 text-slate-200 text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                 Beräknat på 160m² timmerhus, renoverat 2015. Specifik värmeförlust ca 175 W/°C.
             </div>
        </div>
      </div>

      <div className="bg-slate-50 p-0">
        <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100 font-medium sticky top-0 shadow-sm z-10">
                <tr>
                    <th className="px-5 py-3 w-1/4">Ute (°C)</th>
                    <th className="px-5 py-3 w-1/4">Behov</th>
                    <th className="px-5 py-3">Belastning</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {steps.map((temp) => {
                    const demandW = calculateHousePowerDemand(temp);
                    const demandKW = (demandW / 1000).toFixed(1);
                    const percentage = Math.min(100, (demandW / maxDemand) * 100);
                    
                    // Check if this row is close to the slider temp
                    const isCurrent = Math.abs(temp - currentTemp) < 2.5;

                    // Style logic
                    let rowBg = 'bg-white';
                    let loadColor = 'bg-green-500';
                    let textColor = 'text-slate-600';
                    
                    if (temp <= -10) { loadColor = 'bg-amber-500'; }
                    if (temp <= -20) { loadColor = 'bg-red-500'; rowBg = 'bg-red-50/30'; }

                    // Override background if active
                    if (isCurrent) {
                        rowBg = 'bg-indigo-600 text-white';
                        textColor = 'text-white';
                    }

                    return (
                        <tr key={temp} className={`${rowBg} ${!isCurrent && 'hover:bg-indigo-50/50'} transition-colors duration-200`}>
                            <td className={`px-5 py-3 font-mono font-medium ${textColor}`}>
                                {temp > 0 ? `+${temp}` : temp}°C
                            </td>
                            <td className={`px-5 py-3 font-bold ${isCurrent ? 'text-white' : 'text-slate-800'}`}>
                                {demandKW} <span className={`text-xs font-normal ${isCurrent ? 'text-indigo-200' : 'text-slate-500'}`}>kW</span>
                            </td>
                            <td className="px-5 py-3 align-middle">
                                <div className={`w-full h-2 rounded-full overflow-hidden ${isCurrent ? 'bg-indigo-800' : 'bg-slate-200'}`}>
                                    <div 
                                        className={`h-full rounded-full ${isCurrent ? 'bg-white' : loadColor}`} 
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500 flex gap-2 items-start">
          <TrendingUp className="w-4 h-4 text-slate-400 shrink-0" />
          <p>
            Vid <strong>-20°C</strong> kräver huset ca <strong>6.4 kW</strong>. 
            Din bergvärmepump (S1256-13) klarar detta lätt (ger ca 10-13 kW), men problemet är att <em>radiatorerna</em> kanske inte hinner avge värmen till rummen.
          </p>
      </div>
    </div>
  );
};
