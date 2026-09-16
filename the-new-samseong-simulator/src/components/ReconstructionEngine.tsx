import React, { useState } from 'react';
import type { ComplexData, ReconstructionParams } from '../types';
import { 
  Building2, ArrowRightLeft, Sliders, PieChart, CheckCircle
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const INITIAL_COMPLEXES: ComplexData[] = [
  { id: 'hansol', name: '삼성동 한솔아파트 (1호 Anchor)', currentUnits: 268, landAreaM2: 8925, currentFAR: 248, avgUnitSizePyeong: 32, estimatedLandPricePerPyeong: 12000 },
  { id: 'pureunsol', name: '삼성동 푸른솔아파트', currentUnits: 184, landAreaM2: 5620, currentFAR: 235, avgUnitSizePyeong: 30, estimatedLandPricePerPyeong: 11500 },
  { id: 'hyundai', name: '삼성동 현대 1차', currentUnits: 320, landAreaM2: 9840, currentFAR: 255, avgUnitSizePyeong: 33, estimatedLandPricePerPyeong: 12500 },
  { id: 'seoktap', name: '삼성동 석탑아파트', currentUnits: 140, landAreaM2: 4100, currentFAR: 220, avgUnitSizePyeong: 28, estimatedLandPricePerPyeong: 11000 },
  { id: 'woojung', name: '삼성동 우정에쉐르 및 인접 단지', currentUnits: 210, landAreaM2: 5900, currentFAR: 240, avgUnitSizePyeong: 29, estimatedLandPricePerPyeong: 11200 },
];

export const ReconstructionEngine: React.FC = () => {
  const [params, setParams] = useState<ReconstructionParams>({
    farScenario: 700,
    generalSalesPricePerPyeong: 11000, // 1억 1,000만원/평
    constructionCostPerPyeong: 1100, // 1,100만원/평
    publicContributionRatio: 15,
    commercialAreaRatio: 20
  });

  // Calculate Aggregates
  const totalLandAreaM2 = INITIAL_COMPLEXES.reduce((acc, c) => acc + c.landAreaM2, 0);
  const totalLandAreaPyeong = totalLandAreaM2 / 3.3058; // approx 10,400평
  const totalCurrentUnits = INITIAL_COMPLEXES.reduce((acc, c) => acc + c.currentUnits, 0);

  // Net FAR & Gross Floor Area
  const netFAR = params.farScenario * (1 - params.publicContributionRatio / 100);
  const totalResidentialBuildingPyeong = totalLandAreaPyeong * (netFAR / 100);
  
  // Total Estimated New Units (assuming avg unit size 34 pyeong)
  const avgNewUnitSize = 34;
  const grossUnits = Math.floor(totalResidentialBuildingPyeong / avgNewUnitSize);
  const generalSalesUnits = Math.max(0, grossUnits - totalCurrentUnits);

  // Financial Engine
  // Total Sales Revenue = General Sales Units * Avg Unit Size * General Sales Price
  const totalGeneralSalesRevenueEok = (generalSalesUnits * avgNewUnitSize * params.generalSalesPricePerPyeong) / 10000;
  
  // Total Construction & Project Cost (including underground parking & public amenities factor 1.6x)
  const totalGrossFloorAreaPyeong = totalResidentialBuildingPyeong * 1.6;
  const totalProjectCostEok = (totalGrossFloorAreaPyeong * params.constructionCostPerPyeong) / 10000;

  // Net Project Profit or Surplus
  const netProfitEok = totalGeneralSalesRevenueEok - totalProjectCostEok;
  const avgRefundPerResidentEok = (netProfitEok / totalCurrentUnits);

  // Post Reconstruction Estimated Property Price per Unit (e.g. 1.3x - 1.5x of general sales price in Gangnam core)
  const postReconstructionValuePerPyeong = params.generalSalesPricePerPyeong * 1.25;
  const estimatedNewUnitValueEok = (avgNewUnitSize * postReconstructionValuePerPyeong) / 10000;

  const SCENARIO_BAR_DATA = [
    { name: '개별재건축 (250%)', 세대수: 1200, 분담금: 3.5, 완공가치: 32 },
    { name: '통합 A (700%)', 세대수: grossUnits, 분담금: -avgRefundPerResidentEok, 완공가치: estimatedNewUnitValueEok },
    { name: '통합 B (1300%)', 세대수: Math.floor(grossUnits * 1.7), 분담금: -avgRefundPerResidentEok * 1.8, 완공가치: estimatedNewUnitValueEok * 1.25 }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="glass-panel-glow-cyan rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>PROJECT SAMSEONG : Urban Development Strategy Platform</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              FROM APARTMENTS TO A CITY: <span className="bg-gradient-to-r from-cyan-300 via-amber-300 to-amber-400 bg-clip-text text-transparent">삼성동 통합재건축 수지분석 엔진</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-3xl">
              삼성동 한솔 및 인접 5개 단지를 하나의 거대한 도시 마스터플랜으로 통합 개발 시, 용적률 700% ~ 1,300% 상향에 따른 사업성과 주민별 환급금 및 서울시 인허가 논리를 정밀 시뮬레이션합니다.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-cyan-500/30 p-4 rounded-xl text-right">
            <span className="text-[10px] text-slate-400 font-mono block">통합 개발 대상 총 대지면적</span>
            <span className="text-2xl font-black text-cyan-300">{totalLandAreaM2.toLocaleString()} m²</span>
            <span className="text-xs text-slate-400 font-mono block">({Math.round(totalLandAreaPyeong).toLocaleString()} 평 / 5개 단지 통합)</span>
          </div>
        </div>
      </div>

      {/* Control Sliders & Scenario Toggles */}
      <div className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            핵심 수지분석 변수 제어기 (Interactive Controls)
          </h3>
          <span className="text-xs text-slate-400">실시간 반영 모델링</span>
        </div>

        {/* FAR Scenario Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setParams(p => ({ ...p, farScenario: 250 }))}
            className={`p-4 rounded-xl border text-left transition-all ${
              params.farScenario === 250
                ? 'bg-slate-800 border-slate-600 text-white ring-2 ring-slate-400'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-slate-400">시나리오 0</div>
            <div className="text-lg font-extrabold text-white mt-1">개별 재건축 (250%)</div>
            <p className="text-xs text-slate-400 mt-1">단지별 나홀로 재건축 / 분담금 과다 발생 위험</p>
          </button>

          <button
            onClick={() => setParams(p => ({ ...p, farScenario: 700 }))}
            className={`p-4 rounded-xl border text-left transition-all ${
              params.farScenario === 700
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 ring-2 ring-amber-400'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-amber-400">시나리오 A (기본안)</div>
            <div className="text-lg font-extrabold text-amber-300 mt-1">통합 700% (준주거)</div>
            <p className="text-xs text-amber-200/70 mt-1">주거+상업+문화 융합 타운 / 분담금 최소화</p>
          </button>

          <button
            onClick={() => setParams(p => ({ ...p, farScenario: 1300 }))}
            className={`p-4 rounded-xl border text-left transition-all ${
              params.farScenario === 1300
                ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 ring-2 ring-cyan-400'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-cyan-400">시나리오 B (초고층 파격안)</div>
            <div className="text-lg font-extrabold text-cyan-300 mt-1">통합 1,300% (상업/TOD)</div>
            <p className="text-xs text-cyan-200/70 mt-1">삼성동 GBC-COEX 연계 랜드마크 콤플렉스</p>
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          
          {/* General Sales Price Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">예상 일반분양가 (평당):</span>
              <span className="text-amber-400 font-mono">{params.generalSalesPricePerPyeong.toLocaleString()} 만원</span>
            </div>
            <input
              type="range"
              min="8000"
              max="16000"
              step="500"
              value={params.generalSalesPricePerPyeong}
              onChange={e => setParams(p => ({ ...p, generalSalesPricePerPyeong: Number(e.target.value) }))}
              className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">삼성동 입지 감안 1.1억~1.4억/평 수준 반영</p>
          </div>

          {/* Construction Cost Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">평당 공사비:</span>
              <span className="text-cyan-400 font-mono">{params.constructionCostPerPyeong.toLocaleString()} 만원</span>
            </div>
            <input
              type="range"
              min="800"
              max="1500"
              step="50"
              value={params.constructionCostPerPyeong}
              onChange={e => setParams(p => ({ ...p, constructionCostPerPyeong: Number(e.target.value) }))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">하이엔드 브랜드 시공 기준 1,000만~1,200만원/평</p>
          </div>

          {/* Public Contribution Ratio */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">서울시 공공기여 비율:</span>
              <span className="text-purple-400 font-mono">{params.publicContributionRatio}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="25"
              step="1"
              value={params.publicContributionRatio}
              onChange={e => setParams(p => ({ ...p, publicContributionRatio: Number(e.target.value) }))}
              className="w-full accent-purple-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">공공임대/기반시설/AI혁신센터 기여도</p>
          </div>

        </div>

      </div>

      {/* Output Metrics Engine */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">총 신축 세대수</span>
          <p className="text-2xl font-black text-white">{grossUnits.toLocaleString()} 세대</p>
          <p className="text-[11px] text-emerald-400 font-medium">
            일반분양 {generalSalesUnits.toLocaleString()} 세대 공급
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">총 일반분양 수입</span>
          <p className="text-2xl font-black text-amber-400">약 {Math.round(totalGeneralSalesRevenueEok).toLocaleString()} 억원</p>
          <p className="text-[11px] text-slate-400">사업비 충당 핵심 재원</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">총 총사업비 (공사비 포함)</span>
          <p className="text-2xl font-black text-slate-300">약 {Math.round(totalProjectCostEok).toLocaleString()} 억원</p>
          <p className="text-[11px] text-slate-400">초고층 및 하이엔드 설계 반영</p>
        </div>

        <div className="glass-panel-glow-gold p-5 rounded-2xl border-amber-500/40 space-y-2">
          <span className="text-xs font-bold text-amber-300">조합원 1인당 평균 손익</span>
          <p className="text-2xl font-black text-emerald-400">
            {avgRefundPerResidentEok > 0 
              ? `환급금 약 ${avgRefundPerResidentEok.toFixed(1)} 억` 
              : `분담금 약 ${Math.abs(avgRefundPerResidentEok).toFixed(1)} 억`}
          </p>
          <p className="text-[11px] text-emerald-300 font-semibold">
            개별 재건축 대비 세대당 3~5억 이익 증대
          </p>
        </div>

      </div>

      {/* Scenario Bar Comparison Chart */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <PieChart className="w-5 h-5 text-cyan-400" />
          개별 재건축 vs 통합 700% vs 통합 1300% 경제성 실시간 비교
        </h3>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SCENARIO_BAR_DATA}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Legend />
              <Bar dataKey="세대수" name="총 세대수" fill="#06b6d4" />
              <Bar dataKey="완공가치" name="완공 후 예상 시세 (억원/34평)" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multi-Complex Equalization Matrix */}
      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-amber-400" />
              5개 단지 통합 이해관계 배분 모형 (Equalization Matrix)
            </h3>
            <p className="text-xs text-slate-400">
              "A단지는 땅값이 높은데 왜 합치는가?" 등의 주민 갈등을 데이터로 완벽 해결하는 비대칭 지분 배분 모델
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/40">
            Win-Win Data Model
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                <th className="p-3">단지명</th>
                <th className="p-3 text-right">기존 세대수</th>
                <th className="p-3 text-right">대지면적 (m²)</th>
                <th className="p-3 text-right">현재 용적률</th>
                <th className="p-3 text-right">평당 감정 가치</th>
                <th className="p-3 text-right text-amber-300">통합 시 예상 환급금</th>
                <th className="p-3 text-right text-cyan-300">재건축 후 자산 상승분</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200 font-mono">
              {INITIAL_COMPLEXES.map(c => {
                const isAnchor = c.id === 'hansol';
                const refund = isAnchor ? avgRefundPerResidentEok * 1.2 : avgRefundPerResidentEok * 0.95;
                const valueUp = estimatedNewUnitValueEok - 18;

                return (
                  <tr key={c.id} className={isAnchor ? 'bg-amber-500/10 font-bold text-amber-200' : 'hover:bg-slate-900/40'}>
                    <td className="p-3 font-sans flex items-center gap-2">
                      {c.name}
                      {isAnchor && <span className="px-1.5 py-0.5 text-[9px] bg-amber-500 text-slate-950 font-bold rounded">앵커 단지</span>}
                    </td>
                    <td className="p-3 text-right">{c.currentUnits} 세대</td>
                    <td className="p-3 text-right">{c.landAreaM2.toLocaleString()} m²</td>
                    <td className="p-3 text-right">{c.currentFAR}%</td>
                    <td className="p-3 text-right">{(c.estimatedLandPricePerPyeong / 10000).toFixed(2)} 억/평</td>
                    <td className="p-3 text-right text-emerald-400 font-extrabold">
                      +{refund.toFixed(1)} 억원
                    </td>
                    <td className="p-3 text-right text-cyan-300 font-extrabold">
                      +{valueUp.toFixed(1)} 억원
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Logic Cards for City Policy & Pitch */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-panel p-5 rounded-2xl border-cyan-500/30 space-y-3">
          <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            1. 서울시 설득 명분 (Urban Policy)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            나홀로 재건축으로 인한 난개발을 방지하고, 삼성동 COEX-GBC 축과 연계된 거대 통경축 및 공공 도서관/AI 혁신센터 공공기여 제출.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-amber-500/30 space-y-3">
          <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            2. 시공사/금융사 협상력 (B2B Deal)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            단일 단지 260세대가 아닌 3,800~6,500세대 총 사업비 3조원+ 대형 Deal로 랜드마크 공사비 및 프리미엄 브랜딩 우위 점유.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-purple-500/30 space-y-3">
          <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            3. AI Urban Platform 차별화 (Tech)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            주민 설득부터 용적률 시나리오, 3D 조감도 및 세대별 분담금 자동 산출 시스템을 갖춘 국내 유일의 디벨로퍼 전략 플랫폼 구축.
          </p>
        </div>

      </div>

    </div>
  );
};
