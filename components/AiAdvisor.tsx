import React, { useState } from 'react';
import { Sparkles, Send, MessageSquare, Info } from 'lucide-react';
import { getHeatingAdvice } from '../services/geminiService';

export const AiAdvisor: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setResponse(null);
    
    try {
      const result = await getHeatingAdvice(query);
      setResponse(result);
    } catch (e) {
      setResponse("Ett fel uppstod. Kontrollera din anslutning eller API-nyckel.");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Optimera kurva för konvektorer?",
    "Max temp för stengolv?",
    "Balansera Zehnder radiatorer?"
  ];

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 text-white h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold">AI Rådgivare</h2>
        </div>
        <Info className="w-4 h-4 text-slate-500" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 custom-scrollbar">
        {!response ? (
            <div className="flex flex-col gap-3 justify-center h-full opacity-80">
                <p className="text-center text-sm text-slate-400">Vad vill du veta om ditt system idag?</p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map((s, i) => (
                        <button 
                            key={i}
                            onClick={() => setQuery(s)}
                            className="text-xs bg-slate-800 hover:bg-slate-700 transition-colors px-3 py-2 rounded-lg text-indigo-200 border border-slate-700 w-full text-left"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        ) : (
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 animate-fade-in">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {response}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative mt-auto">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Fråga om ditt system..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    handleAsk();
                }
            }}
          />
          <button
            onClick={handleAsk}
            disabled={loading || !query}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center"
          >
            {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
                <Send className="w-3 h-3 text-white" />
            )}
          </button>
      </div>
    </div>
  );
};