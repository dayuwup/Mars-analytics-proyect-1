import React from 'react';
import {
  Database,
  BarChart3,
  Layers,
  TrendingUp,
  Sparkles,
  Cpu,
  Compass,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  DollarSign,
  Users,
} from 'lucide-react';
import { BusinessProfile, CurrencyType, SaaSExecutiveKPIs, TabType } from '../types/saas';

interface OverviewHeroProps {
  profile: BusinessProfile;
  kpis: SaaSExecutiveKPIs;
  currency: CurrencyType;
  onNavigate: (tab: TabType) => void;
  onLoadDemo: () => void;
  dataset1Loaded: boolean;
  dataset2Loaded: boolean;
  totalUsers: number;
}

export const OverviewHero: React.FC<OverviewHeroProps> = ({
  profile,
  kpis,
  currency,
  onNavigate,
  onLoadDemo,
  dataset1Loaded,
  dataset2Loaded,
  totalUsers,
}) => {
  const currencySymbol = currency === 'PEN' ? 'S/ ' : '$ ';

  const modules = [
    {
      tab: 'datasets' as TabType,
      title: 'Datasets & Relaciones',
      desc: 'Carga de CSVs, detección automática de columnas, sinónimos SaaS y unión sin forzar datos.',
      icon: Database,
      badge: dataset1Loaded && dataset2Loaded ? '2 Datasets Conectados' : 'Requiere Datos',
      badgeClass: dataset1Loaded && dataset2Loaded ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700',
    },
    {
      tab: 'dashboard' as TabType,
      title: 'Dashboard Ejecutivo',
      desc: 'MRR, Churn, DAU/MAU, conversión Free a Pro, adopción de IA y distribución de hardware.',
      icon: BarChart3,
      badge: 'KPIs en Vivo',
      badgeClass: 'bg-indigo-50 text-indigo-700',
    },
    {
      tab: 'segmentation' as TabType,
      title: 'Segmentación & Opportunity Score',
      desc: 'Desglose por plan, ocupación, hardware y ranking de oportunidades de monetización (0 a 100).',
      icon: Layers,
      badge: 'Top Oportunidades',
      badgeClass: 'bg-indigo-50 text-indigo-700',
    },
    {
      tab: 'retention' as TabType,
      title: 'Retención & Uso In-App',
      desc: 'Cohortes a 7, 30 y 90 días, mapa de calor horario, características usadas juntas y cuellos de botella.',
      icon: TrendingUp,
      badge: 'Heatmap & Cohortes',
      badgeClass: 'bg-violet-50 text-violet-700',
    },
    {
      tab: 'projections' as TabType,
      title: 'Proyecciones & Monetización',
      desc: 'Crecimiento a 7, 30 y 90 días (MAU, MRR, Cómputo IA) y economía unitaria con ARPU y margen.',
      icon: Sparkles,
      badge: 'Horizontes 7/30/90d',
      badgeClass: 'bg-sky-50 text-sky-700',
    },
    {
      tab: 'simulator' as TabType,
      title: 'Simulador SaaS & What-If',
      desc: 'Modelado interactivo con 3 escenarios (Conservador, Base, Optimista) y sliders What-If instantáneos.',
      icon: Cpu,
      badge: 'Simulación A/B/C',
      badgeClass: 'bg-indigo-50 text-indigo-700',
    },
    {
      tab: 'decisions' as TabType,
      title: 'Decisiones Estratégicas',
      desc: 'Matriz de impacto/riesgo, recomendaciones estructuradas y listado de métricas adicionales requeridas.',
      icon: Compass,
      badge: 'Planes Accionables',
      badgeClass: 'bg-amber-50 text-amber-700',
    },
    {
      tab: 'quality' as TabType,
      title: 'Calidad de Datos & Comparativa',
      desc: 'Data Quality Score (0-100), auditoría de nulos y respuesta sistemática: ¿Qué aporta D1 vs D2?',
      icon: ShieldCheck,
      badge: 'Auditoría',
      badgeClass: 'bg-emerald-50 text-emerald-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Card */}
      <div className="bg-linear-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 border border-white/15">
              🚀 Centro de Inteligencia de Negocio SaaS
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Objetivo: {profile.primaryGoal.slice(0, 52)}...
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Analítica Interactiva &amp; Apoyo a la Toma de Decisiones para {profile.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Plataforma especializada en startups SaaS de productividad y gestión del conocimiento. Diseñada para procesar dos datasets desacoplados, inferir variables por sinónimos, evaluar cohortes y simular escenarios estratégicos con estricta fidelidad a los datos.
          </p>

          {/* Quick Metrics Bar inside Hero */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-[11px] text-slate-400 block">MRR Activo</span>
              <strong className="text-lg font-bold text-white font-mono">
                {currencySymbol}{kpis.mrr.value.toLocaleString()}
              </strong>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-[11px] text-slate-400 block">Cuentas Analizadas</span>
              <strong className="text-lg font-bold text-white font-mono">
                {totalUsers} usuarios
              </strong>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-[11px] text-slate-400 block">Conversión a Pago</span>
              <strong className="text-lg font-bold text-emerald-400 font-mono">
                {kpis.conversionRate.value}%
              </strong>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-[11px] text-slate-400 block">Tasa de Churn</span>
              <strong className="text-lg font-bold text-amber-300 font-mono">
                {kpis.churnRate.value}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Navigation Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Módulos de Análisis &amp; Simulación</h3>
            <p className="text-xs text-slate-500">Accede directamente a cualquier dimensión del análisis para Nōva</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigate(m.tab)}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-50 text-slate-700 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.badgeClass}`}>
                      {m.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                    {m.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-indigo-600">
                  <span>Explorar sección</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
