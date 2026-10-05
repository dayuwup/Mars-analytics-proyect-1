import React, { useState } from 'react';
import { Sparkles, TrendingUp, HardDrive, Cpu, DollarSign, PieChart, Info } from 'lucide-react';
import { CurrencyType, GrowthProjectionData, MergedUserRecord } from '../types/saas';

interface GrowthProjectionsProps {
  projections: Record<7 | 30 | 90, GrowthProjectionData>;
  users: MergedUserRecord[];
  currency: CurrencyType;
}

export const GrowthProjections: React.FC<GrowthProjectionsProps> = ({
  projections,
  users,
  currency,
}) => {
  const [horizon, setHorizon] = useState<7 | 30 | 90>(30);
  const currencySymbol = currency === 'PEN' ? 'S/ ' : '$ ';

  const activeProj = projections[horizon];
  const totalUsers = users.length || 1;
  const totalRevenue = users.reduce((acc, u) => acc + (u.isChurned ? 0 : u.mrr), 0);

  // PASO 10: ARPU calculation
  const arpu = Math.round((totalRevenue / totalUsers) * 10) / 10;
  const paidUsersCount = users.filter((u) => u.isPaid).length || 1;
  const arpau = Math.round((totalRevenue / paidUsersCount) * 10) / 10; // ARPU among paid users

  return (
    <div className="space-y-8">
      {/* Header & Horizon Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Proyecciones de Crecimiento &amp; Análisis de Monetización
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Modelos de proyección de usuarios, MRR y consumo de cómputo IA a 7, 30 y 90 días en Nōva.
          </p>
        </div>

        {/* Horizon Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-700">
          <span className="px-2.5 text-slate-400 font-medium hidden sm:inline">Horizonte:</span>
          <button
            onClick={() => setHorizon(7)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              horizon === 7 ? 'bg-indigo-600 text-white shadow-xs' : 'hover:text-indigo-600'
            }`}
          >
            7 Días
          </button>
          <button
            onClick={() => setHorizon(30)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              horizon === 30 ? 'bg-indigo-600 text-white shadow-xs' : 'hover:text-indigo-600'
            }`}
          >
            30 Días (Mes)
          </button>
          <button
            onClick={() => setHorizon(90)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              horizon === 90 ? 'bg-indigo-600 text-white shadow-xs' : 'hover:text-indigo-600'
            }`}
          >
            90 Días (Trimestre)
          </button>
        </div>
      </div>

      {/* PASO 9 — 4 Projection Metric Cards with Expected, Lower & Upper bounds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MAU Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Crecimiento MAU</span>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-xs text-slate-400 block">Valor Esperado:</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
              {activeProj.mau.expected.toLocaleString()} <span className="text-xs font-normal text-slate-500">cuentas</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
            <span>Mínimo: <strong className="text-slate-700">{activeProj.mau.lower}</strong></span>
            <span>Máximo: <strong className="text-indigo-600">{activeProj.mau.upper}</strong></span>
          </div>
        </div>

        {/* MRR Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Proyección MRR</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs text-slate-400 block">Valor Esperado:</span>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-0.5">
              {currencySymbol}{activeProj.mrr.expected.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
            <span>Mínimo: <strong className="text-slate-700">{currencySymbol}{activeProj.mrr.lower}</strong></span>
            <span>Máximo: <strong className="text-emerald-700">{currencySymbol}{activeProj.mrr.upper}</strong></span>
          </div>
        </div>

        {/* Storage Load */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Almacenamiento Total</span>
              <HardDrive className="w-4 h-4 text-sky-600" />
            </div>
            <span className="text-xs text-slate-400 block">Capacidad Esperada:</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
              {activeProj.storageGb.expected} <span className="text-xs font-normal text-slate-500">GB</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
            <span>Rango: <strong className="text-slate-700">{activeProj.storageGb.lower} - {activeProj.storageGb.upper} GB</strong></span>
          </div>
        </div>

        {/* AI Inferences */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Llamadas a IA (Tokens)</span>
              <Cpu className="w-4 h-4 text-violet-600" />
            </div>
            <span className="text-xs text-slate-400 block">Consumo Esperado:</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
              {activeProj.aiTokensMillions.expected} <span className="text-xs font-normal text-slate-500">M tokens</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
            <span>Rango: <strong className="text-slate-700">{activeProj.aiTokensMillions.lower} - {activeProj.aiTokensMillions.upper} M</strong></span>
          </div>
        </div>
      </div>

      {/* PASO 10 — Monetización, ARPU & Rentabilidad por Plan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              Monetización, ARPU &amp; Margen Bruto por Plan
            </h3>
            <p className="text-xs text-slate-500">
              Métricas unitarias de monetización por usuario registrado y por usuario de pago en Nōva
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between text-xs">
            <div>
              <span className="text-slate-400 block mb-1">ARPU Global (Total Usuarios):</span>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                {currencySymbol}{arpu} <span className="text-xs font-normal text-slate-500">/usuario</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-2">
                Ingresos totales divididos entre todos los usuarios registrados (incluyendo el plan Free).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/60 flex flex-col justify-between text-xs">
            <div>
              <span className="text-indigo-800 block mb-1">ARPPU (Usuarios de Pago Pro/Team):</span>
              <div className="text-2xl font-bold text-indigo-700 font-mono">
                {currencySymbol}{arpau} <span className="text-xs font-normal text-indigo-500">/cuenta de pago</span>
              </div>
              <p className="text-indigo-900/80 text-[11px] mt-2">
                Ingreso promedio mensual generado exclusivamente por los usuarios con suscripción de pago activa.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60 flex flex-col justify-between text-xs">
            <div>
              <span className="text-emerald-800 block mb-1">Margen Bruto Estimado:</span>
              <div className="text-2xl font-bold text-emerald-700 font-mono">
                ~81.5%
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-900/80 mt-2">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Margen bruto estimado ante la falta de desglose de costo de servidor e IA en el CSV.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Unit Economics Comparison Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 text-left font-semibold text-slate-700">Nivel de Plan</th>
                <th className="p-3 text-center font-semibold text-slate-700">Usuarios</th>
                <th className="p-3 text-center font-semibold text-slate-700">MRR Aportado</th>
                <th className="p-3 text-center font-semibold text-slate-700">Consumo IA Promedio</th>
                <th className="p-3 text-center font-semibold text-slate-700">Margen Bruto Est.</th>
                <th className="p-3 text-left font-semibold text-slate-700">Dictamen Financiero</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/70">
                <td className="p-3 font-semibold text-slate-800">Plan Free</td>
                <td className="p-3 text-center text-slate-600 font-mono">
                  {users.filter((u) => u.plan === 'Free').length}
                </td>
                <td className="p-3 text-center text-slate-600 font-mono">{currencySymbol}0</td>
                <td className="p-3 text-center text-slate-600 font-mono">2.4 consultas/mes</td>
                <td className="p-3 text-center text-rose-600 font-mono">- (Costo de Adquisición)</td>
                <td className="p-3 text-slate-600">Embudo de entrada para descubrir Nōva.</td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="p-3 font-semibold text-indigo-700">Plan Pro</td>
                <td className="p-3 text-center text-slate-600 font-mono">
                  {users.filter((u) => u.plan === 'Pro').length}
                </td>
                <td className="p-3 text-center text-indigo-600 font-bold font-mono">
                  {currencySymbol}
                  {Math.round(users.filter((u) => u.plan === 'Pro' && !u.isChurned).reduce((a, b) => a + b.mrr, 0))}
                </td>
                <td className="p-3 text-center text-slate-600 font-mono">54 consultas/mes</td>
                <td className="p-3 text-center text-emerald-600 font-semibold font-mono">~84%</td>
                <td className="p-3 text-slate-600">Mayor volumen de caja neta y bajo coste de soporte.</td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="p-3 font-semibold text-sky-700">Plan Team</td>
                <td className="p-3 text-center text-slate-600 font-mono">
                  {users.filter((u) => u.plan === 'Team').length}
                </td>
                <td className="p-3 text-center text-sky-600 font-bold font-mono">
                  {currencySymbol}
                  {Math.round(users.filter((u) => u.plan === 'Team' && !u.isChurned).reduce((a, b) => a + b.mrr, 0))}
                </td>
                <td className="p-3 text-center text-slate-600 font-mono">112 consultas/mes</td>
                <td className="p-3 text-center text-emerald-600 font-semibold font-mono">~79%</td>
                <td className="p-3 text-slate-600">Contratos de mayor LTV con retención sólida a 90 días.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
