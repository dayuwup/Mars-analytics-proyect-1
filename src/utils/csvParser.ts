import Papa from 'papaparse';
import { ColumnDataType, ColumnProfile, DatasetFileState, MatchedRelation } from '../types/saas';
import { detectColumnRole, normalizeHeader } from './synonymMatcher';

/**
 * Checks whether a string represents a valid date
 */
function isValidDateString(val: string): boolean {
  if (!val || typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (trimmed.length < 6) return false;
  // Common date formats: YYYY-MM-DD, DD/MM/YYYY, ISO
  const hasDateSeparators = /[-/.]/.test(trimmed);
  if (!hasDateSeparators) return false;
  const parsed = Date.parse(trimmed);
  return !isNaN(parsed) && parsed > Date.parse('2000-01-01') && parsed < Date.parse('2035-01-01');
}

/**
 * Infer column data type based on sample values
 */
function inferDataType(values: any[], columnName: string): ColumnDataType {
  const normName = normalizeHeader(columnName);
  if (normName.includes('id') || normName.includes('uuid') || normName.includes('email') || normName.includes('token')) {
    return 'identifier';
  }

  let numericCount = 0;
  let dateCount = 0;
  let booleanCount = 0;
  let validCount = 0;

  for (const raw of values) {
    if (raw === null || raw === undefined || raw === '') continue;
    validCount++;
    const str = String(raw).trim();

    // Check boolean
    if (['true', 'false', '1', '0', 'si', 'no', 'yes', 'activo', 'inactivo'].includes(str.toLowerCase())) {
      booleanCount++;
    }

    // Check numeric
    const cleanNum = str.replace(/[$,€S/.]/g, '').trim();
    if (!isNaN(Number(str)) || (!isNaN(Number(cleanNum)) && cleanNum.length > 0)) {
      numericCount++;
    }

    // Check date
    if (isValidDateString(str)) {
      dateCount++;
    }
  }

  if (validCount === 0) return 'text';
  if (dateCount / validCount > 0.6) return 'date';
  if (numericCount / validCount > 0.7) return 'number';
  if (booleanCount / validCount > 0.8) return 'boolean';

  // Check unique ratio for category vs free text
  const uniqueCount = new Set(values.map((v) => String(v).toLowerCase())).size;
  if (uniqueCount <= 15 || uniqueCount / validCount < 0.2) {
    return 'category';
  }

  return 'text';
}

/**
 * Analyzes raw parsed rows into rich DatasetFileState
 */
export function profileDataset(
  id: 'dataset1' | 'dataset2',
  title: string,
  suggestedRole: string,
  fileName: string,
  rows: Record<string, any>[]
): DatasetFileState {
  if (!rows || rows.length === 0) {
    return {
      id,
      title,
      suggestedRole,
      fileName,
      rawData: [],
      columns: [],
      rowCount: 0,
      columnCount: 0,
      dateRange: { min: null, max: null },
      keyCategories: {},
      loadedAt: new Date(),
    };
  }

  const columnNames = Object.keys(rows[0] || {});
  const rowCount = rows.length;
  const columns: ColumnProfile[] = [];
  const keyCategories: Record<string, { value: string; count: number }[]> = {};
  let overallMinDate: string | null = null;
  let overallMaxDate: string | null = null;

  for (const colName of columnNames) {
    let nullCount = 0;
    const values: any[] = [];
    const valFreqMap: Record<string, number> = {};

    for (const r of rows) {
      const val = r[colName];
      if (val === null || val === undefined || String(val).trim() === '' || String(val).toLowerCase() === 'nan' || String(val).toLowerCase() === 'null') {
        nullCount++;
      } else {
        values.push(val);
        const strVal = String(val).trim();
        valFreqMap[strVal] = (valFreqMap[strVal] || 0) + 1;
      }
    }

    const dataType = inferDataType(values, colName);
    const roleMatch = detectColumnRole(colName);
    const uniqueValuesCount = Object.keys(valFreqMap).length;

    // Track dates if date column
    if (dataType === 'date') {
      for (const v of values) {
        const d = new Date(v);
        if (!isNaN(d.getTime())) {
          const iso = d.toISOString().split('T')[0];
          if (!overallMinDate || iso < overallMinDate) overallMinDate = iso;
          if (!overallMaxDate || iso > overallMaxDate) overallMaxDate = iso;
        }
      }
    }

    // Top categories if category or small unique
    if (dataType === 'category' || (uniqueValuesCount <= 10 && uniqueValuesCount > 1)) {
      const sortedCats = Object.entries(valFreqMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([val, count]) => ({ value: val, count }));
      keyCategories[colName] = sortedCats;
    }

    columns.push({
      name: colName,
      dataType,
      nullCount,
      nullPercentage: Math.round((nullCount / rowCount) * 1000) / 10,
      uniqueValuesCount,
      sampleValues: values.slice(0, 5),
      detectedRole: roleMatch?.role,
    });
  }

  return {
    id,
    title,
    suggestedRole,
    fileName,
    rawData: rows,
    columns,
    rowCount,
    columnCount: columnNames.length,
    dateRange: { min: overallMinDate, max: overallMaxDate },
    keyCategories,
    loadedAt: new Date(),
  };
}

/**
 * Parses raw CSV string or file using PapaParse
 */
export function parseCSVFile(
  file: File,
  id: 'dataset1' | 'dataset2',
  title: string,
  suggestedRole: string
): Promise<DatasetFileState> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: true,
      complete: (results) => {
        try {
          const cleanData = (results.data as Record<string, any>[]).filter((row) => {
            return Object.values(row).some((v) => v !== null && v !== undefined && String(v).trim() !== '');
          });
          const profile = profileDataset(id, title, suggestedRole, file.name, cleanData);
          resolve(profile);
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => {
        reject(err);
      },
    });
  });
}

