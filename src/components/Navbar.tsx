import React from 'react';
import {
  BarChart3,
  Database,
  Layers,
  Sparkles,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Compass,
  Download,
  Settings,
  RefreshCw,
  Search,
} from 'lucide-react';
import { BusinessProfile, CurrencyType, TabType } from '../types/saas';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  profile: BusinessProfile;
  onOpenProfile: () => void;
  currency: CurrencyType;
  onChangeCurrency: (c: CurrencyType) => void;
  onLoadSampleData: () => void;
  onDownloadSamples: () => void;
  hasData: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenProfile,
  currency,
  onChangeCurrency,
  onLoadSampleData,
  onDownloadSamples,
  hasData,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Inicio', icon: Compass },
    { id: 'datasets', label: 'Datasets', icon: Database },
    { id: 'dashboard', label: 'Dashboard Exec', icon: BarChart3 },
    { id: 'segmentation', label: 'Segmentación', icon: Layers },
    { id: 'retention', label: 'Retención & Uso', icon: TrendingUp },
    { id: 'projections', label: 'Proyecciones', icon: Sparkles },
    { id: 'simulator', label: 'Simulador SaaS', icon: Cpu },
    { id: 'decisions', label: 'Decisiones', icon: Compass },
    { id: 'quality', label: 'Calidad de Datos', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & SaaS Meta */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-xs shadow-indigo-200">
              Nō
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-lg">Nōva Analytics</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  SaaS Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {profile.type} • Objetivo: {profile.primaryGoal.slice(0, 48)}...
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-700">
              <button
                type="button"
                onClick={() => onChangeCurrency('PEN')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  currency === 'PEN' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Soles Peruanos (Por defecto Nōva Perú)"
              >
                PEN (S/)
              </button>
              <button
                type="button"
                onClick={() => onChangeCurrency('USD')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  currency === 'USD' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Dólares Americanos"
              >
                USD ($)
              </button>
            </div>

            {/* Load Sample Data Button */}
            <button
              type="button"
              onClick={onLoadSampleData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition-colors shadow-xs"
              title="Cargar datos simulados realistas de Nōva para explorar inmediatamente"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cargar Demo Nōva</span>
            </button>

            {/* Download Sample CSVs */}
            <button
              type="button"
              onClick={onDownloadSamples}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-xs"
              title="Descargar datasets CSV de ejemplo para probar subida manual"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden lg:inline">Descargar CSVs</span>
            </button>

            {/* Business Profile Modal Trigger */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Configurar Perfil de Negocio de Nōva"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
