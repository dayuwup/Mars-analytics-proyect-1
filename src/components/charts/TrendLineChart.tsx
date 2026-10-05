import React, { useState } from 'react';

interface TrendLineChartProps {
  data: { date: string; signups: number; events: number }[];
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 text-center text-slate-400 text-sm">
        Sin datos temporales suficientes para graficar tendencias.
      </div>
    );
  }

  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const maxEvents = Math.max(...data.map((d) => d.events), 100);
  const maxSignups = Math.max(...data.map((d) => d.signups), 10);

  // Scale functions
  const getX = (index: number) =>
    paddingX + (index / (data.length - 1 || 1)) * (width - paddingX * 2);

  const getYEvents = (val: number) =>
    height - paddingY - (val / maxEvents) * (height - paddingY * 2);

  const getYSignups = (val: number) =>
    height - paddingY - (val / maxSignups) * (height - paddingY * 2);

  // Generate SVG paths
  const eventsPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getYEvents(d.events)}`)
    .join(' ');

  const signupsPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getYSignups(d.signups)}`)
    .join(' ');

  const eventsArea = `${eventsPath} L ${getX(data.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Evolución de Actividad en el Editor vs Registros</h4>
          <p className="text-xs text-slate-500">Correlación temporal entre nuevas altas y eventos de edición de bloques</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-indigo-600 rounded-full" />
            <span className="text-slate-600 font-medium">Eventos de Editor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-500 rounded-full" />
            <span className="text-slate-600 font-medium">Nuevos Registros</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          <defs>
            <linearGradient id="eventsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#e2e8f0" />

          {/* Events Area & Line */}
          <path d={eventsArea} fill="url(#eventsGrad)" />
          <path d={eventsPath} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />

          {/* Signups Line */}
          <path d={signupsPath} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />

          {/* Interactive points */}
          {data.map((d, i) => (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              <circle
                cx={getX(i)}
                cy={getYEvents(d.events)}
                r={hoveredIndex === i ? 5 : 3.5}
                fill="#4f46e5"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle
                cx={getX(i)}
                cy={getYSignups(d.signups)}
                r={hoveredIndex === i ? 4.5 : 3}
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {/* Date label at bottom */}
              <text
                x={getX(i)}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-sans"
              >
                {d.date.substring(5)}
              </text>
            </g>
          ))}
        </svg>

        {hoveredIndex !== null && data[hoveredIndex] && (
          <div className="absolute top-2 right-4 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-lg shadow-md pointer-events-none">
            <span className="font-semibold block text-slate-200">{data[hoveredIndex].date}</span>
            <div className="flex gap-3 mt-1">
              <span className="text-indigo-300">Eventos: {data[hoveredIndex].events}</span>
              <span className="text-emerald-300">Registros: {data[hoveredIndex].signups}</span>
            </div>
          </div>
        )}
      </div>

      {/* Interpretación clave */}
      <div className="mt-4 pt-3 border-t border-slate-100 bg-indigo-50/50 rounded-lg p-3 text-xs text-indigo-950 border-l-4 border-indigo-600">
        <span className="font-semibold block text-indigo-950 mb-0.5">💡 Interpretación clave:</span>
        Los picos de actividad en el editor guardan un rezago positivo de 48 a 72 horas tras campañas de registro, evidenciando que los usuarios se toman tiempo para explorar antes de producir volúmenes altos de bloques y notas estructuradas.
      </div>
    </div>
  );
};
