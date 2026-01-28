
import React, { useState } from 'react';
import { MY_SYSTEM } from '../constants';
import { EmitterType } from '../types';
import { calculateActualPower } from '../utils/heatingPhysics';
import { Wind, Thermometer, Box, ImageIcon, Zap } from 'lucide-react';

export const FloorPlan: React.FC = () => {
  const [activeFloor, setActiveFloor] = useState<2 | 3>(2);
  const [hoveredEmitter, setHoveredEmitter] = useState<string | null>(null);

  // NOTE FOR USER:
  // Please add your images to the public folder:
  // - public/plan2.jpg
  // - public/plan3.jpg
  // Or update these URLs to point to your hosted images.
  const floorImages = {
    2: "https://placehold.co/800x600/f1f5f9/94a3b8?text=Planritning+Plan+2+(Ladda+upp+bild)",
    3: "https://placehold.co/800x600/f1f5f9/94a3b8?text=Planritning+Plan+3+(Ladda+upp+bild)"
  };

  const getEmitterIcon = (type: EmitterType['type']) => {
    switch (type) {
      case 'Golvkonvektor': return <Wind className="w-3 h-3" />;
      case 'Radiator': return <Box className="w-3 h-3" />;
      case 'Golvvärme': return <Thermometer className="w-3 h-3" />;
      default: return <Box className="w-3 h-3" />;
    }
  };

  const getEmitterColor = (type: EmitterType['type']) => {
    switch (type) {
      case 'Golvkonvektor': return 'bg-orange-500 text-white shadow-orange-200';
      case 'Radiator': return 'bg-red-500 text-white shadow-red-200';
      case 'Golvvärme': return 'bg-indigo-500 text-white shadow-indigo-200';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-600" />
          Planritning & Sensorer
        </h2>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveFloor(2)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeFloor === 2 ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Plan 2
          </button>
          <button 
            onClick={() => setActiveFloor(3)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeFloor === 3 ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Plan 3
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
        
        {/* Map Container */}
        <div className="relative w-full h-full max-w-[800px] flex items-center justify-center">
            
            {/* The Blueprint Image */}
            <div className="relative shadow-xl rounded-lg overflow-hidden bg-white border border-slate-200">
                <img 
                    src={floorImages[activeFloor]} 
                    alt={`Planritning Plan ${activeFloor}`}
                    className="max-w-full max-h-[600px] object-contain block opacity-90"
                />
                
                {/* Overlay Instruction */}
                <div className="absolute top-2 right-2 opacity-50 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] bg-slate-900/10 px-2 py-1 rounded text-slate-600">
                        Lägg 'plan{activeFloor}.jpg' i mappen
                    </span>
                </div>

                {/* Emitters Overlay */}
                {MY_SYSTEM.emitters
                    .filter(e => e.coordinates.floor === activeFloor)
                    .map(emitter => {
                        const isHovered = hoveredEmitter === emitter.id;
                        const actualPower = calculateActualPower(
                            emitter.specs?.ratedPowerW || 0,
                            emitter.observedPeakTemp || 0
                        );

                        return (
                            <div
                                key={emitter.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group"
                                style={{ 
                                    left: `${emitter.coordinates.x}%`, 
                                    top: `${emitter.coordinates.y}%` 
                                }}
                                onMouseEnter={() => setHoveredEmitter(emitter.id)}
                                onMouseLeave={() => setHoveredEmitter(null)}
                            >
                                {/* The Dot/Icon */}
                                <div className={`
                                    relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg transition-all duration-300 cursor-pointer
                                    ${getEmitterColor(emitter.type)}
                                    ${isHovered ? 'scale-125 ring-4 ring-white/50' : 'scale-100 hover:scale-110'}
                                `}>
                                    {getEmitterIcon(emitter.type)}
                                    
                                    {/* Pulse effect for visibility */}
                                    <span className={`absolute inline-flex h-full w-full rounded-full opacity-30 animate-ping ${getEmitterColor(emitter.type)}`}></span>
                                </div>

                                {/* Tooltip */}
                                <div className={`
                                    absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 
                                    bg-slate-900 text-white text-xs p-3 rounded-lg shadow-2xl 
                                    transition-all duration-200 pointer-events-none z-50
                                    ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                                `}>
                                    {/* Arrow */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                    
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-yellow-400">{emitter.location.split('-')[1]?.trim() || emitter.location}</p>
                                    </div>
                                    <p className="text-slate-300 mb-2 leading-tight">{emitter.description}</p>
                                    
                                    {/* Calculated Power Output Display */}
                                    {emitter.type !== 'Golvvärme' ? (
                                        <div className="bg-slate-800 rounded p-2 mb-2 border border-slate-700">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-slate-400">Uppmätt temp:</span>
                                                <span className="font-mono font-bold text-white">{emitter.observedPeakTemp || '-'}°C</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400 flex items-center gap-1"><Zap className="w-3 h-3"/> Effekt (21°):</span>
                                                <span className="font-mono font-bold text-green-400">{actualPower > 0 ? `${actualPower} W` : '-'}</span>
                                            </div>
                                            <div className="mt-1 text-[9px] text-slate-500 text-right">
                                                Nom: {emitter.specs?.ratedPowerW} W
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-800 rounded p-2 mb-2 border border-slate-700">
                                             <div className="flex items-center justify-between">
                                                <span className="text-slate-400">Yttemperatur:</span>
                                                <span className="font-mono font-bold text-white">{emitter.observedPeakTemp || '-'}°C</span>
                                            </div>
                                            <p className="mt-1 text-[9px] text-indigo-300">
                                                Ger ca 77 W/m² vid 21°C rumstemp.
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-1 flex-wrap">
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-medium ${emitter.tempRequirement === 'Low' ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}`}>
                                            Krav: {emitter.tempRequirement} Temp
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 right-4 md:right-auto bg-white/95 backdrop-blur shadow-lg border border-slate-200 p-3 rounded-xl flex gap-4 justify-center md:justify-start">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-xs font-medium text-slate-600">Golvkonvektor</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-xs font-medium text-slate-600">Radiator</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span className="text-xs font-medium text-slate-600">Golvvärme</span>
           </div>
        </div>

      </div>
    </div>
  );
};
