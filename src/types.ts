export interface TradingSystemSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  code?: string;
  language?: string;
}

export interface TradingSystem {
  idea: string;
  generatedAt: string;
  sections: TradingSystemSection[];
}

export interface FormState {
  idea: string;
  market: string;
  country: string;
  style: string;
  riskLevel: string;
  capital: string;
}
