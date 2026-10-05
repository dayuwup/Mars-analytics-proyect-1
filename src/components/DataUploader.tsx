import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  Calendar,
  Layers,
  Sparkles,
  HelpCircle,
  Eye,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { DatasetFileState, MatchedRelation } from '../types/saas';
import { parseCSVFile } from '../utils/csvParser';
import { SAAS_SYNONYM_RULES } from '../utils/synonymMatcher';

interface DataUploaderProps {
  dataset1: DatasetFileState | null;
  dataset2: DatasetFileState | null;
  relations: MatchedRelation[];
  onDatasetLoaded: (d1: DatasetFileState | null, d2: DatasetFileState | null) => void;
  onLoadSampleData: () => void;
}

export const DataUploader: React.FC<DataUploaderProps> = ({
  dataset1,
  dataset2,
  relations,
  onDatasetLoaded,
  onLoadSampleData,
}) => {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [previewDatasetId, setPreviewDatasetId] = useState<'dataset1' | 'dataset2' | null>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File, target: 'dataset1' | 'dataset2') => {
    if (!file.name.endsWith('.csv')) {
      alert('Por favor selecciona un archivo en formato CSV.');
      return;
    }

    if (target === 'dataset1') {
      setLoading1(true);
      try {
        const parsed = await parseCSVFile(
          file,
          'dataset1',
          'Dataset 1: Usuarios, Suscripciones & Ventas',
          'Usuarios & Suscripciones'
        );
        onDatasetLoaded(parsed, dataset2);
      } catch (err: any) {
        alert(`Error al procesar Dataset 1: ${err.message}`);
      } finally {
        setLoading1(false);
      }
    } else {
      setLoading2(true);
      try {
        const parsed = await parseCSVFile(
          file,
          'dataset2',
          'Dataset 2: Eventos de Uso, Bloques & Interacciones',
          'Eventos & Comportamiento'
        );
        onDatasetLoaded(dataset1, parsed);
      } catch (err: any) {
        alert(`Error al procesar Dataset 2: ${err.message}`);
      } finally {
        setLoading2(false);
      }
    }
  };

  const previewTarget = previewDatasetId === 'dataset1' ? dataset1 : previewDatasetId === 'dataset2' ? dataset2 : null;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Ingeniería de Datos SaaS Nōva
          </span>
          <h2 className="text-xl font-bold tracking-tight">Carga y Detección Automática de Datasets</h2>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            Sube dos archivos CSV independientes: uno orientado al ciclo de vida del cliente (suscripciones, planes, altas) y otro con la telemetría de uso del editor (creación de bloques, IA, lienzos y soporte). El motor reconocerá sus variables automáticamente sin alterar los datos originales.
          </p>
        </div>
      </div>

      {/* PASO 1 — Dos componentes visibles de carga */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dropzone 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Cargar Dataset 1 (Usuarios / Suscripciones / Ventas)
                </h3>
              </div>
              {dataset1 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cargado
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Acepta CSV con cuentas, estados de suscripción, plan (Free, Pro, Team), ingresos o país.
            </p>

            <input
              type="file"
              ref={fileInputRef1}
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f, 'dataset1');
              }}
            />

            <div
              onClick={() => fileInputRef1.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleFileUpload(f, 'dataset1');
              }}
              className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/20 hover:bg-indigo-50/40 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center"
            >
              <UploadCloud className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-xs font-semibold text-slate-800">
                {loading1 ? 'Procesando archivo...' : 'Arrastra tu CSV aquí o haz clic para explorar'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">Formato CSV delimitado por comas</span>
            </div>
          </div>

          {/* Dataset 1 Summary Card */}
          {dataset1 && (
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-2">
              <div className="flex justify-between font-medium text-slate-800">
                <span className="truncate max-w-[200px]" title={dataset1.fileName || ''}>
                  📄 {dataset1.fileName}
                </span>
                <span className="text-indigo-600">{dataset1.rowCount} filas • {dataset1.columnCount} col</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block">Nulos promedio:</span>
                  <strong className="text-slate-700">
                    {Math.round(
                      (dataset1.columns.reduce((a, b) => a + b.nullPercentage, 0) / (dataset1.columns.length || 1)) * 10
                    ) / 10}
                    %
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Rango temporal:</span>
                  <strong className="text-slate-700 truncate block">
                    {dataset1.dateRange.min ? `${dataset1.dateRange.min} al ${dataset1.dateRange.max}` : 'No detectado'}
                  </strong>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPreviewDatasetId('dataset1')}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 hover:text-indigo-900"
                >
                  <Eye className="w-3.5 h-3.5" /> Ver primeras filas
                </button>
                <button
                  type="button"
                  onClick={() => onDatasetLoaded(null, dataset2)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-800 ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Quitar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dropzone 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Cargar Dataset 2 (Eventos de Uso / Bloques / Interacciones)
                </h3>
              </div>
              {dataset2 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cargado
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Acepta CSV con bloques creados, páginas, consultas IA, stickers, dispositivos, sesiones o CSAT.
            </p>

            <input
              type="file"
              ref={fileInputRef2}
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f, 'dataset2');
              }}
            />

            <div
              onClick={() => fileInputRef2.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleFileUpload(f, 'dataset2');
              }}
              className="border-2 border-dashed border-violet-200 hover:border-violet-400 bg-violet-50/20 hover:bg-violet-50/40 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center"
            >
              <UploadCloud className="w-8 h-8 text-violet-600 mb-2" />
              <span className="text-xs font-semibold text-slate-800">
                {loading2 ? 'Procesando archivo...' : 'Arrastra tu CSV aquí o haz clic para explorar'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">Formato CSV delimitado por comas</span>
            </div>
          </div>

          {/* Dataset 2 Summary Card */}
          {dataset2 && (
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-2">
              <div className="flex justify-between font-medium text-slate-800">
                <span className="truncate max-w-[200px]" title={dataset2.fileName || ''}>
                  📄 {dataset2.fileName}
                </span>
                <span className="text-violet-600">{dataset2.rowCount} filas • {dataset2.columnCount} col</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block">Nulos promedio:</span>
                  <strong className="text-slate-700">
                    {Math.round(
                      (dataset2.columns.reduce((a, b) => a + b.nullPercentage, 0) / (dataset2.columns.length || 1)) * 10
                    ) / 10}
                    %
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Rango temporal:</span>
                  <strong className="text-slate-700 truncate block">
                    {dataset2.dateRange.min ? `${dataset2.dateRange.min} al ${dataset2.dateRange.max}` : 'No detectado'}
                  </strong>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPreviewDatasetId('dataset2')}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-violet-700 hover:text-violet-900"
                >
                  <Eye className="w-3.5 h-3.5" /> Ver primeras filas
                </button>
                <button
                  type="button"
                  onClick={() => onDatasetLoaded(dataset1, null)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-800 ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Quitar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Demo helper CTA */}
      {(!dataset1 || !dataset2) && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-xl">💡</span>
            <div>
              <span className="font-semibold text-amber-950 block">¿No tienes archivos CSV a la mano en este momento?</span>
              <p className="text-amber-800">
                Carga instantáneamente dos datasets completos y estructurados específicamente para la startup <strong>Nōva</strong> con un solo clic.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLoadSampleData}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs transition-colors shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            Cargar Datasets de Prueba de Nōva
          </button>
        </div>
      )}

      {/* PASO 3 — Relación entre ambos datasets */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Posibles Relaciones entre Datasets</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Búsqueda automática de identificadores y campos compatibles entre Dataset 1 y Dataset 2. Si no existe una clave directa, se ejecutan análisis complementarios independientes para no forzar cruces espurios.
        </p>

        {relations.length > 0 ? (
          <div className="space-y-3">
            {relations.map((rel, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200/50">
                      D1.{rel.colDataset1}
                    </span>
                    <span className="text-slate-400">↔</span>
                    <span className="font-bold text-slate-900 font-mono bg-violet-50 text-violet-700 px-2 py-0.5 rounded-md border border-violet-200/50">
                      D2.{rel.colDataset2}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        rel.isReliable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rel.isReliable ? '✓ Unión Confiable' : '⚠ Coincidencia Parcial'}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-normal">{rel.utilityDescription}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block">Coincidencia</span>
                    <strong className="text-indigo-600 text-sm">{rel.matchRatePercent}%</strong>
                  </div>
                  <div className="text-center border-l border-slate-100 pl-3">
                    <span className="text-[10px] text-slate-400 block">Registros Cruzados</span>
                    <strong className="text-slate-800 text-sm">
                      {rel.matchedCount} / {Math.max(rel.totalUniqueD1, rel.totalUniqueD2)}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
            {dataset1 && dataset2
              ? 'No se identificó un identificador de usuario o workspace común directo. Los indicadores se calcularán por separado sin forzar uniones incorrectas.'
              : 'Carga ambos datasets para ejecutar el análisis de relaciones cruzadas.'}
          </div>
        )}
      </div>

      {/* PASO 2 — Columnas y Sinónimos SaaS Detectados */}
      {(dataset1 || dataset2) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Variables Detectadas mediante Sinónimos SaaS</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Reconocimiento de columnas en español e inglés según el diccionario semántico de métricas SaaS de Nōva.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataset1 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Columnas en Dataset 1
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {dataset1.columns.map((col, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between text-xs bg-white">
                      <div>
                        <span className="font-mono font-medium text-slate-800">{col.name}</span>
                        <span className="text-[10px] text-slate-400 ml-2">({col.dataType})</span>
                      </div>
                      {col.detectedRole ? (
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                          {col.detectedRole}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Sin rol asignado</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dataset2 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-violet-900 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Columnas en Dataset 2
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {dataset2.columns.map((col, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between text-xs bg-white">
                      <div>
                        <span className="font-mono font-medium text-slate-800">{col.name}</span>
                        <span className="text-[10px] text-slate-400 ml-2">({col.dataType})</span>
                      </div>
                      {col.detectedRole ? (
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-violet-50 text-violet-700 rounded-md border border-violet-100">
                          {col.detectedRole}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Sin rol asignado</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Preview of Table Rows */}
      {previewTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Vista previa: {previewTarget.title}</h4>
                <span className="text-xs text-slate-500">
                  Mostrando primeras 6 filas de {previewTarget.rowCount} registradas
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDatasetId(null)}
                className="text-xs font-medium px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
            <div className="p-4 overflow-auto">
              <table className="min-w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {previewTarget.columns.map((c, i) => (
                      <th key={i} className="p-2 text-left font-semibold text-slate-700 whitespace-nowrap">
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewTarget.rawData.slice(0, 6).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/70">
                      {previewTarget.columns.map((col, cIdx) => (
                        <td key={cIdx} className="p-2 text-slate-700 whitespace-nowrap font-mono text-[11px]">
                          {row[col.name] !== undefined && row[col.name] !== null ? String(row[col.name]) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
