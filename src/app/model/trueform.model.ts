export interface UsuarioDTO {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  email: string;
  nivel: string;
  edad: number;
  peso?: number | null;
  altura?: number | null;
  idObjetivo?: number | null;
  equipo?: string | null;
}
export interface RegistroUsuarioDTO {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  edad: number;
  peso: number;
  altura: number;
  nivel: string;
  idObjetivo: number;
  equipo: string;
}
export interface ObjetivoDTO {
  idObjetivo: number;
  nombreObjetivo: string;
  descripcion?: string | null;
}
export interface EjercicioDTO {
  idEjercicio: number;
  nombreEjercicio: string;
  grupoMuscular: string;
  descripcion?: string | null;
  tipo?: string | null;
  equipoNecesario?: string | null;
}
export interface RutinaDTO {
  idRutina: number;
  idUsuario: number;
  nombreRutina: string;
  descripcion?: string | null;
  fechaInicio: string; // yyyy-MM-dd de LocalDate
  fechaFin?: string | null;
  estado: string;
}
export interface ProgresoDTO {
  idProgreso: number;
  idUsuario: number;
  idRutina: number;
  fechaRegistro: string;
  pesoActual?: number | null;
  porcentajeCumplimiento?: number | null;
  observaciones?: string | null;
}
export interface RegistroEntrenamientoDTO {
  idRegistro: number;
  idRutina: number;
  idEjercicio: number;
  idUsuario: number;
  nombreRutina: string;
  nombreEjercicio: string;
  fecha: string;
  series: number;
  repeticiones: number;
  pesoKg: number;
}
