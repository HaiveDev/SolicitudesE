export interface FormNewRequest {

     configuracion_solicitud: ConfiguracionSolicitud;
     usuarios_solicitantes: UsuarioSolicitanteNewRequest;
     obras: ObraNewRequest;
     solicitudes_horarios: SolicitudeHorario;
     archivo_documento: File | null;
     fachada_foto: File | null;
     archivo_factura: File | null;
}

interface ConfiguracionSolicitud {
     tipo_formulario: string;
     tipo_solicitud: string;
     numero_solicitud: string;
     finalizado: boolean;
     rechazado: boolean;
     rechazo_observacion: string;
}

export interface UsuarioSolicitanteNewRequest {
     [key: string]: string | number | null | undefined;
     nombre: string;
     tipo_identificacion: string;
     numero_documento: string;
     fecha_expedicion: string;
     lugar_expedicion: string;
     tipo_persona_juridica: string;
     calidad_solicitante: string;
     celular1: string;
     celular2: string;
     telefono: string;
     email: string;
     direccion_departamento: string;
     direccion_municipio: string;
     sector: string;
     direccion_centro_poblado: string;
     direccion_barrio: string;
     direccion: string;
}

export interface ObraNewRequest {
     [key: string]: string | number | null | undefined;
     nombre_proyecto: string;
     direccion_departamento: string;
     direccion_municipio: string;
     sector: string;
     direccion_centro_poblado: string;
     direccion_barrio: string;
     direccion: string;
     latitud: string;
     longitud: string;
     uso: string;
     codigo_cliente: string;
     tipo_carga: string;
     carga_nueva: string;
     carga_total: string;
     medidores_existentes: string;
     medidores_proyectados: string;
     observacion: string;
}

interface SolicitudeHorario {
     jornada: string;
     dia_semana: string;
     observacion: string;
}
