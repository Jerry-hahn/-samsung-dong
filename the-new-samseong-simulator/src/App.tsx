import React, { useState } from 'react';
import type { ViewTab } from './types';
import { Navbar } from './components/Navbar';
import { CareerSimulator } from './components/CareerSimulator';
import { ReconstructionEngine } from './components/ReconstructionEngine';
import { PitchDeck } from './components/PitchDeck';
import { Building2 } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ViewTab>('career');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-8">
        {currentTab === 'career' && <CareerSimulator />}
        {currentTab === 'reconstruction' && <ReconstructionEngine />}
        {currentTab === 'pitchdeck' && <PitchDeck />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Building2 className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-400">THE NEW SAMSEONG : Rebuilding the Core of Gangnam</span>
          <span className="text-slate-700">•</span>
          <span className="text-slate-400">2026–2029 Vision Platform</span>
        </div>
        <p>Built with AI Strategy Engine & Urban Development Masterplan Framework</p>
      </footer>

    </div>
  );
};

export default App;