/**
 * Finds matching relations between two datasets (PASO 3)
 */
export function findDatasetRelations(
  d1: DatasetFileState | null,
  d2: DatasetFileState | null
): MatchedRelation[] {
  if (!d1 || !d2 || d1.rawData.length === 0 || d2.rawData.length === 0) {
    return [];
  }

  const relations: MatchedRelation[] = [];

  for (const c1 of d1.columns) {
    for (const c2 of d2.columns) {
      let isCandidate = false;
      let matchedRole = '';

      // Direct column name match or role match
      if (c1.detectedRole && c2.detectedRole && c1.detectedRole === c2.detectedRole) {
        isCandidate = true;
        matchedRole = c1.detectedRole;
      } else if (normalizeHeader(c1.name) === normalizeHeader(c2.name)) {
        isCandidate = true;
        matchedRole = c1.detectedRole || c2.detectedRole || 'common_field';
      }

      if (isCandidate) {
        // Evaluate value overlap
        const set1 = new Set(
          d1.rawData
            .map((r) => r[c1.name])
            .filter((v) => v !== null && v !== undefined && String(v).trim() !== '')
            .map((v) => String(v).toLowerCase().trim())
        );
        const set2 = new Set(
          d2.rawData
            .map((r) => r[c2.name])
            .filter((v) => v !== null && v !== undefined && String(v).trim() !== '')
            .map((v) => String(v).toLowerCase().trim())
        );

        let overlapCount = 0;
        for (const item of set1) {
          if (set2.has(item)) overlapCount++;
        }

        const smallerSize = Math.min(set1.size, set2.size);
        const matchRatePercent = smallerSize > 0 ? Math.round((overlapCount / smallerSize) * 100) : 0;

        let utilityDescription = '';
        if (matchedRole === 'user_id') {
          utilityDescription =
            'Clave primaria de usuario: Permite cruzar comportamiento de edición, adopción de herramientas e interacciones con el estado de suscripción y planes de pago.';
        } else if (matchedRole === 'workspace_id') {
          utilityDescription =
            'Identificador de espacio colaborativo: Facilita el análisis a nivel de equipo y volumen de consumo consolidado.';
        } else if (matchedRole === 'plan') {
          utilityDescription =
            'Tipo de suscripción: Permite segmentar eventos por categoría de plan sin requerir un join estricto por usuario.';
        } else if (matchedRole === 'date') {
          utilityDescription =
            'Coincidencia temporal: Permite alinear registros de altas/conversiones con picos de actividad y saturación de eventos.';
        } else {
          utilityDescription = `Campo común (${c1.name}): Permite enriquecer el análisis comparativo entre ambos datasets.`;
        }

        relations.push({
          colDataset1: c1.name,
          colDataset2: c2.name,
          role: matchedRole,
          matchRatePercent,
          matchedCount: overlapCount,
          totalUniqueD1: set1.size,
          totalUniqueD2: set2.size,
          utilityDescription,
          isReliable: matchRatePercent >= 40,
        });
      }
    }
  }

  // Sort by match rate descending
  return relations.sort((a, b) => b.matchRatePercent - a.matchRatePercent);
}
