
import React, { useState } from 'react';
import { EmitterOverview } from './components/EmitterOverview';
import { PowerAnalysis } from './components/PowerAnalysis';
import { HeatDemandTable } from './components/HeatDemandTable';
import { Wind, CloudSnow, Home as HomeIcon, Settings2 } from 'lucide-react';
import { MOCK_WEATHER } from './constants';

interface HeaderProps {
  temp: number;
  setTemp: (t: number) => void;
}

const Header: React.FC<HeaderProps> = ({ temp, setTemp }) => (
  <header className="bg-white border-b border-slate-200 sticky top-0 z-50 h-16">
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-slate-900 p-2 rounded-lg text-white">
           <HomeIcon className="w-5 h-5" />
        </div>
        <div>
           <h1 className="text-lg font-bold text-slate-900 leading-none">Timmerhus <span className="text-indigo-600">Åre</span></h1>
           <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-0.5">NIBE S1256 Dashboard</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end mr-4">
             <div className="flex items-center gap-4 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                        <CloudSnow className="w-4 h-4 text-sky-500" />
                        <span className="text-sm font-bold text-slate-800 w-12 text-right">{temp}°C</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                        <Wind className="w-3 h-3" />
                        <span>{MOCK_WEATHER.wind} m/s</span>
                    </div>
                </div>
                
                {/* Temperature Slider (Desktop) */}
                <div className="flex flex-col gap-1 w-32">
                    <input 
                        type="range" 
                        min="-35" 
                        max="15" 
                        step="1"
                        value={temp} 
                        onChange={(e) => setTemp(parseInt(e.target.value))}
                        className="h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[8px] text-slate-400 font-medium px-0.5">
                        <span>-35°</span>
                        <span>0°</span>
                        <span>+15°</span>
                    </div>
                </div>
             </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
            JD
        </div>
      </div>
    </div>
  </header>
);

const MobileTempSlider: React.FC<{ temp: number; setTemp: (t: number) => void }> = ({ temp, setTemp }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 md:hidden">
      <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
              <div className="p-1.5 bg-sky-100 rounded-md text-sky-600">
                  <Settings2 className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-800 text-sm">Simulera Utetemperatur</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg">
              <CloudSnow className="w-3.5 h-3.5 text-sky-500" />
              <span className="text-sm font-bold text-slate-900">{temp}°C</span>
          </div>
      </div>
      <input 
          type="range" 
          min="-35" 
          max="15" 
          step="1"
          value={temp} 
          onChange={(e) => setTemp(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 touch-pan-x"
      />
      <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-2 px-1">
          <span>-35°C (Kallast)</span>
          <span>0°C</span>
          <span>+15°C (Varmt)</span>
      </div>
  </div>
);

const App: React.FC = () => {
  // State for outdoor temp, initialized with mock data
  const [outdoorTemp, setOutdoorTemp] = useState(MOCK_WEATHER.temp);

  return (
    <div className="min-h-screen bg-slate-100/50 pb-12 font-sans text-slate-900">
      <Header temp={outdoorTemp} setTemp={setOutdoorTemp} />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* DASHBOARD GRID */}
        {/* Removed fixed height so widgets can expand naturally */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* COLUMN 1: Main Data Grid - Takes 8/12 width on large screens */}
            <div className="xl:col-span-8 flex flex-col gap-6">
                <div className="min-h-[500px]">
                    {/* Note: EmitterOverview mostly uses observed sensor data, so it doesn't strictly depend on the slider 
                        unless we wanted to simulate physics. Keeping it observed data for now. */}
                    <EmitterOverview />
                </div>
                {/* House Specs / Heat Demand Table */}
                <div>
                    <HeatDemandTable currentTemp={outdoorTemp} />
                </div>
            </div>

            {/* COLUMN 2: Sidebar Stats - Takes 4/12 width */}
            <div className="xl:col-span-4 flex flex-col gap-6">
                
                {/* Mobile Slider - Visible only on small screens, placed before PowerAnalysis */}
                <MobileTempSlider temp={outdoorTemp} setTemp={setOutdoorTemp} />

                <div className="min-h-[400px]">
                    <PowerAnalysis outdoorTemp={outdoorTemp} />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
