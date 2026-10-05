import { DatasetFileState } from '../types/saas';
import { profileDataset } from './csvParser';

/**
 * Creates realistic sample datasets tailored for "Nōva" SaaS
 * Competitor in all-in-one productivity, personal & team knowledge management.
 */

export function createNovaSampleData(): {
  dataset1: DatasetFileState;
  dataset2: DatasetFileState;
  csvStringD1: string;
  csvStringD2: string;
} {
  const usersCount = 135;
  const profiles = ['Estudiante', 'Creador de Contenido', 'Startup', 'Empresa / Equipo'];
  const devices = ['Tablet con lápiz óptico', 'Laptop / Desktop', 'Móvil'];
  const countries = ['Perú', 'Colombia', 'México', 'Chile', 'España', 'Argentina'];
  const plans = ['Free', 'Pro', 'Team'];

  const d1Rows: Record<string, any>[] = [];
  const d2Rows: Record<string, any>[] = [];

  const startDate = new Date('2024-01-10');
  const now = new Date('2024-07-20');

  for (let i = 1; i <= usersCount; i++) {
    const userId = `USR_${1000 + i}`;
    const workspaceId = `WS_${2000 + Math.floor(i / 1.6)}`;
    
    // Pick plan with realistic conversion weights: 60% Free, 28% Pro, 12% Team
    const planRoll = Math.random();
    let plan = 'Free';
    let mrr = 0;
    let billingCycle = 'none';

    if (planRoll > 0.88) {
      plan = 'Team';
      mrr = 38.0; // PEN 38 or USD 38 (approx standard team tier)
      billingCycle = Math.random() > 0.4 ? 'monthly' : 'annual';
    } else if (planRoll > 0.60) {
      plan = 'Pro';
      mrr = 18.0; // PEN 18 / USD 18
      billingCycle = Math.random() > 0.3 ? 'monthly' : 'annual';
    }

    const profile = profiles[Math.floor(Math.random() * profiles.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    
    // Signup date distribution over last 6 months
    const dayOffset = Math.floor(Math.random() * 180);
    const signup = new Date(startDate.getTime() + dayOffset * 24 * 3600 * 1000);
    const signupDateStr = signup.toISOString().split('T')[0];

    // Churn status: Free users don't churn in subscription terms (they just inactive), paid churn is ~7-14%
    let isChurned = false;
    if (plan !== 'Free') {
      isChurned = Math.random() < 0.11; // 11% churn
    } else {
      isChurned = Math.random() < 0.22; // 22% inactive
    }

    const conversionDateStr = plan !== 'Free' 
      ? new Date(signup.getTime() + (Math.floor(Math.random() * 25) + 3) * 24 * 3600 * 1000).toISOString().split('T')[0]
      : '';

    const lastActiveOffset = isChurned ? Math.floor(Math.random() * 40) + 20 : Math.floor(Math.random() * 7);
    const lastActive = new Date(now.getTime() - lastActiveOffset * 24 * 3600 * 1000);
    const lastActiveStr = lastActive.toISOString().split('T')[0];

    d1Rows.push({
      user_id: userId,
      workspace_id: workspaceId,
      email: `user${i}@nova-user.com`,
      plan: plan,
      mrr: mrr,
      billing_cycle: billingCycle,
      user_profile: profile,
      signup_date: signupDateStr,
      conversion_date: conversionDateStr,
      last_active: lastActiveStr,
      churn_status: isChurned ? 'Cancelado' : 'Activo',
      country: country,
    });

    // Dataset 2: Editor Activity & Behavioral Events
    // Tablet users tend to use stickers and canvas visual elements much more
    const primaryDevice = devices[Math.floor(Math.random() * devices.length)];
    const isTablet = primaryDevice.includes('Tablet');
    const isHeavy = plan !== 'Free' || Math.random() > 0.7;

    const baseBlocks = isHeavy ? 350 + Math.floor(Math.random() * 950) : 40 + Math.floor(Math.random() * 180);
    const basePages = isHeavy ? 18 + Math.floor(Math.random() * 45) : 3 + Math.floor(Math.random() * 12);
    const aiQueries = (plan === 'Pro' || plan === 'Team')
      ? 25 + Math.floor(Math.random() * 120)
      : Math.floor(Math.random() * 8); // Free tier has trial AI
    
    // Stickers & visual elements correlation: highly used on tablets and creators
    const stickersUsed = isTablet || profile === 'Creador de Contenido'
      ? 15 + Math.floor(Math.random() * 65)
      : Math.floor(Math.random() * 12);

    const templatesUsed = profile === 'Estudiante' || profile === 'Startup'
      ? 6 + Math.floor(Math.random() * 18)
      : Math.floor(Math.random() * 6);

    const sessionDurationMin = isHeavy ? 45 + Math.floor(Math.random() * 95) : 10 + Math.floor(Math.random() * 30);
    const storageUsedMb = isHeavy ? 80 + Math.floor(Math.random() * 450) : 10 + Math.floor(Math.random() * 50);
    const supportTickets = isChurned ? Math.floor(Math.random() * 4) + 1 : Math.random() > 0.8 ? 1 : 0;
    const csat = isChurned ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 2) + 4; // 1-5

    d2Rows.push({
      user_id: userId,
      workspace_id: workspaceId,
      date: lastActiveStr,
      device: primaryDevice,
      blocks_created: baseBlocks,
      pages_created: basePages,
      ai_queries: aiQueries,
      stickers_used: stickersUsed,
      templates_used: templatesUsed,
      storage_used_mb: storageUsedMb,
      session_duration_min: sessionDurationMin,
      logins_count: isHeavy ? 18 + Math.floor(Math.random() * 25) : 3 + Math.floor(Math.random() * 8),
      csat_rating: csat,
      support_tickets: supportTickets,
    });
  }

  // Helper to convert array of objects to CSV string
  const convertToCSV = (rows: Record<string, any>[]): string => {
    if (rows.length === 0) return '';
    const headers = Object.keys(rows[0]);
    const csvLines = [headers.join(',')];
    for (const r of rows) {
      const line = headers.map((h) => {
        const val = r[h];
        if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      csvLines.push(line.join(','));
    }
    return csvLines.join('\n');
  };

  const csvStringD1 = convertToCSV(d1Rows);
  const csvStringD2 = convertToCSV(d2Rows);

  const dataset1 = profileDataset(
    'dataset1',
    'Dataset 1: Usuarios, Suscripciones y Ventas',
    'Usuarios & Suscripciones',
    'nova_usuarios_suscripciones.csv',
    d1Rows
  );

  const dataset2 = profileDataset(
    'dataset2',
    'Dataset 2: Eventos de Uso y Actividad en Editor',
    'Eventos & Comportamiento',
    'nova_eventos_actividad.csv',
    d2Rows
  );

  return { dataset1, dataset2, csvStringD1, csvStringD2 };
}

/**
 * Trigger file download in browser for sample CSV
 */
export function downloadCSV(csvContent: string, fileName: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
