export enum RedirectionHistory {
    user = 'user',
    dist_coordinador = 'dist_coordinador',
    dist_tecnico = 'dist_tecnico',
    dist_aprobador = 'dist_aprobador',
}

export interface ResponseRequestHistory {
  count: number;
  next: string | null;
  previous: string | null;
  results: SolicitudesHistory[  ];
}

export interface SolicitudesHistory {
  pk: number;
  numero_solicitud: number;
  numero_siec: string | null;
  matricula: boolean;
  usuario: Usuario;
  centro_poblado: Centro_poblado;
  solicitud: Solicitud;
  creado: string;
  ultima_ejecucion: UltimaEjecucion;
}

export interface Usuario {
  nombre: string;
}
export interface Centro_poblado {
  agrupado: string;
  departamento: string;
  municipio: string;
  nombre: string;
}
export interface Solicitud {
  clase_display: string;
  tipo_display: string;
}

export interface UltimaEjecucion {
  avance: number;
  estado: string;
  creado: string;
  finalizado: boolean;
}
