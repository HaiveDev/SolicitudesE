export interface RequestDetailResponse {
    count: number;
    current: number;
    has_next: boolean;
    has_previous: boolean;
    results: ResultRequestDetail[];
}

export interface ResultRequestDetail {
    solicitudes: Solicitudes;
    obras: Obras;
    solicitudes_horarios: SolicitudesHorarios;
    usuarios_solicitantes: UsuariosSolicitantes;
    asignaciones?: Asignaciones;
    datos?: Datos;
    aprobaciones?: Aprobaciones;
}

export interface Solicitudes {
    numero_solicitud: string;
    numero_siec: string; // "None" en caso de no tener
    estado: string;
    rechazo_observacion: string;
    usuario: string;
    created_at: string; // formato ISO
    tipo_display: string;
    clase_display: string;
    reporte: string;
}

export interface Obras {
    uso: string;
    zona: string;
    sector: string;
    latitud: string; // "None" si no hay valor
    longitud: string;
    direccion: string;
    tipo_carga: string;
    carga_nueva: string;
    carga_total: string;
    observacion: string;
    departamento: string;
    fachada_foto: string;
    codigo_cliente: string;
    archivo_factura: string;
    nombre_proyecto: string;
    direccion_barrio: string;
    tipo_transformador: string;
    direccion_municipio: string;
    medidores_existentes: string;
    medidores_proyectados: string;
    cantidad_transformador: string;
    direccion_centro_poblado: string;
}

export interface SolicitudesHorarios {
    jornada: string;
    dia_semana: string;
    observacion: string;
}

export interface UsuariosSolicitantes {
    email: string;
    nombre: string;
    sector: string;
    celular1: string;
    celular2: string;
    telefono: string;
    direccion: string;
    direccion_barrio: string;
    numero_documento: string;
    archivo_documento: string;
    direccion_municipio: string;
    direccion_departamento: string;
    direccion_centro_poblado: string;
}

export interface Asignaciones {
    jornada: string;
    added_by: string;
    created_at: string;
    tecnico1: string;
    tecnico2: string;
    tecnico3: string;
    observacion: string;
    estado_asignacion: string;
    fecha_agendamiento: string; // formato YYYY-MM-DD
}

export interface Datos {
    added_by: string;
    created_at: string;
    circuito: string;
    nodo_foto: string;
    nodo_poste: string;
    corriente_x: string;
    corriente_y: string;
    corriente_z: string;
    observacion: string;
    fachada_foto: string;
    red_existente: string;
    fecha_visita_fin: string;
    tipo_red_existente: string;
    tipo_transformador: string;
    transformador_foto: string;
    fecha_visita_inicio: string;
    placa_transformador: string;
    corriente_fecha_lectura: string;
    potencia_transformador: string;
    latitud_transformador: string;
    longitud_transformador: string;
    latitud_punto_conexion: string;
    longitud_punto_conexion: string;
    latitud_punto_instalacion: string;
    longitud_punto_instalacion: string;
}

export interface Aprobaciones {
    added_by: string;
    created_at: string;
    nota: string;
    decision: string;
    observacion: string;
    cargabilidad: string;
    procedimiento: string;
    plantilla_reporte: string;
}
