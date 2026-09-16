import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Presentation, Sparkles, AlertTriangle
} from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  content: React.ReactNode;
}

export const PitchDeck: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(1);

  const slides: Slide[] = [
    {
      id: 1,
      category: '01. COVER & EXECUTIVE VISION',
      title: 'THE NEW SAMSEONG',
      subtitle: 'Rebuilding the Core of Gangnam · FROM APARTMENTS TO A CITY',
      content: (
        <div className="text-center space-y-6 my-auto py-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Project SAMSEONG Master Thesis v1.0
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            THE NEW SAMSEONG
          </h1>
          
          <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-cyan-300 bg-clip-text text-transparent">
            Rebuilding the Core of Gangnam
          </p>

          <div className="py-4 border-y border-slate-800/80 max-w-2xl mx-auto">
            <p className="text-lg font-black text-amber-300 tracking-wider">"FROM APARTMENTS TO A CITY."</p>
            <p className="text-sm text-slate-300 mt-2">
              각 단지를 따로 재건축하는 것보다, 하나의 도시로 통합했을 때 얼마나 더 큰 가치가 만들어지는가?
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Prepared by AI Strategy & Urban Development Strategist · 2026–2029 Vision
          </div>
        </div>
      )
    },
    {
      id: 2,
      category: '02. OPPORTUNITY & MARKET POSITIONING',
      title: 'Why Samseong-dong & Why Integrated Core?',
      subtitle: '압구정·청담 바로 뒤, 강남 최고의 입지에서 새로운 도시적 정체성을 부여하다',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
          <div className="glass-panel p-6 rounded-2xl border-amber-500/30 space-y-3">
            <span className="text-xs font-bold text-amber-400">입지적 비대칭성</span>
            <h3 className="text-xl font-bold text-white">삼성동 GBC · COEX 영동대로 복합환승센터 축</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              대한민국 최고의 미래 상업·업무 중심지 삼성동에 위치하면서도, 기존 아파트들은 200~300세대 규모의 소단지로 분절되어 입지적 잠재력을 30%도 활용하지 못하고 있습니다.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-cyan-500/30 space-y-3">
            <span className="text-xs font-bold text-cyan-400">통합의 파급력</span>
            <h3 className="text-xl font-bold text-white">10,400평 대지 융합 = 3,800~6,500세대 초대형 도시</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              단지별 경계를 허물고 10,000평 이상의 대지를 하나로 묶으면 단순 주거단지가 아닌 쇼핑·문화·AI 오피스가 결합된 '도시 속의 도시(City within City)'로 탈바꿈합니다.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      category: '03. PROBLEM STATEMENT',
      title: '개별 나홀로 재건축의 한계와 비극',
      subtitle: '단지별 독립 재건축 시 발생할 수밖에 없는 경제적/도시적 비효율',
      content: (
        <div className="space-y-4 my-auto">
          <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-2xl flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-red-300">1. 분담금 폭탄 위험 (조합원당 3억~5억 추가 발생)</h4>
              <p className="text-xs text-slate-300 mt-1">
                기존 용적률이 230~250%로 높아, 300% 제한 개별 재건축 시 일반분양 물량이 극도로 적어 사업성이 악화됩니다.
              </p>
            </div>
          </div>

          <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-2xl flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-red-300">2. 커뮤니티 및 랜드마크 부재</h4>
              <p className="text-xs text-slate-300 mt-1">
                200세대 소단지는 대형 수영장, 조식 서비스, 테크 센터 등 하이엔드 커뮤니티 설치가 물리적으로 불가능합니다.
              </p>
            </div>
          </div>

          <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-2xl flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-red-300">3. 서울시 인허가 명분 부족</h4>
              <p className="text-xs text-slate-300 mt-1">
                나홀로 소단지는 서울시 입장에서 난개발을 촉진하므로 종상향 및 용적률 인센티브를 부여할 명분이 전혀 없습니다.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      category: '04. SITE MAP & LAND ASSEMBLY',
      title: '5개 단지 통합 대상지 조감 및 필지 통합',
      subtitle: '한솔아파트를 앵커 단지로 삼성동 노후 단지 필지 재구성',
      content: (
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4 my-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl">
              <span className="text-[10px] text-amber-300 font-bold block">1호 Anchor</span>
              <span className="text-sm font-black text-white">한솔아파트</span>
              <span className="text-xs text-slate-300 block mt-1">268세대</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 block">연계 단지 A</span>
              <span className="text-sm font-bold text-white">푸른솔아파트</span>
              <span className="text-xs text-slate-400 block mt-1">184세대</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 block">연계 단지 B</span>
              <span className="text-sm font-bold text-white">현대 1차</span>
              <span className="text-xs text-slate-400 block mt-1">320세대</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 block">연계 단지 C</span>
              <span className="text-sm font-bold text-white">석탑아파트</span>
              <span className="text-xs text-slate-400 block mt-1">140세대</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 block">연계 단지 D</span>
              <span className="text-sm font-bold text-white">우정에쉐르</span>
              <span className="text-xs text-slate-400 block mt-1">210세대</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
            <p className="font-bold text-amber-300">합산 대지면적: 34,385 m² (약 10,400평) · 총 1,122세대 통합 출발점</p>
            <p>도로 및 필지 정형화를 통해 지하 5층~지상 49~70층 규모의 통합 매스(Mass) 설계 가능.</p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      category: '05. ZONING & POLICY ALIGNMENT',
      title: '서울시 도시계획 조례 및 종상향 전략',
      subtitle: '제3종일반주거지역 → 준주거 / 중심상업지역 종상향 논리',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
          <div className="glass-panel p-5 rounded-2xl border-cyan-500/30 space-y-2">
            <span className="text-xs font-bold text-cyan-400">도시계획 명분 1</span>
            <h4 className="text-base font-bold text-white">통경축 & 대형 공공공지</h4>
            <p className="text-xs text-slate-300">한강 및 탄천으로 이어지는 30m 이상 대형 통경축 조성 및 공원화 기여</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-amber-500/30 space-y-2">
            <span className="text-xs font-bold text-amber-400">도시계획 명분 2</span>
            <h4 className="text-base font-bold text-white">GBC 연계 테크 콤플렉스</h4>
            <p className="text-xs text-slate-300">저층부 AI 혁신 스타트업 및 창업 지원센터 공공기여로 종상향 허용</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-purple-500/30 space-y-2">
            <span className="text-xs font-bold text-purple-400">도시계획 명분 3</span>
            <h4 className="text-base font-bold text-white">TOD 대중교통 중심 개발</h4>
            <p className="text-xs text-slate-300">9호선/GTX-A/C 연계 동선 구축으로 자동차 의존 최소화 친환경 주거지</p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      category: '06. DENSITY SCENARIO COMPARISON',
      title: '밀도 시나리오: 700% vs 1,300%',
      subtitle: '준주거 700% 3,800세대 타운 vs 중심상업 TOD 1,300% 6,500세대 타워',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
          <div className="glass-panel p-6 rounded-2xl border-amber-500/40 space-y-3">
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full">시나리오 A: 700% (현실적 최고)</span>
            <h3 className="text-xl font-bold text-white">준주거 랜드마크 타운</h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li>• 신축 3,800 세대 (일반분양 2,678 세대)</li>
              <li>• 최고 49~60 층 (스카이브릿지 연계)</li>
              <li>• 조합원 1인당 평균 <strong className="text-emerald-400">2.5억~3.5억 환급</strong></li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-cyan-500/40 space-y-3">
            <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-full">시나리오 B: 1,300% (파격적 도전)</span>
            <h3 className="text-xl font-bold text-white">상업 TOD 랜드마크 타워</h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li>• 신축 6,500 세대 (일반분양 5,378 세대)</li>
              <li>• 최고 70~80 층 (초고층 복합 타워)</li>
              <li>• 조합원 1인당 평균 <strong className="text-emerald-400">5.0억~7.0억 환급</strong></li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 7,
      category: '07. FINANCIAL ENGINE & REVENUE',
      title: '사업성 및 수익구조 추정 (Financial Model)',
      subtitle: '총 일반분양 수입 약 3.8조원 vs 총 사업비 약 2.4조원 = 압도적 사업성',
      content: (
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4 my-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-slate-900 rounded-xl">
              <span className="text-xs text-slate-400 block">총 일반분양 수입</span>
              <span className="text-2xl font-black text-amber-400">약 3조 8,500 억</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl">
              <span className="text-xs text-slate-400 block">총 총사업비</span>
              <span className="text-2xl font-black text-slate-300">약 2조 4,200 억</span>
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <span className="text-xs text-amber-300 font-bold block">순 사업이익 / 환급 재원</span>
              <span className="text-2xl font-black text-emerald-400">약 +1조 4,300 억</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center">
            ※ 삼성동 일반분양가 평당 1억 1,000만원, 공사비 평당 1,100만원 산정 기준
          </p>
        </div>
      )
    },
    {
      id: 8,
      category: '08. RESIDENT STAKEHOLDER MODEL',
      title: '주민 이해관계 배분 및 이탈 방지 모델',
      subtitle: '단지별 자산 감정평가 기반 비대칭 권리가액 보정 시스템',
      content: (
        <div className="space-y-4 my-auto">
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-xs space-y-2">
            <h4 className="text-sm font-bold text-cyan-300">핵심 솔루션: "Equalization Data Index (EDI)"</h4>
            <p className="text-slate-300">
              대지지분과 기존 감정평가액이 높은 단지(한솔 등)에 더 높은 권리가액 가중치를 부여하여, "합쳐서 손해보는 일"이 없도록 정교한 수지 배분 공식을 제안합니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl">
              <span className="text-xs font-bold text-emerald-400">앵커 단지 혜택</span>
              <p className="text-xs text-slate-300 mt-1">로얄동/로얄층 우선 배정권 및 상가 분배 이점</p>
            </div>
            <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl">
              <span className="text-xs font-bold text-emerald-400">연계 소단지 혜택</span>
              <p className="text-xs text-slate-300 mt-1">나홀로 재건축 대비 분담금 3억 절감 및 랜드마크 입주</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 9,
      category: '09. SEOUL CITY & PUBLIC BENEFIT',
      title: '서울시 및 구청 정책 부합성',
      subtitle: '공공주택, 국공립 어린이집, AI 데이터 도서관 기여로 초속 인허가',
      content: (
        <div className="grid grid-cols-3 gap-4 my-auto">
          <div className="glass-panel p-4 rounded-xl border-slate-800 text-center space-y-2">
            <span className="text-lg font-black text-amber-400">15%</span>
            <h4 className="text-xs font-bold text-white">공공기여 비율</h4>
            <p className="text-[11px] text-slate-400">서울시 통합 심의 신속통과 핵심 요건</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border-slate-800 text-center space-y-2">
            <span className="text-lg font-black text-cyan-400">신속통합기획</span>
            <h4 className="text-xs font-bold text-white">정비구역 지정 단축</h4>
            <p className="text-[11px] text-slate-400">인허가 기간 5년 → 2년 단축 목표</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border-slate-800 text-center space-y-2">
            <span className="text-lg font-black text-purple-400">AI Platform</span>
            <h4 className="text-xs font-bold text-white">스마트 시티 적용</h4>
            <p className="text-[11px] text-slate-400">AI 에너지/주차/보안 통합 관리</p>
          </div>
        </div>
      )
    },
    {
      id: 10,
      category: '10. EXECUTION ROADMAP & ACTION',
      title: '2026–2029 단계별 실행 로드맵',
      subtitle: 'Research → Masterplan → Proposition → Execution',
      content: (
        <div className="grid grid-cols-4 gap-3 my-auto text-xs">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <span className="text-amber-400 font-bold block">2026</span>
            <h5 className="font-bold text-white">Masterplan 1.0</h5>
            <p className="text-slate-400 text-[11px]">수지분석 툴 완성 및 삼성동 1호 스터디 구축</p>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <span className="text-amber-400 font-bold block">2027</span>
            <h5 className="font-bold text-white">주민 설득 & Network</h5>
            <p className="text-slate-400 text-[11px]">추진위/주민대표 자문 및 레퍼런스 확장</p>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <span className="text-amber-400 font-bold block">2028</span>
            <h5 className="font-bold text-white">법인화 & B2B</h5>
            <p className="text-slate-400 text-[11px]">Urban Tech Strategy 컨설팅 사업화</p>
          </div>
          <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl space-y-1">
            <span className="text-amber-300 font-extrabold block">2029</span>
            <h5 className="font-bold text-white">도시개발 사업가</h5>
            <p className="text-slate-300 text-[11px]">지분가치 50억+ 완성 및 리더 도약</p>
          </div>
        </div>
      )
    }
  ];

  const current = slides.find(s => s.id === currentSlide) || slides[0];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Presentation Header */}
      <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Presentation className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Project SAMSEONG 10-Slide Presentation Deck</h3>
            <p className="text-xs text-slate-400">Slide {currentSlide} of {slides.length} · {current.category}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(1, prev - 1))}
            disabled={currentSlide === 1}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-slate-300 px-3 py-1 bg-slate-900 rounded-lg">
            {currentSlide} / {slides.length}
          </span>

          <button
            onClick={() => setCurrentSlide(prev => Math.min(slides.length, prev + 1))}
            disabled={currentSlide === slides.length}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Container */}
      <div className="glass-panel-glow-purple rounded-2xl p-8 md:p-12 min-h-[500px] flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-purple-950/20">
        <div className="absolute top-0 right-0 p-8 text-8xl font-black text-slate-800/20 pointer-events-none select-none font-mono">
          0{current.id}
        </div>

        <div>
          <span className="text-xs font-mono tracking-widest text-purple-400 uppercase">{current.category}</span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-1">{current.title}</h2>
          <p className="text-sm md:text-base text-slate-300 mt-2 font-medium">{current.subtitle}</p>
        </div>

        <div className="my-8">
          {current.content}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          <span>THE NEW SAMSEONG : Rebuilding the Core of Gangnam</span>
          <span>Confidential · Urban Strategy Lab</span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {slides.map(s => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(s.id)}
            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all border ${
              currentSlide === s.id
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-bold'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {s.id}. {s.title.split(':')[0]}
          </button>
        ))}
      </div>

    </div>
  );
};
