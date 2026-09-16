import React, { useState } from 'react';
import type { CareerYearStep, ActionItem } from '../types';
import { 
  TrendingUp, AlertTriangle, CheckCircle2, 
  Target, ShieldAlert, Sparkles, Flame, CheckSquare, Square
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const CAREER_DATA: CareerYearStep[] = [
  {
    year: 2026,
    positionA: 'Senior Manager (현대카드)',
    salaryA: '약 2.0억원',
    netWorthA: '약 23억원 (부동산40억-대출20억+현금3억)',
    roleA: 'AI 플랫폼 사업전략 / C-level 제안',
    marketRepA: 'PPT 및 사업제안 강자',

    positionB: 'AI Strategy / BD Lead & 1호 Deal 개척',
    salaryB: '2.0 ~ 2.3억원',
    netWorthB: '23 ~ 25억원',
    roleB: 'AI 플랫폼 기반 대형 B2B/해외 Deal 1~2개 직접 창출 (100억+ 사업 체계)',
    marketRepB: 'AI 기술을 실제 사업과 Deal로 연결하는 전략가',
    dealsB: '최소 1~2개 전략적 Deal (해외 금융 / PLCC Alliance / 100억+ PxC)'
  },
  {
    year: 2027,
    positionA: 'Senior Manager ~ 팀장',
    salaryA: '2.0 ~ 2.3억원',
    netWorthA: '24 ~ 27억원',
    roleA: '대형 제안 및 내부 조직 사업 총괄',
    marketRepA: '현대카드 내부 AI 사업기획 리더',

    positionB: 'AX Business Lead / Urban Tech Strategist',
    salaryB: '2.3 ~ 2.8억원',
    netWorthB: '26 ~ 32억원',
    roleB: '대표 Deal 2~3개 (50억, 80억, 150억) 관여 및 "Project SAMSEONG" 통합재건축 마스터플랜 구축',
    marketRepB: 'Global AI/Data & Urban Development Business Development Lead',
    dealsB: '대표 Deal 2~3개 (누적 300억+ 관여 사업)'
  },
  {
    year: 2028,
    positionA: '팀장 / 실장급',
    salaryA: '2.2 ~ 2.6억원',
    netWorthA: '26 ~ 31억원',
    roleA: '글로벌 사업 및 카드 플랫폼 고도화',
    marketRepA: '대기업 내부 수석 기획자',

    positionB: 'AI Business Strategy / Urban Tech Founder & Lead',
    salaryB: '2.8 ~ 3.5억원 (+ 스톡옵션/독립사업)',
    netWorthB: '32 ~ 42억원',
    roleB: '도시개발/통합재건축 컨설팅 2~3개 단지 프로젝트 확보 및 AI Data 융합 사업화',
    marketRepB: '복잡한 도시개발과 AI 기술을 융합해 가치를 창출하는 CBO/디벨로퍼',
    dealsB: '통합재건축 자문/참여 사업 scale-up (누적 1,000억+ 사업)'
  },
  {
    year: 2029,
    positionA: '임원 후보급',
    salaryA: '2.5 ~ 3.0억원',
    netWorthA: '29 ~ 35억원',
    roleA: '전략 및 사업 총괄 임원',
    marketRepA: '현대카드 AI/Data 사업 잘 설명하는 사람',

    positionB: 'Head of AI Strategy & Urban Development Entrepreneur',
    salaryB: '3.0 ~ 5.0억원+ (스톡옵션 / 개발 지분가치 50억+)',
    netWorthB: '35 ~ 50억원+ (Equity 지분가치 연계)',
    roleB: 'AI Business Strategist + 통합재건축 도시개발 사업가 투트랙 완결',
    marketRepB: 'AI 사업과 도시개발 Transformation을 직접 만들어 지분가치를 증명하는 사람',
    dealsB: '지분가치 50억+ 보유 및 독보적 C-level Network'
  }
];

const INITIAL_ACTIONS: ActionItem[] = [
  {
    id: 1,
    title: '내가 참여한 Deal 숫자로 정량화',
    subtitle: 'Deal Inventory',
    detail: '고객 / 문제 / 내가 한 일 / C-level 의사결정권자 / 사업 규모 / 최종 성과를 엑셀 표로 완벽 정리',
    completed: false
  },
  {
    id: 2,
    title: 'UNIVERSE를 "Consumer Intelligence Business Model"로 커리어화',
    subtitle: 'Business Case Building',
    detail: '"현대카드에서 만든 플랫폼"이 아닌 "글로벌 확장 가능한 AI Business Model"로 재정의 문서화',
    completed: false
  },
  {
    id: 3,
    title: '대표 성공사례 3개 5분 영문 스피치 완성',
    subtitle: 'Global Presentation',
    detail: 'Problem → Insight → Strategy → Deal → Result 축으로 C-level 상시 피칭 가능하도록 훈련',
    completed: false
  },
  {
    id: 4,
    title: '외부 시장에 내 이름으로 남는 레퍼런스 1개 확보',
    subtitle: 'Market Reputation',
    detail: '컨퍼런스 발표, 해외 사업 발표, 업계 기고 등 "현대카드 직원"이 아닌 "AI Business 전문가"로 검색',
    completed: false
  },
  {
    id: 5,
    title: 'Project SAMSEONG 통합재건축 Master Plan 1.0 구축',
    subtitle: 'Urban Tech Thesis',
    detail: '삼성동 한솔+주변 단지 통합 700%/1300% 시나리오 수지분석 및 주민 설득전략 문서 완성',
    completed: false
  }
];

const CHART_DATA = [
  { year: '2026', A_연봉: 2.0, B_연봉: 2.1, A_자산: 23, B_자산: 24 },
  { year: '2027', A_연봉: 2.15, B_연봉: 2.55, A_자산: 25.5, B_자산: 29 },
  { year: '2028', A_연봉: 2.4, B_연봉: 3.15, A_자산: 28.5, B_자산: 37 },
  { year: '2029', A_연봉: 2.75, B_연봉: 4.5, A_자산: 32, B_자산: 45 }
];

export const CareerSimulator: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2029);
  const [actions, setActions] = useState<ActionItem[]>(INITIAL_ACTIONS);

  const toggleAction = (id: number) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const completedCount = actions.filter(a => a.completed).length;
  const currentStep = CAREER_DATA.find(d => d.year === selectedYear) || CAREER_DATA[3];

  return (
    <div className="space-[#121827] space-y-8 pb-16">
      
      {/* Top Hero Banner */}
      <div className="glass-panel-glow-gold rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>투트랙 커리어 & 자산 역산 시뮬레이터</span>
            </div>
            <div className="text-xs text-slate-400">
              현재 위치 (2026) → 2029년 시장가치 역산 (Salary → Career Position → Equity & Wealth)
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
            "연봉 2억 PPT 전문가" vs <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-cyan-300 bg-clip-text text-transparent">"지분가치 50억+ AI & 도시개발 사업가"</span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-4xl leading-relaxed">
            안정적인 직장 현금흐름(연 2~3억)을 유지하면서, <strong className="text-amber-300">Project SAMSEONG 통합재건축</strong>과 <strong className="text-cyan-300">AI Data Deal</strong>을 통해 4년 내 자산가치 및 Career Positioning을 퀀텀 럼프 시키는 전략입니다.
          </p>
        </div>
      </div>

      {/* Year Selection Tabs */}
      <div className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl border border-slate-800">
        <span className="text-xs font-semibold text-slate-400 px-3">타임라인 이동 (2026 ~ 2029):</span>
        <div className="flex space-x-2">
          {CAREER_DATA.map(d => (
            <button
              key={d.year}
              onClick={() => setSelectedYear(d.year)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedYear === d.year
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {d.year}년
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Scenario A Card */}
        <div className="glass-panel rounded-2xl p-6 border-slate-700/50 space-y-5 relative">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-bold border border-slate-700">
              시나리오 A: 현상 유지 / 보수적 경로
            </span>
            <span className="text-xs text-slate-400 font-semibold">{currentStep.year}년 기준</span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400">포지션 / 직책</p>
              <h3 className="text-lg font-bold text-slate-200">{currentStep.positionA}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div>
                <p className="text-[11px] text-slate-400">예상 연봉</p>
                <p className="text-base font-extrabold text-slate-300">{currentStep.salaryA}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">예상 순자산</p>
                <p className="text-base font-extrabold text-slate-300">{currentStep.netWorthA}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400">핵심 역할</p>
              <p className="text-sm text-slate-300">{currentStep.roleA}</p>
            </div>

            <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl space-y-1">
              <p className="text-xs font-semibold text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                시장 인식의 한계
              </p>
              <p className="text-xs text-slate-300">{currentStep.marketRepA}</p>
              <p className="text-[11px] text-red-300/70 pt-1">
                "회사 브랜드에 의존하는 PPT/제안 강자"로 평가가 한정될 위험 존재.
              </p>
            </div>
          </div>
        </div>

        {/* Scenario B Card (Target Upside) */}
        <div className="glass-panel-glow-amber rounded-2xl p-6 border-amber-500/40 space-y-5 relative bg-gradient-to-b from-slate-900/90 to-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-extrabold border border-amber-500/40 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              시나리오 B: AI Strategy & 도시개발 투트랙 (추천)
            </span>
            <span className="text-xs text-amber-300 font-bold">{currentStep.year}년 목표</span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-amber-300/80">포지션 / 직책</p>
              <h3 className="text-xl font-extrabold text-amber-300">{currentStep.positionB}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-amber-950/30 p-3 rounded-xl border border-amber-500/30">
              <div>
                <p className="text-[11px] text-amber-300/80">예상 소득 / 보수</p>
                <p className="text-lg font-black text-white">{currentStep.salaryB}</p>
              </div>
              <div>
                <p className="text-[11px] text-amber-300/80">목표 순자산 (지분포함)</p>
                <p className="text-lg font-black text-amber-300">{currentStep.netWorthB}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-amber-300/80">핵심 역할 & 사업 실적</p>
              <p className="text-sm font-medium text-slate-200">{currentStep.roleB}</p>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
              <p className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                독보적 시장 포지셔닝
              </p>
              <p className="text-xs font-bold text-white">{currentStep.marketRepB}</p>
              <p className="text-xs text-amber-200/80 pt-1 font-mono">
                [Deal Target] {currentStep.dealsB}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Trajectory Visual Chart */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              2026 → 2029 자산 및 소득 성장 비교 그래프
            </h3>
            <p className="text-xs text-slate-400">Salary 중심 성장 vs Equity & Urban Development 기반 퀀텀 점프</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" unit="억" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                formatter={(value: any) => [`${value} 억원`, '']}
              />
              <Legend />
              <Area type="monotone" dataKey="A_자산" name="시나리오 A 순자산 (억)" stroke="#64748b" fillOpacity={1} fill="url(#colorA)" />
              <Area type="monotone" dataKey="B_자산" name="시나리오 B 순자산/Equity (억)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorB)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3 Things to Abandon vs 3 Things to Seize */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Abandon */}
        <div className="glass-panel rounded-2xl p-6 border-red-500/30 space-y-4">
          <div className="flex items-center space-x-2 text-red-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">지금 당장 버려야 할 3가지</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl">
              <h4 className="text-sm font-bold text-red-300">① "PPT를 잘 만드는 사람"이라는 정체성</h4>
              <p className="text-xs text-slate-300 mt-1">PPT는 수단일 뿐 정체성이 아닙니다. 앞으로는 "Deal을 만들어내는 리더"로 스스로를 정의해야 합니다.</p>
            </div>
            <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl">
              <h4 className="text-sm font-bold text-red-300">② 모든 일을 직접 완벽하게 처리하려는 습관</h4>
              <p className="text-xs text-slate-300 mt-1">자료 조사부터 PPT 표현까지 직접 다 하는 것은 리더의 독입니다. "방향을 정하고 조직이 실행"하게 만드세요.</p>
            </div>
            <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl">
              <h4 className="text-sm font-bold text-red-300">③ 소소한 디테일에 과도한 시간을 쓰는 것</h4>
              <p className="text-xs text-slate-300 mt-1">100억짜리 사업 문제와 100만원짜리 문구 수정에 동등한 사고력을 분배하지 마세요. "Deal을 움직이는가?"를 기준 삼으세요.</p>
            </div>
          </div>
        </div>

        {/* Seize */}
        <div className="glass-panel rounded-2xl p-6 border-emerald-500/30 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Target className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">반드시 잡아채야 할 3가지</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-xl">
              <h4 className="text-sm font-bold text-emerald-300">① "숫자로 증명되는 Deal" (30억 → 100억 → 300억)</h4>
              <p className="text-xs text-slate-300 mt-1">향후 3년간 내가 전략적으로 관여하고 성사시킨 사업 규모를 3개 이상 숫자로 확보하세요.</p>
            </div>
            <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-xl">
              <h4 className="text-sm font-bold text-emerald-300">② C-level Network (의사결정 파트너십)</h4>
              <p className="text-xs text-slate-300 mt-1 font-semibold text-white">
                "C-level 보고자료를 작성해주는 사람" → "C-level과 직접 사업을 논의하는 전략 파트너"로 전환
              </p>
            </div>
            <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-xl">
              <h4 className="text-sm font-bold text-emerald-300">③ APAC / Middle East 해외 확장성</h4>
              <p className="text-xs text-slate-300 mt-1">AI + 금융 + 마케팅 + Data + 글로벌 조합은 시장에서 매우 극희소한 차별화 역량이 됩니다.</p>
            </div>
          </div>
        </div>

      </div>

      {/* 2026 Action Checklist */}
      <div className="glass-panel-glow-cyan rounded-2xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              2026년 남은 기간 실행해야 할 5대 Action Items
            </h3>
            <p className="text-xs text-slate-400">주당 5~7시간 투트랙 투자로 12개월 내 자산 및 커리어 옵션 완성</p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/90 px-4 py-2 rounded-xl border border-cyan-500/30">
            <span className="text-xs text-slate-300">달성률:</span>
            <span className="text-lg font-black text-cyan-400">{completedCount} / {actions.length}</span>
            <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-cyan-400 h-full transition-all duration-500" 
                style={{ width: `${(completedCount / actions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {actions.map(action => (
            <div
              key={action.id}
              onClick={() => toggleAction(action.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                action.completed
                  ? 'bg-cyan-950/30 border-cyan-500/50 opacity-90'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button className="mt-0.5 text-cyan-400 focus:outline-none">
                {action.completed ? (
                  <CheckSquare className="w-5 h-5 text-cyan-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold ${action.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                    {action.id}. {action.title}
                  </h4>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                    {action.subtitle}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{action.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
