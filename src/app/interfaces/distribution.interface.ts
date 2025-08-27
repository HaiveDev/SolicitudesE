//* Type: Interfaces for Distribution

// Interface for Assignment 
export interface FormAssignmentDist {
    asignaciones: DataAssignmentDist;
}
export interface DataAssignmentDist {
    [key: string]: string | number | null | undefined;
    solicitud: string;
    fecha_agendamiento: string;
    jornada: string;
    tecnico1: string;
    tecnico2: string;
    tecnico3: string;
    observacion: string;
}
export interface UsuarioZonaDist {
    id: string;
    usuario: string;
    zona: string[];
}

// Interface for Visit
export interface FormVisitDist {
    
    datos: DataVisitDist;
    fachada_foto:       File | null;
    nodo_foto:          File | null;
    transformador_foto: File | null;
}
export interface DataVisitDist {
    [key: string]: string | number | null | undefined;
    solicitud:                  string;
    fecha_visita_inicio:        string;
    fecha_visita_fin:           string;
    latitud_punto_instalacion:  string;
    longitud_punto_instalacion: string;
    latitud_punto_conexion:     string;
    longitud_punto_conexion:    string;
    latitud_transformador:      string;
    longitud_transformador:     string;
    corriente_fecha_lectura:    string;
    corriente_x:                string;
    corriente_y:                string;
    corriente_z:                string;
    circuito:                   string;
    placa_transformador:        string;
    tipo_transformador:         string;
    potencia_transformador:     string;
    nodo_poste:                 string;
    red_existente:              string;
    tipo_red_existente:         string;
    observacion:                string;
}

// Interface for Approval
export interface FormApprovalDist {
    aprobaciones: DataApprovalDist;
}
export interface DataApprovalDist {
    [key: string]: string | number | null | undefined;
    solicitud:         string;
    cargabilidad:      string;
    decision:          string;
    plantilla_reporte: string;
    observacion:       string;
    procedimiento:     string;
    nota:              string;
    
}
