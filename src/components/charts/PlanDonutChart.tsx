import React from 'react';
import { CurrencyType } from '../../types/saas';

interface PlanDonutProps {
  plans: { name: string; count: number; mrr: number; color: string }[];
  currency: CurrencyType;
}

export const PlanDonutChart: React.FC<PlanDonutProps> = ({ plans, currency }) => {
  const totalUsers = plans.reduce((acc, p) => acc + p.count, 0) || 1;
  const totalMrr = plans.reduce((acc, p) => acc + p.mrr, 0);

  // Calculate SVG arc paths
  let cumulativeAngle = 0;
  const slices = plans.map((plan) => {
    const fraction = plan.count / totalUsers;
    const angle = fraction * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    // SVG coordinates for donut ring
    const radStart = (startAngle - 90) * (Math.PI / 180);
    const radEnd = (endAngle - 90) * (Math.PI / 180);

    const x1Outer = 100 + 75 * Math.cos(radStart);
    const y1Outer = 100 + 75 * Math.sin(radStart);
    const x2Outer = 100 + 75 * Math.cos(radEnd);
    const y2Outer = 100 + 75 * Math.sin(radEnd);

    const x1Inner = 100 + 48 * Math.cos(radEnd);
    const y1Inner = 100 + 48 * Math.sin(radEnd);
    const x2Inner = 100 + 48 * Math.cos(radStart);
    const y2Inner = 100 + 48 * Math.sin(radStart);

    const largeArc = angle > 180 ? 1 : 0;
    const pathData = `M ${x1Outer} ${y1Outer} A 75 75 0 ${largeArc} 1 ${x2Outer} ${y2Outer} L ${x1Inner} ${y1Inner} A 48 48 0 ${largeArc} 0 ${x2Inner} ${y2Inner} Z`;

    return {
      ...plan,
      percentage: Math.round(fraction * 100),
      pathData,
    };
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Distribución de Suscripciones &amp; MRR</h4>
          <p className="text-xs text-slate-500">Volumen de usuarios y aporte financiero por nivel</p>
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
          Total: {totalUsers} usuarios
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* SVG Donut */}
        <div className="relative flex justify-center items-center">
          <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-xs">
            {slices.map((slice, i) => (
              <path
                key={i}
                d={slice.pathData}
                fill={slice.color}
                className="transition-opacity hover:opacity-85 cursor-pointer"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-400 font-medium">MRR Activo</span>
            <span className="text-base font-bold text-slate-800">
              {currency === 'PEN' ? 'S/ ' : '$ '}
              {totalMrr.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Legend & Breakdown */}
        <div className="space-y-3">
          {slices.map((plan, i) => (
            <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50/70 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: plan.color }} />
                <span className="font-semibold text-slate-700">{plan.name}</span>
                <span className="text-slate-400">({plan.percentage}%)</span>
              </div>
              <div className="text-right">
                <span className="font-medium text-slate-900">{plan.count} usuarios</span>
                <div className="text-slate-500 font-mono text-[11px]">
                  {currency === 'PEN' ? 'S/ ' : '$ '}
                  {plan.mrr.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interpretación clave */}
      <div className="mt-4 pt-3 border-t border-slate-100 bg-amber-50/50 rounded-lg p-3 text-xs text-amber-900 border-l-4 border-amber-500">
        <span className="font-semibold block text-amber-950 mb-0.5">💡 Interpretación clave:</span>
        Los planes Pro y Team representan el motor de monetización de Nōva. La masa crítica de usuarios Free ofrece un terreno fértil de conversión si se activan detonantes de valor en los primeros 14 días.
      </div>
    </div>
  );
};
