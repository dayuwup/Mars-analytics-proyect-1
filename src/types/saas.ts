export type TabType =
  | 'overview'
  | 'datasets'
  | 'dashboard'
  | 'segmentation'
  | 'retention'
  | 'projections'
  | 'simulator'
  | 'decisions'
  | 'quality';

export type CurrencyType = 'PEN' | 'USD';

export interface BusinessProfile {
  name: string;
  type: string;
  primaryGoal: string;
  currency: CurrencyType;
  baseProPrice: number;
  baseTeamPrice: number;
}

export type ColumnDataType = 'number' | 'date' | 'category' | 'identifier' | 'boolean' | 'text';

export interface ColumnProfile {
  name: string;
  dataType: ColumnDataType;
  nullCount: number;
  nullPercentage: number;
  uniqueValuesCount: number;
  sampleValues: (string | number)[];
  detectedRole?: string; // e.g. 'user_id', 'plan', 'mrr', 'blocks', etc.
}

export interface DatasetFileState {
  id: 'dataset1' | 'dataset2';
  title: string;
  suggestedRole: string;
  fileName: string | null;
  rawData: Record<string, any>[];
  columns: ColumnProfile[];
  rowCount: number;
  columnCount: number;
  dateRange: { min: string | null; max: string | null };
  keyCategories: Record<string, { value: string; count: number }[]>;
  loadedAt: Date | null;
}

export interface MatchedRelation {
  colDataset1: string;
  colDataset2: string;
  role: string;
  matchRatePercent: number;
  matchedCount: number;
  totalUniqueD1: number;
  totalUniqueD2: number;
  utilityDescription: string;
  isReliable: boolean;
}

export interface MergedUserRecord {
  userId: string;
  plan: string;
  mrr: number;
  churnStatus: string;
  userProfile: string;
  country: string;
  device: string;
  blocksCreated: number;
  pagesCreated: number;
  aiQueries: number;
  stickersUsed: number;
  templatesUsed: number;
  sessionDuration: number;
  storageMb: number;
  loginsCount: number;
  csat: number;
  supportTickets: number;
  signupDate: string;
  lastActiveDate: string;
  isPaid: boolean;
  isChurned: boolean;
  hasD1: boolean;
  hasD2: boolean;
}

export interface GlobalFilterState {
  plan: string;
  device: string;
  userSegment: string;
  dateRange: 'all' | '7d' | '30d' | '90d' | '180d';
  searchQuery: string;
}

export interface SaaSExecutiveKPIs {
  mrr: { value: number; changePct: number; status: 'positive' | 'neutral' | 'negative'; available: boolean; note: string };
  totalRevenue: { value: number; changePct: number; status: 'positive' | 'neutral' | 'negative'; available: boolean; note: string };
  dau: { value: number; changePct: number; status: 'positive' | 'neutral' | 'negative'; available: boolean; note: string };
  mau: { value: number; changePct: number; status: 'positive' | 'neutral' | 'negative'; available: boolean; note: string };
  conversionRate: { value: number; changePct: number; status: 'positive' | 'neutral' | 'negative'; available: boolean; note: string };
  churnRate: { value: number; changePct: number; status: 'positive' | 'neutral' | 'negative'; available: boolean; note: string };
  avgBlocksPerUser: { value: number; changePct: number; status: 'positive' | 'neutral' | 'negative'; available: boolean; note: string };
  aiAdoptionRate: { value: number; changePct: number; status: 'positive' | 'neutral' | 'negative'; available: boolean; note: string };
  templatesAdoptionRate: { value: number; changePct: number; status: 'positive' | 'neutral' | 'negative'; available: boolean; note: string };
  stickersAdoptionRate: { value: number; changePct: number; status: 'positive' | 'neutral' | 'negative'; available: boolean; note: string };
  deviceDistribution: { tabletPct: number; desktopPct: number; mobilePct: number; available: boolean; note: string };
}

export interface UserSegmentData {
  name: string;
  type: 'plan' | 'profile' | 'device' | 'activity';
  userCount: number;
  userSharePct: number;
  revenueContribution: number;
  revenueSharePct: number;
  avgEngagementScore: number;
  retentionRatePct: number;
  opportunityNote: string;
}

export interface OpportunityItem {
  id: string;
  title: string;
  category: 'feature' | 'segment' | 'workflow';
  score: number; // 0 - 100
  factors: {
    usageFrequency: number;
    visualAiAdoption: number;
    subscriptionStability: number;
    timeInApp: number;
  };
  monetizationPotential: 'Muy Alto' | 'Alto' | 'Medio' | 'Moderado';
  suggestedAction: string;
}

export interface CohortItem {
  cohortName: string;
  size: number;
  day7Pct: number;
  day30Pct: number;
  day90Pct: number;
}

export interface FeatureCoOccurrence {
  featureA: string;
  featureB: string;
  correlationScore: number; // 0 - 100
  usersCount: number;
  churnDiffPct: number; // e.g. -40% churn
  insightText: string;
}

export interface GrowthProjectionData {
  horizonDays: 7 | 30 | 90;
  mau: { expected: number; lower: number; upper: number };
  mrr: { expected: number; lower: number; upper: number };
  storageGb: { expected: number; lower: number; upper: number };
  aiTokensMillions: { expected: number; lower: number; upper: number };
}

export interface StrategicDecisionRow {
  id: string;
  decision: string;
  datasetEvidence: string;
  estimatedImpact: string;
  risk: 'Bajo' | 'Medio' | 'Alto';
  priority: 'Alta' | 'Media' | 'Baja';
}

export interface RecommendationCategorized {
  id: string;
  category: 'HALLAZGO DEL DATASET' | 'SUGERENCIA EMPRESARIAL' | 'INFORMACIÓN FALTANTE';
  title: string;
  description: string;
  metricOrigin?: string;
  actionableNextStep?: string;
}

export interface MissingMetricData {
  metricName: string;
  whyNeeded: string;
  howToCollect: string;
  potentialImpactOnDecisions: string;
}

export interface DataQualityReport {
  overallScore: number; // 0 - 100
  rating: 'Alta' | 'Media' | 'Baja';
  dataset1Score: number;
  dataset2Score: number;
  totalNullPercentage: number;
  duplicateRowsCount: number;
  temporalConsistencyStatus: 'Óptima' | 'Aceptable' | 'Incompleta';
  limitations: string[];
  recommendations: string[];
}
