import React, { useState } from 'react';
import { Layers, Award, Target, ChevronRight, TrendingUp, Sparkles, Filter } from 'lucide-react';
import { CurrencyType, OpportunityItem, UserSegmentData } from '../types/saas';

interface UserSegmentationProps {
  segments: UserSegmentData[];
  opportunities: OpportunityItem[];
  currency: CurrencyType;
}

export const UserSegmentation: React.FC<UserSegmentationProps> = ({
  segments,
  opportunities,
  currency,
}) => {
  const [selectedType, setSelectedType] = useState<'all' | 'plan' | 'profile' | 'device' | 'activity'>('all');
  const currencySymbol = currency === 'PEN' ? 'S/ ' : '$ ';

  const filteredSegments =
    selectedType === 'all' ? segments : segments.filter((s) => s.type === selectedType);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Segmentación &amp; Ranking de Oportunidades</h2>
        <p className="text-xs text-slate-500 mt-1">
          Análisis multidimensional de usuarios por plan, perfil ocupacional, hardware y nivel de uso en Nōva.
        </p>
      </div>

      {/* PASO 7 — Opportunity Score Ranking */}
      <div className="bg-linear-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Ranking de Oportunidades (Opportunity Score 0 - 100)</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Algoritmo multivariable ponderado según frecuencia de uso, adopción de herramientas visuales/IA, estabilidad de suscripción y tiempo activo en el editor.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-full border border-white/20 text-slate-200">
            Top 5 Palancas de Monetización
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((opp, idx) => (
            <div
              key={opp.id}
              className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 flex flex-col justify-between hover:bg-white/15 transition-all text-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                    #{idx + 1} {opp.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">Score:</span>
                    <span className="text-sm font-extrabold text-amber-300 font-mono">{opp.score}/100</span>
                  </div>
                </div>

                <h4 className="font-bold text-white text-sm leading-snug mb-2">{opp.title}</h4>

                {/* Micro Factor Bars */}
                <div className="space-y-1.5 mb-3 bg-black/20 p-2.5 rounded-lg">
                  <div className="flex justify-between text-[10px] text-slate-300">
                    <span>Frecuencia de Uso:</span>
                    <strong className="text-white">{opp.factors.usageFrequency}%</strong>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-300">
                    <span>Adopción Visual &amp; IA:</span>
                    <strong className="text-white">{opp.factors.visualAiAdoption}%</strong>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-300">
                    <span>Estabilidad de Suscripción:</span>
                    <strong className="text-white">{opp.factors.subscriptionStability}%</strong>
                  </div>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed mb-3">
                  <strong className="text-indigo-200 block mb-0.5">Acción Recomendada:</strong>
                  {opp.suggestedAction}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Potencial:</span>
                <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  {opp.monetizationPotential}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PASO 6 — Segmentación de Usuarios */}
      <div className="space-y-4">
        {/* Type Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Perfiles &amp; Segmentos de Usuarios</h3>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedType === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({segments.length})
            </button>
            <button
              onClick={() => setSelectedType('plan')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedType === 'plan' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por Plan
            </button>
            <button
              onClick={() => setSelectedType('profile')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedType === 'profile' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por Perfil
            </button>
            <button
              onClick={() => setSelectedType('device')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedType === 'device' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por Dispositivo
            </button>
            <button
              onClick={() => setSelectedType('activity')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedType === 'activity' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por Actividad
            </button>
          </div>
        </div>

        {/* Segment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSegments.map((seg, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all text-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-900 text-sm">{seg.name}</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {seg.type}
                  </span>
                </div>

                {/* Key Segment Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Tamaño:</span>
                    <div className="flex items-baseline gap-1">
                      <strong className="text-slate-900 text-sm">{seg.userCount}</strong>
                      <span className="text-slate-500 text-[10px]">({seg.userSharePct}%)</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Aporte a Ingresos:</span>
                    <div className="flex items-baseline gap-1">
                      <strong className="text-indigo-600 text-sm">
                        {currencySymbol}
                        {seg.revenueContribution}
                      </strong>
                      <span className="text-slate-500 text-[10px]">({seg.revenueSharePct}%)</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Frecuencia / Score:</span>
                    <strong className="text-slate-800 text-xs">{seg.avgEngagementScore}/100</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Retención Activa:</span>
                    <strong className="text-emerald-600 text-xs">{seg.retentionRatePct}%</strong>
                  </div>
                </div>

                <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50 text-amber-900 text-[11px] leading-relaxed">
                  <span className="font-semibold block text-amber-950 mb-0.5">Oportunidad Potencial:</span>
                  {seg.opportunityNote}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
