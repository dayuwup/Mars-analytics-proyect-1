/**
 * SaaS Synonym Dictionary and Smart Matcher for Nōva
 * Identifies key SaaS variables automatically from column headers (Spanish and English).
 */

export interface SynonymCategory {
  role: string;
  label: string;
  description: string;
  synonyms: string[];
}

export const SAAS_SYNONYM_RULES: SynonymCategory[] = [
  {
    role: 'user_id',
    label: 'ID de Usuario / Cliente',
    description: 'Identificador único del usuario o cuenta en la plataforma',
    synonyms: [
      'user_id', 'userid', 'usuario_id', 'id_usuario', 'usuario', 'customer', 'customer_id',
      'client', 'client_id', 'cliente', 'account_id', 'member_id', 'uuid', 'email', 'correo', 'user'
    ],
  },
  {
    role: 'workspace_id',
    label: 'ID de Espacio de Trabajo / Equipo',
    description: 'Identificador del espacio colaborativo o team',
    synonyms: [
      'workspace_id', 'workspace', 'espacio_id', 'espacio_trabajo', 'team_id', 'equipo_id',
      'org_id', 'organization_id', 'company_id', 'grupo_id'
    ],
  },
  {
    role: 'plan',
    label: 'Tipo de Plan / Suscripción',
    description: 'Nivel de plan contratado (ej. Free, Pro, Team, Enterprise)',
    synonyms: [
      'plan', 'tier', 'subscription', 'suscripcion', 'tipo_plan', 'nivel', 'membership',
      'package', 'pricing_tier', 'plan_name', 'subscription_tier'
    ],
  },
  {
    role: 'mrr',
    label: 'Métricas Monetarias / MRR / Precio',
    description: 'Ingreso recurrente mensual, precio pagado o facturación',
    synonyms: [
      'mrr', 'revenue', 'ingresos', 'price', 'precio', 'subscription_cost', 'costo_suscripcion',
      'billing_amount', 'monto', 'monto_mensual', 'amount', 'fee', 'charge', 'arpu', 'pago'
    ],
  },
  {
    role: 'billing_cycle',
    label: 'Ciclo de Facturación',
    description: 'Frecuencia de pago (mensual, anual)',
    synonyms: [
      'billing_cycle', 'cycle', 'frecuencia_pago', 'periodo_facturacion', 'interval', 'billing_period'
    ],
  },
  {
    role: 'blocks_created',
    label: 'Bloques Creados',
    description: 'Unidad central atómica de contenido en el editor de Nōva',
    synonyms: [
      'blocks_created', 'blocks', 'bloques', 'bloques_creados', 'total_blocks', 'bloques_editados',
      'editor_blocks', 'block_count'
    ],
  },
  {
    role: 'pages_created',
    label: 'Páginas / Documentos Creados',
    description: 'Estructuras de notas y documentos organizados',
    synonyms: [
      'pages_created', 'pages', 'paginas', 'paginas_creadas', 'docs_created', 'documentos',
      'notas_creadas', 'notes_count', 'page_count'
    ],
  },
  {
    role: 'ai_queries',
    label: 'Consultas a IA / Asistente Nōva',
    description: 'Interacciones con el modelo de IA para resúmenes, síntesis y generación',
    synonyms: [
      'ai_queries', 'ai_usage', 'consultas_ia', 'ia_queries', 'ai_prompts', 'tokens_used',
      'gemini_calls', 'ai_actions', 'interacciones_ia', 'ai_count'
    ],
  },
  {
    role: 'storage_used',
    label: 'Almacenamiento Usado (MB/GB)',
    description: 'Espacio consumido por archivos, imágenes y adjuntos',
    synonyms: [
      'storage_used', 'storage', 'almacenamiento', 'storage_mb', 'storage_gb', 'espacio_usado',
      'megabytes', 'space_consumed', 'file_size_mb'
    ],
  },
  {
    role: 'session_duration',
    label: 'Duración de Sesión / Tiempo en App',
    description: 'Minutos o segundos de uso activo del editor',
    synonyms: [
      'session_duration', 'time_spent', 'duracion_sesion', 'session_minutes', 'tiempo_activo_min',
      'active_time', 'minutes_in_app', 'duracion_min'
    ],
  },
  {
    role: 'logins',
    label: 'Inicios de Sesión / Días Activos',
    description: 'Frecuencia de accesos o visitas registradas',
    synonyms: [
      'logins', 'sessions', 'inicios_sesion', 'active_days', 'dias_activos', 'visit_count',
      'session_count', 'accesos'
    ],
  },
  {
    role: 'templates_used',
    label: 'Plantillas Utilizadas',
    description: 'Uso de esqueletos prediseñados de productividad',
    synonyms: [
      'templates_used', 'templates', 'plantillas', 'plantillas_usadas', 'templates_applied',
      'template_clones', 'plantillas_descargadas'
    ],
  },
  {
    role: 'stickers_used',
    label: 'Stickers / Elementos Visuales / Pizarra',
    description: 'Uso de widgets, stickers decorativos y herramientas de canvas visual',
    synonyms: [
      'stickers_used', 'stickers', 'pegatinas', 'widgets_used', 'widgets', 'canvas_elements',
      'visual_elements', 'iconos_personalizados', 'stickers_agregados'
    ],
  },
  {
    role: 'device',
    label: 'Dispositivo / Plataforma',
    description: 'Dispositivo principal de uso (Tablet, Desktop, Móvil)',
    synonyms: [
      'device', 'platform', 'dispositivo', 'plataforma', 'os', 'sistema_operativo', 'device_type',
      'client_device', 'tipo_dispositivo'
    ],
  },
  {
    role: 'signup_date',
    label: 'Fecha de Registro / Creación',
    description: 'Momento en que el usuario se dio de alta en Nōva',
    synonyms: [
      'signup_date', 'fecha_registro', 'created_at', 'registration_date', 'join_date',
      'fecha_alta', 'sign_up', 'register_time', 'creation_date'
    ],
  },
  {
    role: 'last_active',
    label: 'Última Actividad',
    description: 'Fecha u hora de la última interacción registrada',
    synonyms: [
      'last_active', 'ultima_actividad', 'last_seen', 'fecha_ultimo_acceso', 'updated_at',
      'last_login', 'ultimo_ingreso', 'most_recent_event'
    ],
  },
  {
    role: 'conversion_date',
    label: 'Fecha de Conversión a Pro',
    description: 'Fecha en que el usuario pasó de Free a plan de pago',
    synonyms: [
      'conversion_date', 'fecha_conversion', 'upgrade_date', 'fecha_pago', 'paid_since',
      'pro_start_date', 'activation_date'
    ],
  },
  {
    role: 'date',
    label: 'Fecha / Marca Temporal General',
    description: 'Fecha genérica del evento o registro temporal',
    synonyms: [
      'date', 'fecha', 'timestamp', 'event_date', 'day', 'dia', 'period', 'periodo', 'event_time'
    ],
  },
  {
    role: 'churn_status',
    label: 'Estado de Cancelación / Churn',
    description: 'Indicador de cancelación, suspensión o retención activa',
    synonyms: [
      'churn', 'churned', 'status', 'estado', 'cancelado', 'cancelled', 'is_active', 'activo',
      'estado_suscripcion', 'subscription_status', 'membership_status'
    ],
  },
  {
    role: 'user_profile',
    label: 'Perfil / Segmento de Usuario',
    description: 'Ocupación o rol (ej. Estudiante, Creador, Startup, Empresa)',
    synonyms: [
      'user_profile', 'profile', 'segment', 'segmento', 'user_type', 'tipo_usuario',
      'ocupacion', 'profession', 'role', 'rol', 'persona', 'use_case', 'caso_uso'
    ],
  },
  {
    role: 'country',
    label: 'País / Región Geográfica',
    description: 'Ubicación territorial del usuario o workspace',
    synonyms: [
      'country', 'pais', 'region', 'location', 'ubicacion', 'territory', 'geo', 'city', 'ciudad'
    ],
  },
  {
    role: 'csat',
    label: 'Satisfacción / CSAT / NPS',
    description: 'Calificación dada por el usuario de 1 a 5 o de 0 a 10',
    synonyms: [
      'csat', 'nps', 'rating', 'satisfaccion', 'calificacion', 'score', 'feedback_score',
      'satisfaction_score', 'user_rating'
    ],
  },
  {
    role: 'support_tickets',
    label: 'Tickets de Soporte',
    description: 'Cantidad de solicitudes de soporte o incidencias reportadas',
    synonyms: [
      'support_tickets', 'tickets', 'tickets_soporte', 'incidencias', 'issues_reported',
      'help_requests', 'tickets_abiertos'
    ],
  },
];

/**
 * Clean string for matching (lowercase, strip special characters, trim)
 */
export function normalizeHeader(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Detects role of a column name based on synonyms
 */
export function detectColumnRole(columnName: string): { role: string; confidence: number; label: string } | null {
  const norm = normalizeHeader(columnName);

  for (const rule of SAAS_SYNONYM_RULES) {
    for (const syn of rule.synonyms) {
      const normSyn = normalizeHeader(syn);
      if (norm === normSyn) {
        return { role: rule.role, confidence: 1.0, label: rule.label };
      }
      if (norm.includes(normSyn) || normSyn.includes(norm)) {
        return { role: rule.role, confidence: 0.85, label: rule.label };
      }
    }
  }

  return null;
}
