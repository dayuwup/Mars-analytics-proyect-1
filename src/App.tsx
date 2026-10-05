import React, { useEffect, useMemo, useState } from 'react';
import {
  BusinessProfile,
  CurrencyType,
  DatasetFileState,
  GlobalFilterState,
  TabType,
} from './types/saas';
import { findDatasetRelations } from './utils/csvParser';
import {
  buildMergedUserBase,
  calculateBehaviorAndOperations,
  calculateDataQuality,
  calculateExecutiveKPIs,
  calculateGrowthProjections,
  calculateOpportunityScores,
  calculateRetentionCohorts,
  calculateUserSegmentation,
  generateStrategicDecisionsAndRecs,
} from './utils/analyticsEngine';
import { createNovaSampleData, downloadCSV } from './utils/sampleData';
import { Navbar } from './components/Navbar';
import { BusinessProfileModal } from './components/BusinessProfileModal';
import { GlobalFiltersBar } from './components/GlobalFiltersBar';
import { OverviewHero } from './components/OverviewHero';
import { DataUploader } from './components/DataUploader';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { UserSegmentation } from './components/UserSegmentation';
import { RetentionUsage } from './components/RetentionUsage';
import { GrowthProjections } from './components/GrowthProjections';
import { SaaSSimulator } from './components/SaaSSimulator';
import { StrategicDecisions } from './components/StrategicDecisions';
import { DataQualityView } from './components/DataQualityView';

