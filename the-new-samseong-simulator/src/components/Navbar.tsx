import React from 'react';
import type { ViewTab } from '../types';
import { TrendingUp, Building2, Presentation, Sparkles, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-amber-500/20 px-4 lg:px-8 py-3 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Header */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('career')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-cyan-400 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-cyan-300 bg-clip-text text-transparent">
                THE NEW SAMSEONG
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full">
                Urban Tech 2029
              </span>
            </div>
            <p className="text-xs text-slate-400">Rebuilding the Core of Gangnam · Two-Track Career & Asset Engine</p>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <nav className="flex items-center space-x-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            onClick={() => onTabChange('career')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'career'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>① 2026–2029 커리어 & 자산 역산</span>
          </button>

          <button
            onClick={() => onTabChange('reconstruction')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'reconstruction'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>③ 통합재건축 전략 수지분석 엔진</span>
          </button>

          <button
            onClick={() => onTabChange('pitchdeck')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'pitchdeck'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md shadow-purple-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Presentation className="w-4 h-4" />
            <span>마스터플랜 10-Slide Deck</span>
          </button>
        </nav>

        {/* Status Indicator */}
        <div className="hidden xl:flex items-center space-x-3 text-xs bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>투트랙 리스크 zero 모델</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>목표 순자산: ₩35~50억+</span>
          </div>
        </div>

      </div>
    </header>
  );
};
