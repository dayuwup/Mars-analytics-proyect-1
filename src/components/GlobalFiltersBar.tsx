import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { GlobalFilterState } from '../types/saas';

interface FilterBarProps {
  filters: GlobalFilterState;
  onChange: (updated: GlobalFilterState) => void;
  availablePlans: string[];
  availableDevices: string[];
  availableSegments: string[];
  totalFilteredUsers: number;
}

export const GlobalFiltersBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  availablePlans,
  availableDevices,
  availableSegments,
  totalFilteredUsers,
}) => {
  const isFiltered =
    filters.plan !== 'all' ||
    filters.device !== 'all' ||
    filters.userSegment !== 'all' ||
    filters.searchQuery !== '';

  const handleReset = () => {
    onChange({
      plan: 'all',
      device: 'all',
      userSegment: 'all',
      dateRange: 'all',
      searchQuery: '',
    });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs mb-6 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium mr-1">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Filtros Globales:</span>
          </div>

          {/* Plan Filter */}
          <select
            value={filters.plan}
            onChange={(e) => onChange({ ...filters, plan: e.target.value })}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 bg-slate-50/50 hover:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Todos los Planes</option>
            {availablePlans.map((p) => (
              <option key={p} value={p}>
                Plan {p}
              </option>
            ))}
          </select>

          {/* Device Filter */}
          <select
            value={filters.device}
            onChange={(e) => onChange({ ...filters, device: e.target.value })}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 bg-slate-50/50 hover:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Cualquier Dispositivo</option>
            {availableDevices.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* User Segment / Profile */}
          <select
            value={filters.userSegment}
            onChange={(e) => onChange({ ...filters, userSegment: e.target.value })}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 bg-slate-50/50 hover:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Todos los Segmentos</option>
            {availableSegments.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar usuario o ID..."
              value={filters.searchQuery}
              onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
              className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 bg-slate-50/50 hover:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-44"
            />
          </div>
        </div>

        {/* Right Info & Reset */}
        <div className="flex items-center gap-3">
          <span className="text-slate-500">
            Filtrados: <strong className="text-slate-800">{totalFilteredUsers}</strong> registros
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium"
              title="Restablecer todos los filtros"
            >
              <RotateCcw className="w-3 h-3" />
              Limpiar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