export default function App() {
  // PASO 4: Perfil del Negocio con valores predeterminados de Nōva
  const [profile, setProfile] = useState<BusinessProfile>({
    name: 'Nōva',
    type: 'Plataforma Digital / SaaS Freemium de Productividad',
    primaryGoal: 'Maximizar conversión de Free a Pro y reducir la tasa de cancelación (Churn)',
    currency: 'PEN', // Por defecto Soles (Perú)
    baseProPrice: 18.0,
    baseTeamPrice: 38.0,
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Datasets state
  const [dataset1, setDataset1] = useState<DatasetFileState | null>(null);
  const [dataset2, setDataset2] = useState<DatasetFileState | null>(null);
  const [sampleCsvD1, setSampleCsvD1] = useState<string>('');
  const [sampleCsvD2, setSampleCsvD2] = useState<string>('');

  // Global Filter State (PASO 19)
  const [filters, setFilters] = useState<GlobalFilterState>({
    plan: 'all',
    device: 'all',
    userSegment: 'all',
    dateRange: 'all',
    searchQuery: '',
  });

  // Load sample dataset on mount so the user has an immediate, fully functional application
  useEffect(() => {
    const demo = createNovaSampleData();
    setDataset1(demo.dataset1);
    setDataset2(demo.dataset2);
    setSampleCsvD1(demo.csvStringD1);
    setSampleCsvD2(demo.csvStringD2);
  }, []);

  const handleLoadDemo = () => {
    const demo = createNovaSampleData();
    setDataset1(demo.dataset1);
    setDataset2(demo.dataset2);
    setSampleCsvD1(demo.csvStringD1);
    setSampleCsvD2(demo.csvStringD2);
    alert('Datasets de demostración de Nōva cargados con éxito.');
  };

  const handleDownloadSampleCSVs = () => {
    if (!sampleCsvD1 || !sampleCsvD2) {
      const demo = createNovaSampleData();
      downloadCSV(demo.csvStringD1, 'nova_usuarios_suscripciones.csv');
      setTimeout(() => {
        downloadCSV(demo.csvStringD2, 'nova_eventos_actividad.csv');
      }, 400);
    } else {
      downloadCSV(sampleCsvD1, 'nova_usuarios_suscripciones.csv');
      setTimeout(() => {
        downloadCSV(sampleCsvD2, 'nova_eventos_actividad.csv');
      }, 400);
    }
  };

  // Derive relations between Dataset 1 and Dataset 2 (PASO 3)
  const relations = useMemo(() => {
    return findDatasetRelations(dataset1, dataset2);
  }, [dataset1, dataset2]);

  // Merge datasets by user_id / workspace_id and apply global filters
  const { users: filteredUsers } = useMemo(() => {
    return buildMergedUserBase(dataset1, dataset2, filters);
  }, [dataset1, dataset2, filters]);

  // Executive SaaS KPIs (PASO 5)
  const kpis = useMemo(() => {
    return calculateExecutiveKPIs(filteredUsers, dataset1, dataset2);
  }, [filteredUsers, dataset1, dataset2]);

  // User Segmentation & Opportunity Scoring (PASO 6 & 7)
  const segments = useMemo(() => {
    return calculateUserSegmentation(filteredUsers);
  }, [filteredUsers]);

  const opportunities = useMemo(() => {
    return calculateOpportunityScores(filteredUsers);
  }, [filteredUsers]);

  // Retention & Cohorts (PASO 8)
  const { cohorts, dailyActivity } = useMemo(() => {
    return calculateRetentionCohorts(filteredUsers);
  }, [filteredUsers]);

  // Growth Projections (PASO 9 & 10)
  const projections = useMemo(() => {
    return calculateGrowthProjections(filteredUsers, profile);
  }, [filteredUsers, profile]);

  // Behavior, Co-occurrence & Operations (PASO 11 & 12)
  const { coOccurrences, abandonmentRiskPct, operationalBottlenecks } = useMemo(() => {
    return calculateBehaviorAndOperations(filteredUsers);
  }, [filteredUsers]);

  // Strategic Decisions & Recommendations (PASO 15, 16, 17)
  const { decisions, recommendations, missingMetrics } = useMemo(() => {
    return generateStrategicDecisionsAndRecs(filteredUsers, profile, kpis);
  }, [filteredUsers, profile, kpis]);

  // Data Quality Report (PASO 18 & 20)
  const qualityReport = useMemo(() => {
    return calculateDataQuality(dataset1, dataset2);
  }, [dataset1, dataset2]);

  // Filter options derived from current users
  const availablePlans = useMemo(() => {
    const s = new Set<string>();
    filteredUsers.forEach((u) => {
      if (u.plan && u.plan !== 'Desconocido') s.add(u.plan);
    });
    return Array.from(s);
  }, [filteredUsers]);

  const availableDevices = useMemo(() => {
    const s = new Set<string>();
    filteredUsers.forEach((u) => {
      if (u.device) s.add(u.device);
    });
    return Array.from(s);
  }, [filteredUsers]);

  const availableSegments = useMemo(() => {
    const s = new Set<string>();
    filteredUsers.forEach((u) => {
      if (u.userProfile) s.add(u.userProfile);
    });
    return Array.from(s);
  }, [filteredUsers]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        currency={profile.currency}
        onChangeCurrency={(c) => setProfile({ ...profile, currency: c })}
        onLoadSampleData={handleLoadDemo}
        onDownloadSamples={handleDownloadSampleCSVs}
        hasData={Boolean(dataset1 || dataset2)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Global Filter Bar: shown across active operational modules */}
        {activeTab !== 'overview' && activeTab !== 'datasets' && (
          <GlobalFiltersBar
            filters={filters}
            onChange={setFilters}
            availablePlans={availablePlans}
            availableDevices={availableDevices}
            availableSegments={availableSegments}
            totalFilteredUsers={filteredUsers.length}
          />
        )}

        {/* Tab Router */}
        {activeTab === 'overview' && (
          <OverviewHero
            profile={profile}
            kpis={kpis}
            currency={profile.currency}
            onNavigate={setActiveTab}
            onLoadDemo={handleLoadDemo}
            dataset1Loaded={Boolean(dataset1)}
            dataset2Loaded={Boolean(dataset2)}
            totalUsers={filteredUsers.length}
          />
        )}

        {activeTab === 'datasets' && (
          <DataUploader
            dataset1={dataset1}
            dataset2={dataset2}
            relations={relations}
            onDatasetLoaded={(d1, d2) => {
              setDataset1(d1);
              setDataset2(d2);
            }}
            onLoadSampleData={handleLoadDemo}
          />
        )}

        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            kpis={kpis}
            users={filteredUsers}
            currency={profile.currency}
            dailyActivity={dailyActivity}
          />
        )}

        {activeTab === 'segmentation' && (
          <UserSegmentation
            segments={segments}
            opportunities={opportunities}
            currency={profile.currency}
          />
        )}

        {activeTab === 'retention' && (
          <RetentionUsage
            cohorts={cohorts}
            coOccurrences={coOccurrences}
            abandonmentRiskPct={abandonmentRiskPct}
            operationalBottlenecks={operationalBottlenecks}
          />
        )}

        {activeTab === 'projections' && (
          <GrowthProjections
            projections={projections}
            users={filteredUsers}
            currency={profile.currency}
          />
        )}

        {activeTab === 'simulator' && (
          <SaaSSimulator
            users={filteredUsers}
            profile={profile}
            currency={profile.currency}
          />
        )}

        {activeTab === 'decisions' && (
          <StrategicDecisions
            decisions={decisions}
            recommendations={recommendations}
            missingMetrics={missingMetrics}
          />
        )}

        {activeTab === 'quality' && (
          <DataQualityView
            report={qualityReport}
            dataset1={dataset1}
            dataset2={dataset2}
          />
        )}
      </main>

      {/* Business Profile Modal */}
      <BusinessProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={setProfile}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Nōva SaaS Analytics</span>
            <span>• Procesamiento 100% local en el navegador (Privacidad garantizada)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Sector: Productividad &amp; Gestión del Conocimiento</span>
            <span>v2.4.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
