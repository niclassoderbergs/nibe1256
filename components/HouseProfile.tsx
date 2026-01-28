import React from 'react';
import { Home, Snowflake, Layers, Clock, ShieldCheck } from 'lucide-react';
import { MY_HOUSE } from '../constants';

export const HouseProfile: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 h-full flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        
        {/* Section 1: History */}
        <div className="flex items-start gap-4 px-2">
            <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Historik</p>
                <p className="text-sm font-semibold text-slate-800">Byggt 1890 / Flyttat 1990</p>
                <p className="text-xs text-green-600 font-medium">Renoverat 2015</p>
            </div>
        </div>

        {/* Section 2: Structure */}
        <div className="flex items-start gap-4 px-2 pt-4 md:pt-0 pl-0 md:pl-6">
            <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                <Layers className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Konstruktion</p>
                <p className="text-sm font-semibold text-slate-800">{MY_HOUSE.structure}</p>
                <p className="text-xs text-slate-500">3 plan (inkl suterräng)</p>
            </div>
        </div>

        {/* Section 3: Isolation/Area */}
        <div className="flex items-start gap-4 px-2 pt-4 md:pt-0 pl-0 md:pl-6">
            <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                <p className="text-sm font-semibold text-slate-800">{MY_HOUSE.totalHeatedArea} m² Uppvärmt</p>
                <p className="text-xs text-slate-500">Välisolerat (2015 std)</p>
            </div>
        </div>

      </div>
    </div>
  );
};