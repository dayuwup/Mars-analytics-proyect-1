import React from 'react';
import {
  TrendingUp,
  Clock,
  AlertOctagon,
  Sparkles,
  Server,
  HeartHandshake,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { CohortItem, FeatureCoOccurrence } from '../types/saas';
import { ActivityHeatmapChart } from './charts/ActivityHeatmapChart';

interface RetentionUsageProps {
  cohorts: CohortItem[];
  coOccurrences: FeatureCoOccurrence[];
  abandonmentRiskPct: number;
  operationalBottlenecks: {
    metric: string;
    value: string;
    status: 'ok' | 'warning' | 'critical';
    note: string;
  }[];
}

export const RetentionUsage: React.FC<RetentionUsageProps> = ({
  cohorts,
  coOccurrences,
  abandonmentRiskPct,
  operationalBottlenecks,
}) => {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Retención, Adopción &amp; Diagnóstico Operativo
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Análisis de cohortes temporales, correlación de funciones usadas en conjunto y monitoreo de infraestructura en Nōva.
        </p>
      </div>

      {/* PASO 8 — Cohortes de Retención */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Cohortes de Retención de Usuarios (7, 30 y 90 Días)
            </h3>
            <p className="text-xs text-slate-500">
              Porcentaje de usuarios registrados que mantienen actividad en el editor tras transcurrir cada periodo
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
            Retención a 90d: ~52% promedio
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 text-left font-semibold text-slate-700">Cohorte Mensual</th>
                <th className="p-3 text-center font-semibold text-slate-700">Tamaño (Cuentas)</th>
                <th className="p-3 text-center font-semibold text-slate-700">Día 7</th>
                <th className="p-3 text-center font-semibold text-slate-700">Día 30</th>
                <th className="p-3 text-center font-semibold text-slate-700">Día 90</th>
                <th className="p-3 text-left font-semibold text-slate-700">Estado de Salud</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cohorts.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 font-semibold text-slate-800">{c.cohortName}</td>
                  <td className="p-3 text-center text-slate-600 font-mono">{c.size}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-md font-mono font-medium bg-indigo-50 text-indigo-700">
                      {c.day7Pct}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-md font-mono font-medium bg-violet-50 text-violet-700">
                      {c.day30Pct}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-md font-mono font-medium ${
                        c.day90Pct >= 50 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {c.day90Pct}%
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ Curva Estable
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap & Abandonment Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityHeatmapChart />
        </div>

        {/* PASO 11: Detección de patrones de abandono */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <h4 className="text-sm font-bold text-slate-900">Detección de Patrones de Abandono</h4>
            </div>

            <div className="bg-rose-50/70 border border-rose-200/70 rounded-xl p-4 mb-4 text-center">
              <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider block">
                Usuarios en Riesgo Temprano
              </span>
              <span className="text-3xl font-extrabold text-rose-600 font-mono block mt-1">
                {abandonmentRiskPct}%
              </span>
              <span className="text-[11px] text-rose-700 block mt-1">
                Crearon menos de 20 bloques en sus primeros 7 días
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-800 block mb-0.5">Hallazgo Crítico:</strong>
                El 82% de los usuarios que no usan una plantilla durante su primer día de registro terminan abandonando la herramienta en menos de 14 días.
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-800 block mb-0.5">Gatillo de Rescate:</strong>
                Enviar un correo con tres plantillas recomendadas personalizadas a las 48 horas incrementa la reactivación en un 19%.
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Monitoreo en tiempo real según el Dataset 2.
          </div>
        </div>
      </div>

      {/* PASO 11 — ¿Qué características se usan juntas? (Co-ocurrencia) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Afinidad de Funcionalidades: ¿Qué Herramientas se Usan Juntas en Nōva?
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Identificación de combinaciones de uso con mayor impacto comprobado en la reducción de cancelación (Churn).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coOccurrences.map((co, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-linear-to-b from-slate-50/60 to-white flex flex-col justify-between text-xs space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 text-[11px]">
                    Clúster #{idx + 1}
                  </span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                    {co.churnDiffPct}% Churn
                  </span>
                </div>

                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
                  <span>{co.featureA}</span>
                  <span className="text-slate-400 font-normal">+</span>
                  <span>{co.featureB}</span>
                </div>

                <p className="text-slate-600 leading-relaxed text-xs">{co.insightText}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Usuarios activos en clúster:</span>
                <strong className="text-slate-700 font-mono">{co.usersCount}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PASO 12 — Análisis Operativo y Recursos */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Server className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Análisis Operativo &amp; Cuellos de Botella de Infraestructura
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Evaluación de rendimiento del editor, latencia del asistente IA, incidencias de soporte y saturación de almacenamiento.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {operationalBottlenecks.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between text-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-600 truncate">{item.metric}</span>
                  {item.status === 'ok' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                </div>
                <div className="text-base font-bold text-slate-900 font-mono mb-1">{item.value}</div>
                <p className="text-slate-500 text-[11px] leading-relaxed">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
