/** Contratos de la API Spring Boot TrueForm_API_Sin_Security (noviembre 2026). */
export interface RutinaEjercicioDTO {
  idRutinaEjercicio: number; idRutina: number; idEjercicio: number;
  series: number; repeticiones: number; descansoSegundos?: number | null;
  diaSemana?: string | null; ordenEjercicio?: number | null;
}
export interface RutinaSemanalDTO {
  idRutina: number; idUsuario: number; nombreRutina: string;
  descripcion?: string | null; dias: DiaRutinaDTO[];
}
export interface DiaRutinaDTO {
  dia: string; grupoMuscular?: string | null; descanso?: boolean | null;
  mensaje?: string | null; ejercicios: EjercicioSemanalDTO[];
}
export interface EjercicioSemanalDTO {
  idEjercicio: number; nombreEjercicio: string; grupoMuscular: string;
  series: number; repeticiones: number; descansoSegundos?: number | null; ordenEjercicio?: number | null;
}
export interface EjercicioGuiadoDTO {
  idRutinaEjercicio: number; idEjercicio: number; nombreEjercicio: string;
  descripcion?: string | null; grupoMuscular: string; series: number;
  repeticiones: number; descansoSegundos?: number | null; diaSemana: string;
  ordenEjercicio: number; ultimoEjercicio: boolean; mensaje?: string;
}
export interface FavoritoDTO { idFavorito: number; idUsuario: number; idEjercicio: number; nombreEjercicio: string; }
export interface CalendarioDTO {
  idProgramacion: number; idRutina: number; idUsuario: number; nombreRutina: string;
  fecha: string; estado: string;
}
export interface ResumenSemanalDTO {
  idUsuario: number; fechaInicio: string; fechaFin: string; programados: number;
  completados: number; pendientes: number; cancelados: number; porcentajeCumplimiento: number;
}
export interface ProgresoSemanalDTO {
  idUsuario: number; fechaInicio: string; fechaFin: string;
  sesionesRegistradas: number; promedioCumplimiento: number | null;
  datos: Array<{ fecha: string; porcentajeCumplimiento?: number | null; }>; mensaje?: string;
}
export interface RecomendacionInicialDTO { idUsuario: number; nivel?: string; objetivo?: string; recomendacion?: string; mensaje?: string; }
export interface RecomendacionProgresoDTO { idUsuario: number; datosSuficientes: boolean; tipoRecomendacion?: string; recomendacion?: string; mensaje?: string; }
export interface RecomendacionAvanzadaDTO { idUsuario: number; datosSuficientes: boolean; intensidad?: string; volumen?: string; recuperacion?: string; variacionEjercicios?: string; mensaje?: string; }
export interface AjusteRutinaDTO { idUsuario: number; idRutina?: number; datosSuficientes: boolean; estancamientoDetectado: boolean; recomendacion?: string; mensaje?: string; }
export interface TipDTO { categoria: string; titulo: string; contenido: string; }
export interface GlosarioDTO { termino: string; definicion?: string; encontrado: boolean; mensaje?: string; }
export interface IaResponseDTO { idUsuario: number; pregunta: string; respuesta?: string; respondido: boolean; mensaje?: string; }
export interface ResumenProgresoDTO {
  idUsuario: number; periodo?: string; hayDatos: boolean; mensaje?: string;
  registrosProgreso: number; registrosConPeso?: number; registrosConCumplimiento?: number;
  pesoPromedioKg?: number | null; pesoInicialKg?: number | null; pesoFinalKg?: number | null;
  cumplimientoPromedio?: number | null;
}
export interface ComparacionMensualDTO { idUsuario: number; hayDatos: boolean; mensaje?: string;
  meses?: ResumenProgresoDTO[]; diferenciaPesoPromedioKg?: number | null;
  diferenciaCumplimientoPuntos?: number | null;
}
export interface HistorialProgresoDTO {
  idUsuario: number; tieneRegistros: boolean; totalRegistros: number;
  historial: Array<{idProgreso: number; fecha: string; rutina?: string; ejercicios?: string;
    porcentajeCumplimiento?: number | null; pesoActual?: number | null; observaciones?: string | null;}>;
  mensaje?: string;
}
