import React from 'react';

interface DeviceBarProps {
  tabletPct: number;
  desktopPct: number;
  mobilePct: number;
  available: boolean;
}

export const DeviceBarChart: React.FC<DeviceBarProps> = ({
  tabletPct,
  desktopPct,
  mobilePct,
  available,
}) => {
  if (!available) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 text-center text-slate-400 text-sm">
        Dato no disponible en los datasets cargados.
      </div>
    );
  }

  const items = [
    { label: 'Tablet con Lápiz Óptico', pct: tabletPct, color: 'bg-indigo-500', note: 'Mayor permanencia y stickers' },
    { label: 'Laptop / Escritorio', pct: desktopPct, color: 'bg-sky-500', note: 'Creación masiva de bloques' },
    { label: 'Teléfono Móvil', pct: mobilePct, color: 'bg-emerald-500', note: 'Consultas rápidas y checklists' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Uso por Plataforma &amp; Dispositivo</h4>
          <p className="text-xs text-slate-500">Comportamiento según el hardware preferido por el usuario</p>
        </div>
      </div>

      <div className="space-y-4 my-2">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">{item.note}</span>
                <span className="font-bold text-slate-900">{item.pct}%</span>
              </div>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Interpretación clave */}
      <div className="mt-4 pt-3 border-t border-slate-100 bg-sky-50/50 rounded-lg p-3 text-xs text-sky-950 border-l-4 border-sky-500">
        <span className="font-semibold block text-sky-950 mb-0.5">💡 Interpretación clave:</span>
        La cuota de tablets ({tabletPct}%) es significativamente alta para un SaaS de productividad frente al promedio de la industria (~18%), validando la ventaja competitiva de Nōva en soporte táctil y lienzos de dibujo.
      </div>
    </div>
  );
};
