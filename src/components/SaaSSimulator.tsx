import React, { useState } from 'react';
import {
  Cpu,
  Sliders,
  TrendingUp,
  DollarSign,
  Layers,
  Sparkles,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { BusinessProfile, CurrencyType, MergedUserRecord } from '../types/saas';

interface SaaSSimulatorProps {
  users: MergedUserRecord[];
  profile: BusinessProfile;
  currency: CurrencyType;
}

export const SaaSSimulator: React.FC<SaaSSimulatorProps> = ({ users, profile, currency }) => {
  const currencySymbol = currency === 'PEN' ? 'S/ ' : '$ ';

  // Baseline metrics
  const totalUsers = users.length || 100;
  const currentPaid = users.filter((u) => u.isPaid).length || 30;
  const currentConversion = Math.round((currentPaid / totalUsers) * 100);
  const currentMrr = users.reduce((acc, u) => acc + (u.isChurned ? 0 : u.mrr), 0) || currentPaid * profile.baseProPrice;

  // Simulator Inputs (PASO 13)
  const [proPrice, setProPrice] = useState<number>(profile.baseProPrice || 18);
  const [mktSpend, setMktSpend] = useState<number>(800);
  const [targetConversion, setTargetConversion] = useState<number>(Math.max(5, currentConversion));
  const [targetRetention, setTargetRetention] = useState<number>(88);

  // What-If Sliders (PASO 14)
  const [whatIfConversionDelta, setWhatIfConversionDelta] = useState<number>(5); // +5% conversion
  const [whatIfAiCostMultiplier, setWhatIfAiCostMultiplier] = useState<number>(2.0); // 2x AI API costs
  const [whatIfTabletRetentionDelta, setWhatIfTabletRetentionDelta] = useState<number>(15); // +15% tablet retention

  // Automated 3 Scenarios Generator (PASO 13)
  const scenarios = [
    {
      name: 'Conservador',
      description: 'Crecimiento orgánico moderado, retención estándar y gasto de captación cauto.',
      mktSpend: mktSpend * 0.6,
      newUsers: Math.round((mktSpend * 0.6) / 25), // CAC est. 25
      conversion: Math.max(4, targetConversion - 5),
      retention: targetRetention - 6,
      price: proPrice,
      color: 'border-slate-300 bg-slate-50/70',
      badgeColor: 'bg-slate-200 text-slate-700',
    },
    {
      name: 'Escenario Base',
      description: 'Ritmo proyectado según los datos históricos de Nōva y parámetros configurados.',
      mktSpend: mktSpend,
      newUsers: Math.round(mktSpend / 20),
      conversion: targetConversion,
      retention: targetRetention,
      price: proPrice,
      color: 'border-indigo-300 bg-indigo-50/40',
      badgeColor: 'bg-indigo-600 text-white',
    },
    {
      name: 'Optimista',
      description: 'Fuerte tracción en tablets, adopción viral de plantillas y aceleración de Pro.',
      mktSpend: mktSpend * 1.5,
      newUsers: Math.round((mktSpend * 1.5) / 16),
      conversion: targetConversion + 6,
      retention: Math.min(96, targetRetention + 5),
      price: proPrice + 2,
      color: 'border-emerald-300 bg-emerald-50/40',
      badgeColor: 'bg-emerald-600 text-white',
    },
  ].map((sc) => {
    const totalSimUsers = totalUsers + sc.newUsers;
    const paidSimUsers = Math.round(totalSimUsers * (sc.conversion / 100));
    const projectedMrr = Math.round(paidSimUsers * sc.price);
    const estApiCost = Math.round(paidSimUsers * 2.8); // 2.8 unit per user
    const netCashFlow = projectedMrr - sc.mktSpend - estApiCost;
    return {
      ...sc,
      totalSimUsers,
      paidSimUsers,
      projectedMrr,
      netCashFlow,
      marginPct: Math.round((netCashFlow / (projectedMrr || 1)) * 100),
    };
  });

  // What-if Instant Calculation (PASO 14)
  // Baseline What-If values
  const baseConversionPct = (currentConversion + whatIfConversionDelta) / 100;
  const newPaidUsers = Math.round(totalUsers * baseConversionPct);
  const whatIfMrr = Math.round(newPaidUsers * proPrice);

  const baseAiCostPerUser = 2.2;
  const whatIfAiCostsTotal = Math.round(newPaidUsers * baseAiCostPerUser * whatIfAiCostMultiplier);

  // Tablet effect: tablet users represent ~38% of userbase
  const tabletRevenueBoost = Math.round((totalUsers * 0.38 * (whatIfTabletRetentionDelta / 100) * proPrice) * 0.4);
  const finalWhatIfMrr = whatIfMrr + tabletRevenueBoost;
  const finalWhatIfNet = finalWhatIfMrr - whatIfAiCostsTotal - (mktSpend * 0.4);
  const finalWhatIfMargin = Math.round((finalWhatIfNet / (finalWhatIfMrr || 1)) * 100);

  const handleResetSliders = () => {
    setWhatIfConversionDelta(5);
    setWhatIfAiCostMultiplier(2.0);
    setWhatIfTabletRetentionDelta(15);
    setProPrice(profile.baseProPrice || 18);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Simulador de Decisiones SaaS &amp; Análisis "What If"
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Ajusta variables operativas y comerciales de Nōva para proyectar escenarios de rentabilidad, MRR y solvencia financiera.
        </p>
      </div>

      {/* PASO 14 — Análisis "What If" Instantáneo */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Análisis "What If" en Tiempo Real</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Modifica las tres preguntas clave para simular instantáneamente el impacto en ingresos, costos de IA y capacidad de Nōva.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetSliders}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restablecer Sliders
          </button>
        </div>

        {/* 3 Interactive Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Slider 1: Conversión a Pro */}
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-xs space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-200">¿Conversión a Pro sube?</span>
              <strong className="text-emerald-300 font-mono text-sm">+{whatIfConversionDelta}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={whatIfConversionDelta}
              onChange={(e) => setWhatIfConversionDelta(parseInt(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              Genera ~{Math.round(totalUsers * (whatIfConversionDelta / 100))} suscriptores adicionales
            </span>
          </div>

          {/* Slider 2: Costo de IA */}
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-xs space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-200">¿Costos de API de IA?</span>
              <strong className="text-amber-300 font-mono text-sm">{whatIfAiCostMultiplier}x costo</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.5"
              value={whatIfAiCostMultiplier}
              onChange={(e) => setWhatIfAiCostMultiplier(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              Costo IA estimado: {currencySymbol}{whatIfAiCostsTotal}/mes
            </span>
          </div>

          {/* Slider 3: Retención en Tablets */}
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-xs space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-200">¿Retención en Tablets aumenta?</span>
              <strong className="text-sky-300 font-mono text-sm">+{whatIfTabletRetentionDelta}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={whatIfTabletRetentionDelta}
              onChange={(e) => setWhatIfTabletRetentionDelta(parseInt(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              Aporte de retención: +{currencySymbol}{tabletRevenueBoost}/mes
            </span>
          </div>
        </div>

        {/* What-If Live Results Bar */}
        <div className="bg-black/30 p-4 rounded-xl border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-center">
          <div>
            <span className="text-[11px] text-slate-400 block">MRR Proyectado (What-If)</span>
            <strong className="text-lg text-emerald-400 font-mono font-bold block mt-0.5">
              {currencySymbol}{finalWhatIfMrr.toLocaleString()}
            </strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Costo Estimado de IA</span>
            <strong className="text-lg text-amber-300 font-mono font-bold block mt-0.5">
              {currencySymbol}{whatIfAiCostsTotal.toLocaleString()}
            </strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Margen Neto Simulado</span>
            <strong className="text-lg text-white font-mono font-bold block mt-0.5">
              {finalWhatIfMargin}%
            </strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Capacidad del Sistema</span>
            <strong className="text-lg text-indigo-300 font-mono font-bold block mt-0.5">
              Solvente (&lt;65% CPU)
            </strong>
          </div>
        </div>
      </div>

      {/* PASO 13 — Simulador de Crecimiento SaaS: Parámetros y 3 Escenarios Automáticos */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            Parámetros del Modelo &amp; Escenarios Comparativos (A/B/C)
          </h3>
          <p className="text-xs text-slate-500">
            Ajusta el precio del Plan Pro, la inversión en adquisición y las tasas esperadas para generar tres escenarios automáticos.
          </p>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Precio Plan Pro ({currency})</label>
            <input
              type="number"
              value={proPrice}
              onChange={(e) => setProPrice(parseFloat(e.target.value) || 1)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 bg-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Inversión Adquisición / Mkt ({currency}/mes)</label>
            <input
              type="number"
              value={mktSpend}
              onChange={(e) => setMktSpend(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 bg-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Tasa de Conversión Deseada (%)</label>
            <input
              type="number"
              value={targetConversion}
              onChange={(e) => setTargetConversion(parseFloat(e.target.value) || 1)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 bg-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Tasa de Retención Deseada (%)</label>
            <input
              type="number"
              value={targetRetention}
              onChange={(e) => setTargetRetention(parseFloat(e.target.value) || 1)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 bg-white"
            />
          </div>
        </div>

        {/* 3 Automatic Scenarios Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((sc, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-5 flex flex-col justify-between text-xs space-y-4 shadow-xs ${sc.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${sc.badgeColor}`}>
                    Escenario {sc.name}
                  </span>
                  <span className="font-mono text-slate-500 font-medium">Margen: {sc.marginPct}%</span>
                </div>

                <p className="text-slate-600 text-xs mb-4">{sc.description}</p>

                <div className="space-y-2 bg-white/80 p-3 rounded-xl border border-slate-200/60">
                  <div className="flex justify-between">
                    <span className="text-slate-500">MRR Proyectado:</span>
                    <strong className="text-slate-900 font-mono text-sm">
                      {currencySymbol}{sc.projectedMrr.toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Usuarios Totales:</span>
                    <strong className="text-slate-800 font-mono">{sc.totalSimUsers}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Clientes de Pago Pro:</span>
                    <strong className="text-indigo-600 font-mono">{sc.paidSimUsers}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Inversión Captación:</span>
                    <strong className="text-slate-700 font-mono">{currencySymbol}{sc.mktSpend}</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-700 font-semibold">Flujo de Caja Neto:</span>
                    <strong className="text-emerald-700 font-mono font-bold text-sm">
                      {currencySymbol}{sc.netCashFlow.toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Conversión: {sc.conversion}% • Retención: {sc.retention}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
