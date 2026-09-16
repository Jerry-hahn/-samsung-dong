export type ViewTab = 'career' | 'reconstruction' | 'pitchdeck';

export interface CareerYearStep {
  year: number;
  positionA: string;
  salaryA: string;
  netWorthA: string;
  roleA: string;
  marketRepA: string;
  
  positionB: string;
  salaryB: string;
  netWorthB: string;
  roleB: string;
  marketRepB: string;
  dealsB: string;
}

export interface ComplexData {
  id: string;
  name: string;
  currentUnits: number;
  landAreaM2: number; // 대지면적 m^2
  currentFAR: number; // 현재 용적률 (%)
  avgUnitSizePyeong: number;
  estimatedLandPricePerPyeong: number; // 평당 대지지분 가치 (만원)
}

export interface ReconstructionParams {
  farScenario: number; // 250, 700, 1300 (%)
  generalSalesPricePerPyeong: number; // 만원 (e.g. 8,000만원/평 ~ 12,000만원/평)
  constructionCostPerPyeong: number; // 만원 (e.g. 900만원/평 ~ 1,200만원/평)
  publicContributionRatio: number; // 공공기여 비율 (%)
  commercialAreaRatio: number; // 상업/테크 공간 비율 (%)
}

export interface ActionItem {
  id: number;
  title: string;
  subtitle: string;
  detail: string;
  completed: boolean;
}
