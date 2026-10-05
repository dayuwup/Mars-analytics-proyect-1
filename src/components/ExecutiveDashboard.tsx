import React from 'react';
import {
  DollarSign,
  Users,
  Percent,
  TrendingDown,
  Layers,
  Sparkles,
  Smartphone,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { CurrencyType, MergedUserRecord, SaaSExecutiveKPIs } from '../types/saas';
import { PlanDonutChart } from './charts/PlanDonutChart';
import { TrendLineChart } from './charts/TrendLineChart';
import { ConversionFunnelChart } from './charts/ConversionFunnelChart';
import { DeviceBarChart } from './charts/DeviceBarChart';

interface ExecutiveDashboardProps {
  kpis: SaaSExecutiveKPIs;
  users: MergedUserRecord[];
  currency: CurrencyType;
  dailyActivity: { date: string; signups: number; events: number }[];
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  kpis,
  users,
  currency,
  dailyActivity,
}) => {
  const currencySymbol = currency === 'PEN' ? 'S/ ' : '$ ';

  // Compute plan breakdowns for Donut
  const planMap: Record<string, { count: number; mrr: number }> = {};
  users.forEach((u) => {
    const p = u.plan || 'Free';
    if (!planMap[p]) planMap[p] = { count: 0, mrr: 0 };
    planMap[p].count += 1;
    if (!u.isChurned) planMap[p].mrr += u.mrr;
  });

  const planColors: Record<string, string> = {
    Free: '#94a3b8',
    Pro: '#4f46e5',
    Team: '#0ea5e9',
    Desconocido: '#cbd5e1',
  };

  const donutPlans = Object.entries(planMap).map(([name, val]) => ({
    name,
    count: val.count,
    mrr: Math.round(val.mrr),
    color: planColors[name] || '#6366f1',
  }));

  // KPI Card Helper
  const renderKpiCard = (
    title: string,
    value: string | number,
    unit: string,
    changePct: number,
    status: 'positive' | 'neutral' | 'negative',
    explanation: string,
    available: boolean,
    note: string,
    Icon: React.ComponentType<{ className?: string }>
  ) => {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
              <Icon className="w-4 h-4" />
            </div>
          </div>

          {available ? (
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</span>
                <span className="text-xs font-medium text-slate-500">{unit}</span>
              </div>
              <p className="text-xs text-slate-500 leading-normal">{explanation}</p>
            </div>
          ) : (
            <div className="py-2">
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 block">
                {note}
              </span>
            </div>
          )}
        </div>

        {available && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              {changePct > 0 ? (
                <ArrowUpRight
                  className={`w-3.5 h-3.5 ${
                    status === 'positive'
                      ? 'text-emerald-600'
                      : status === 'negative'
                      ? 'text-rose-600'
                      : 'text-slate-500'
                  }`}
                />
              ) : changePct < 0 ? (
                <ArrowDownRight
                  className={`w-3.5 h-3.5 ${
                    status === 'positive'
                      ? 'text-emerald-600'
                      : status === 'negative'
                      ? 'text-rose-600'
                      : 'text-slate-500'
                  }`}
                />
              ) : (
                <Minus className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span
                className={`font-semibold ${
                  status === 'positive'
                    ? 'text-emerald-600'
                    : status === 'negative'
                    ? 'text-rose-600'
                    : 'text-slate-600'
                }`}
              >
                {changePct > 0 ? `+${changePct}%` : `${changePct}%`}
              </span>
              <span className="text-slate-400 text-[11px]">vs periodo anterior</span>
            </div>
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'positive'
                  ? 'bg-emerald-500'
                  : status === 'negative'
                  ? 'bg-rose-500'
                  : 'bg-amber-400'
              }`}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Title & Scope Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Ejecutivo SaaS — Nōva</h2>
        <p className="text-xs text-slate-500 mt-1">
          Monitor de indicadores clave de desempeño (KPIs) calculados dinámicamente a partir de los datasets cargados.
        </p>
      </div>

      {/* Primary KPI Grid (PASO 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderKpiCard(
          'Ingreso Recurrente (MRR)',
          `${currencySymbol}${kpis.mrr.value.toLocaleString()}`,
          '',
          kpis.mrr.changePct,
          kpis.mrr.status,
          kpis.mrr.note,
          kpis.mrr.available,
          kpis.mrr.note,
          DollarSign
        )}

        {renderKpiCard(
          'Usuarios Activos (MAU)',
          kpis.mau.value.toLocaleString(),
          'cuentas',
          kpis.mau.changePct,
          kpis.mau.status,
          `DAU estimado: ${kpis.dau.value} (Stickiness 42%)`,
          kpis.mau.available,
          kpis.mau.note,
          Users
        )}

        {renderKpiCard(
          'Conversión Free -> Pago',
          `${kpis.conversionRate.value}%`,
          'de usuarios',
          kpis.conversionRate.changePct,
          kpis.conversionRate.status,
          kpis.conversionRate.note,
          kpis.conversionRate.available,
          kpis.conversionRate.note,
          Percent
        )}

        {renderKpiCard(
          'Tasa de Cancelación (Churn)',
          `${kpis.churnRate.value}%`,
          'mensual',
          kpis.churnRate.changePct,
          kpis.churnRate.status,
          kpis.churnRate.note,
          kpis.churnRate.available,
          kpis.churnRate.note,
          TrendingDown
        )}
      </div>

      {/* Secondary KPI Grid (Product & Engagement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderKpiCard(
          'Bloques Creados Promedio',
          kpis.avgBlocksPerUser.value.toLocaleString(),
          'bloques/usr',
          kpis.avgBlocksPerUser.changePct,
          kpis.avgBlocksPerUser.status,
          kpis.avgBlocksPerUser.note,
          kpis.avgBlocksPerUser.available,
          kpis.avgBlocksPerUser.note,
          Layers
        )}

        {renderKpiCard(
          'Adopción de Asistente IA',
          `${kpis.aiAdoptionRate.value}%`,
          'de usuarios',
          kpis.aiAdoptionRate.changePct,
          kpis.aiAdoptionRate.status,
          kpis.aiAdoptionRate.note,
          kpis.aiAdoptionRate.available,
          kpis.aiAdoptionRate.note,
          Sparkles
        )}

        {renderKpiCard(
          'Adopción de Plantillas',
          `${kpis.templatesAdoptionRate.value}%`,
          'clonaciones',
          kpis.templatesAdoptionRate.changePct,
          kpis.templatesAdoptionRate.status,
          kpis.templatesAdoptionRate.note,
          kpis.templatesAdoptionRate.available,
          kpis.templatesAdoptionRate.note,
          Layers
        )}

        {renderKpiCard(
          'Stickers & Canvas Visual',
          `${kpis.stickersAdoptionRate.value}%`,
          'usuarios activos',
          kpis.stickersAdoptionRate.changePct,
          kpis.stickersAdoptionRate.status,
          kpis.stickersAdoptionRate.note,
          kpis.stickersAdoptionRate.available,
          kpis.stickersAdoptionRate.note,
          Smartphone
        )}
      </div>

      {/* Visual Analytics Grid with Real Value & Interpretations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlanDonutChart plans={donutPlans} currency={currency} />
        <TrendLineChart data={dailyActivity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversionFunnelChart
          totalUsers={users.length}
          engagedUsers={users.filter((u) => u.blocksCreated > 30).length}
          powerUsers={users.filter((u) => u.aiQueries > 2 || u.templatesUsed > 1).length}
          paidUsers={users.filter((u) => u.isPaid).length}
        />
        <DeviceBarChart
          tabletPct={kpis.deviceDistribution.tabletPct}
          desktopPct={kpis.deviceDistribution.desktopPct}
          mobilePct={kpis.deviceDistribution.mobilePct}
          available={kpis.deviceDistribution.available}
        />
      </div>
    </div>
  );
};
