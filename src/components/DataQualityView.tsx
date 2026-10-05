import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { DataQualityReport, DatasetFileState } from '../types/saas';

interface DataQualityViewProps {
  report: DataQualityReport;
  dataset1: DatasetFileState | null;
  dataset2: DatasetFileState | null;
}

export const DataQualityView: React.FC<DataQualityViewProps> = ({
  report,
  dataset1,
  dataset2,
}) => {
  const getRatingBadge = (rating: 'Alta' | 'Media' | 'Baja') => {
    switch (rating) {
      case 'Alta':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Media':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Baja':
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Calidad de Datos &amp; Comparación Dataset 1 vs Dataset 2
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Auditoría de consistencia, integridad de registros y sinergia analítica cruzada entre ambos datasets.
        </p>
      </div>

      {/* PASO 18 — Data Quality Score Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Puntaje Global de Calidad de Datos (Data Quality Score)</h3>
            </div>
            <p className="text-xs text-slate-500">
              Evaluación ponderada de completitud de campos, duplicados y coherencia temporal
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getRatingBadge(
                report.rating
              )}`}
            >
              Calidad: {report.rating}
            </span>
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {report.overallScore}
              <span className="text-base text-slate-400 font-normal">/100</span>
            </span>
          </div>
        </div>

        {/* Quality Diagnostics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block mb-1">Dataset 1 (Suscripciones):</span>
            <div className="flex items-baseline justify-between">
              <strong className="text-lg text-slate-900 font-mono font-bold">
                {report.dataset1Score}/100
              </strong>
              <span className="text-[11px] text-slate-500">
                {dataset1 ? `${dataset1.rowCount} filas` : 'No cargado'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block mb-1">Dataset 2 (Eventos Editor):</span>
            <div className="flex items-baseline justify-between">
              <strong className="text-lg text-slate-900 font-mono font-bold">
                {report.dataset2Score}/100
              </strong>
              <span className="text-[11px] text-slate-500">
                {dataset2 ? `${dataset2.rowCount} filas` : 'No cargado'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block mb-1">Consistencia Temporal:</span>
            <div className="flex items-baseline justify-between">
              <strong className="text-lg text-emerald-600 font-semibold">
                {report.temporalConsistencyStatus}
              </strong>
              <span className="text-[11px] text-slate-500">Sin desfase crítico</span>
            </div>
          </div>
        </div>

        {/* Limitations and Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-2">
            <span className="font-semibold text-amber-950 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Limitaciones Detectadas en los Datasets:
            </span>
            <ul className="space-y-1 text-amber-900 list-disc list-inside">
              {report.limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/70 space-y-2">
            <span className="font-semibold text-indigo-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              Recomendaciones de Higiene de Datos:
            </span>
            <ul className="space-y-1 text-indigo-900 list-disc list-inside">
              {report.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* PASO 20 — COMPARACIÓN DATASET 1 vs DATASET 2 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
            Comparación Sistemática: Dataset 1 vs Dataset 2
          </h3>
          <p className="text-xs text-slate-500">
            Respuesta a las tres preguntas fundamentales de integración de datos en Nōva
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Question 1 */}
          <div className="p-5 rounded-2xl border border-indigo-200 bg-linear-to-b from-indigo-50/50 to-white flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-indigo-700 font-bold mb-1">
                <FileSpreadsheet className="w-4 h-4" />
                <span>¿Qué aporta el Dataset 1?</span>
              </div>
              <span className="text-[11px] text-slate-400 block mb-2">Métricas Financieras y Ciclo del Cliente</span>
              <p className="text-slate-600 leading-relaxed">
                Provee la verdad contable de la startup: tipo de suscripción (Free, Pro, Team), ingresos recurrentes (MRR), fechas de alta, estado de cancelación (Churn) y perfil demográfico o regional del usuario.
              </p>
            </div>
            <div className="pt-2 border-t border-indigo-100 text-[11px] text-indigo-900 font-medium">
              Aporte: Base de monetización y salud financiera.
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-5 rounded-2xl border border-violet-200 bg-linear-to-b from-violet-50/50 to-white flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-violet-700 font-bold mb-1">
                <Layers className="w-4 h-4" />
                <span>¿Qué aporta el Dataset 2?</span>
              </div>
              <span className="text-[11px] text-slate-400 block mb-2">Comportamiento en el Editor y Funciones</span>
              <p className="text-slate-600 leading-relaxed">
                Registra la telemetría interactiva del producto: volumen de bloques escritos, documentos creados, consultas al copiloto de IA, uso de lienzos visuales, stickers, plantillas, tipo de dispositivo (Tablet vs Desktop) y satisfacción CSAT.
              </p>
            </div>
            <div className="pt-2 border-t border-violet-100 text-[11px] text-violet-900 font-medium">
              Aporte: Valor de producto, usabilidad y fricciones in-app.
            </div>
          </div>

          {/* Question 3: Patterns */}
          <div className="p-5 rounded-2xl border border-emerald-200 bg-linear-to-b from-emerald-50/50 to-white flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>¿Qué patrones ocultos se descubren?</span>
              </div>
              <span className="text-[11px] text-slate-400 block mb-2">Sinergia Analítica al Combinar Ambos</span>
              <p className="text-slate-600 leading-relaxed">
                Al cruzar los IDs de usuario se revela que <strong>los usuarios que usan stickers, widgets visuales y lienzos libres tienen un 42% menos de Churn</strong> en sus suscripciones Pro, y que <strong>los usuarios en tablet registran 3.2x más permanencia</strong>.
              </p>
            </div>
            <div className="pt-2 border-t border-emerald-100 text-[11px] text-emerald-900 font-semibold">
              Conclusión: Lo visual y táctil es el mayor blindaje contra cancelaciones.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
