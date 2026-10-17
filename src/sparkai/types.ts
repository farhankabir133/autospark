// SparkPilot shared types — frontend types (production: expert confirms stock/prices before booking)
export type Language = 'en' | 'bn' | 'mixed';
export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  createdAt: number;
  status?: 'sending' | 'sent' | 'failed';
  vehicles?: DemoVehicle[];
  actions?: QuickAction[];
  /** Renders as the rich welcome card instead of a chat bubble. */
  kind?: 'welcome';
}

export interface QuickAction {
  id: string;
  label: string;
  labelBn?: string;
  intent: ConversationIntent;
}

export type ConversationIntent =
  | 'find-car' | 'explore' | 'compare' | 'budget'
  | 'preorder' | 'service' | 'expert' | 'general';

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
  preferences: CustomerPreferences;
}

export interface CustomerPreferences {
  budgetLakh?: number;
  hybrid?: boolean;
  bodyType?: string;
  manufacturer?: string;
  language?: Language;
  timeline?: string;
}

export type StockKind = 'ready' | 'preorder' | 'demo';

export interface DemoVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  variant: string;
  fuel: string;
  hybrid: boolean;
  transmission: string;
  bodyType: string;
  budgetLakh: number;
  stock: StockKind;
  features: string[];
  demo: true;
}

export interface LeadInput {
  name: string;
  whatsapp: string;
  language: string;
  interest: string;
  budgetRange: string;
  timeline: string;
  notes?: string;
  consent: boolean;
}

export interface FinanceEstimate {
  priceLakh: number;
  downPct: number;
  annualRatePct: number | null;
  months: number;
  downPaymentBDT: number;
  loanBDT: number;
  monthlyBDT: number | null;
}
