import React from 'react';

export const ActivityHeatmapChart: React.FC = () => {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const timeSlots = ['Mañana (6-12h)', 'Tarde (12-18h)', 'Noche (18-24h)', 'Madrugada (0-6h)'];

  // Synthetic normalized intensity distribution (0 to 100) reflecting productivity app behavior:
  // Heavy activity Mon-Thu mornings/afternoons, weekend creative sessions on tablets
  const grid = [
    [85, 90, 65, 12], // Lun
    [92, 95, 70, 15], // Mar
    [88, 92, 75, 14], // Mié
    [80, 85, 80, 20], // Jue
    [75, 70, 60, 25], // Vie
    [45, 60, 82, 30], // Sáb (creative sessions / personal notes)
    [50, 65, 88, 22], // Dom (planning week ahead)
  ];

  const getColor = (val: number) => {
    if (val >= 85) return 'bg-indigo-700 text-white';
    if (val >= 65) return 'bg-indigo-500 text-white';
    if (val >= 45) return 'bg-indigo-300 text-slate-900';
    if (val >= 20) return 'bg-indigo-100 text-slate-800';
    return 'bg-slate-100 text-slate-400';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Mapa de Calor: Intensidad de Edición en Nōva</h4>
          <p className="text-xs text-slate-500">Distribución semanal y horaria de creación de bloques y notas</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span>Baja</span>
          <div className="flex gap-0.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-100 border border-slate-200" />
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-100" />
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-300" />
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500" />
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-700" />
          </div>
          <span>Alta</span>
        </div>
      </div>

      <div className="overflow-x-auto my-2">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-1.5 text-left font-medium text-slate-400 text-[11px]">Día / Horario</th>
              {timeSlots.map((slot, i) => (
                <th key={i} className="p-1.5 text-center font-medium text-slate-500 text-[11px]">
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, dIdx) => (
              <tr key={dIdx} className="border-t border-slate-100">
                <td className="p-1.5 font-semibold text-slate-700 text-xs">{day}</td>
                {grid[dIdx].map((val, tIdx) => (
                  <td key={tIdx} className="p-1">
                    <div
                      className={`h-7 rounded flex items-center justify-center text-[10px] font-mono font-medium transition-transform hover:scale-105 cursor-pointer ${getColor(
                        val
                      )}`}
                      title={`${day}, ${timeSlots[tIdx]}: ${val}% intensidad`}
                    >
                      {val}%
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interpretación clave */}
      <div className="mt-4 pt-3 border-t border-slate-100 bg-violet-50/50 rounded-lg p-3 text-xs text-violet-950 border-l-4 border-violet-600">
        <span className="font-semibold block text-violet-950 mb-0.5">💡 Interpretación clave:</span>
        Se identifican dos patrones marcados: trabajo corporativo y de estudio de lunes a jueves en mañanas/tardes, y sesiones de planeación personal los domingos por la noche (alta concentración de stickers y plantillas de metas semanales).
      </div>
    </div>
  );
};
