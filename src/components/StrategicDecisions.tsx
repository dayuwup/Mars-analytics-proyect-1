import React, { useState } from 'react';
import {
  Compass,
  AlertCircle,
  Lightbulb,
  FileQuestion,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
} from 'lucide-react';
import { RecommendationCategorized, StrategicDecisionRow } from '../types/saas';

interface StrategicDecisionsProps {
  decisions: StrategicDecisionRow[];
  recommendations: RecommendationCategorized[];
  missingMetrics: {
    metricName: string;
    whyNeeded: string;
    howToCollect: string;
    potentialImpactOnDecisions: string;
  }[];
}

export const StrategicDecisions: React.FC<StrategicDecisionsProps> = ({
  decisions,
  recommendations,
  missingMetrics,
}) => {
  const [filterRec, setFilterRec] = useState<string>('all');

  const filteredRecs =
    filterRec === 'all' ? recommendations : recommendations.filter((r) => r.category === filterRec);

  const getPriorityBadge = (priority: 'Alta' | 'Media' | 'Baja') => {
    switch (priority) {
      case 'Alta':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Media':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Baja':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRiskBadge = (risk: 'Bajo' | 'Medio' | 'Alto') => {
    switch (risk) {
      case 'Bajo':
        return 'text-emerald-700 bg-emerald-50';
      case 'Medio':
        return 'text-amber-700 bg-amber-50';
      case 'Alto':
        return 'text-rose-700 bg-rose-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Matriz de Decisiones Estratégicas &amp; Recomendaciones
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Planes de acción accionables basados exclusivamente en la evidencia encontrada en los datasets cargados para Nōva.
        </p>
      </div>

      {/* PASO 15 — Matriz de Decisiones Estratégicas */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600" />
              Matriz de Decisiones Estratégicas para Nōva
            </h3>
            <p className="text-xs text-slate-500">
              Evaluación cruzada de impacto, riesgo y prioridad de iniciativas comerciales y de producto
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 text-left font-semibold text-slate-700">Decisión Propuesta</th>
                <th className="p-3 text-left font-semibold text-slate-700">Evidencia del Dataset</th>
                <th className="p-3 text-left font-semibold text-slate-700">Impacto Estimado</th>
                <th className="p-3 text-center font-semibold text-slate-700">Riesgo</th>
                <th className="p-3 text-center font-semibold text-slate-700">Prioridad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {decisions.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 font-semibold text-slate-900 max-w-[220px]">{d.decision}</td>
                  <td className="p-3 text-slate-600 leading-relaxed max-w-[260px]">{d.datasetEvidence}</td>
                  <td className="p-3 text-slate-700 font-medium max-w-[220px]">{d.estimatedImpact}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${getRiskBadge(d.risk)}`}>
                      {d.risk}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-md font-bold text-[11px] border ${getPriorityBadge(d.priority)}`}
                    >
                      {d.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PASO 16 — Recomendaciones Automáticas Estructuradas */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Recomendaciones Automáticas por Categoría
            </h3>
            <p className="text-xs text-slate-500">
              Clasificación estructurada en: Hallazgos de datos puros, Sugerencias empresariales e Información faltante
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterRec('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterRec === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({recommendations.length})
            </button>
            <button
              onClick={() => setFilterRec('HALLAZGO DEL DATASET')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterRec === 'HALLAZGO DEL DATASET'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hallazgos
            </button>
            <button
              onClick={() => setFilterRec('SUGERENCIA EMPRESARIAL')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterRec === 'SUGERENCIA EMPRESARIAL'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sugerencias
            </button>
            <button
              onClick={() => setFilterRec('INFORMACIÓN FALTANTE')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterRec === 'INFORMACIÓN FALTANTE'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Info Faltante
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecs.map((rec) => {
            const isFinding = rec.category === 'HALLAZGO DEL DATASET';
            const isSuggestion = rec.category === 'SUGERENCIA EMPRESARIAL';
            const isMissing = rec.category === 'INFORMACIÓN FALTANTE';

            return (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between text-xs space-y-3 hover:shadow-xs transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isFinding
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                          : isSuggestion
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      }`}
                    >
                      {rec.category}
                    </span>
                    {rec.metricOrigin && (
                      <span className="text-[10px] text-slate-400 truncate max-w-[200px]" title={rec.metricOrigin}>
                        Origen: {rec.metricOrigin}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-1">{rec.title}</h4>
                  <p className="text-slate-600 leading-relaxed text-xs">{rec.description}</p>
                </div>

                {rec.actionableNextStep && (
                  <div className="pt-2.5 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-indigo-950 bg-indigo-50/40 p-2 rounded-lg">
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold text-indigo-900">Siguiente Paso:</strong>{' '}
                      {rec.actionableNextStep}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* PASO 17 — Datos Adicionales Recomendados */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Datos Adicionales Recomendados para Robustecer Nōva
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Variables que faltan en los archivos actuales y que permitirían calcular unit economics con precisión milimétrica.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missingMetrics.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between text-xs space-y-2"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileQuestion className="w-4 h-4 text-amber-600" />
                  <h4 className="font-bold text-slate-900 text-sm">{item.metricName}</h4>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed mb-2">
                  <strong className="text-slate-700">¿Por qué se necesita?</strong> {item.whyNeeded}
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                  <div>
                    <span className="text-indigo-600 font-semibold block">¿Cómo recopilarla?</span>
                    <span>{item.howToCollect}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <span className="text-emerald-700 font-semibold block">Impacto en Decisiones:</span>
                    <span>{item.potentialImpactOnDecisions}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
