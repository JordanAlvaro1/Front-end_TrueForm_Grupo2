import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EjercicioDTO, ObjetivoDTO } from '../model/trueform.model';
import {
  AjusteRutinaDTO, CalendarioDTO, ComparacionMensualDTO, EjercicioGuiadoDTO,
  FavoritoDTO, GlosarioDTO, HistorialProgresoDTO, IaResponseDTO,
  ProgresoSemanalDTO, RecomendacionAvanzadaDTO, RecomendacionInicialDTO,
  RecomendacionProgresoDTO, ResumenProgresoDTO, ResumenSemanalDTO,
  RutinaEjercicioDTO, RutinaSemanalDTO, TipDTO
} from '../model/funciones.model';

@Injectable({providedIn:'root'})
export class FuncionesTrueFormService {
  private http = inject(HttpClient);
  // Mantener las rutas RELATIVAS. El proxy de Angular envía /api/** a localhost:8080.
  rutinaSemanal(id: number): Observable<RutinaSemanalDTO> { return this.http.get<RutinaSemanalDTO>(`/api/rutinas/usuario/${id}/semanal`); }
  ejerciciosDeRutina(id: number): Observable<RutinaEjercicioDTO[]> { return this.http.get<RutinaEjercicioDTO[]>(`/api/rutina-ejercicios/rutina/${id}`); }
  asignarEjercicio(datos: Omit<RutinaEjercicioDTO,'idRutinaEjercicio'>): Observable<RutinaEjercicioDTO> { return this.http.post<RutinaEjercicioDTO>('/api/rutina-ejercicios',datos); }
  quitarEjercicio(id: number): Observable<void> { return this.http.delete<void>(`/api/rutina-ejercicios/${id}`); }
  ejercicioGuiado(idRutina:number, dia:string, posicion:number): Observable<EjercicioGuiadoDTO> {
    return this.http.get<EjercicioGuiadoDTO>(`/api/rutina-ejercicios/rutina/${idRutina}/dia/${encodeURIComponent(dia)}/guiada`, {params:{posicion}});
  }
  alternativas(idEjercicio:number): Observable<EjercicioDTO[]> { return this.http.get<EjercicioDTO[]>(`/api/ejercicios/${idEjercicio}/alternativas`); }
  favoritos(id:number): Observable<FavoritoDTO[]> { return this.http.get<FavoritoDTO[]>(`/api/favoritos/usuario/${id}`); }
  agregarFavorito(idUsuario:number,idEjercicio:number): Observable<FavoritoDTO> { return this.http.post<FavoritoDTO>('/api/favoritos',{idUsuario,idEjercicio}); }
  quitarFavorito(id:number): Observable<void> { return this.http.delete<void>(`/api/favoritos/${id}`); }
  calendario(id:number): Observable<CalendarioDTO[]> { return this.http.get<CalendarioDTO[]>(`/api/calendario/usuario/${id}`); }
  agendar(idRutina:number,fecha:string,estado='pendiente'): Observable<CalendarioDTO> { return this.http.post<CalendarioDTO>('/api/calendario',{idRutina,fecha,estado}); }
  actualizarAgenda(datos:CalendarioDTO): Observable<CalendarioDTO> { return this.http.put<CalendarioDTO>('/api/calendario',datos); }
  eliminarAgenda(id:number): Observable<void> { return this.http.delete<void>(`/api/calendario/${id}`); }
  resumenCalendario(id:number,fecha:string): Observable<ResumenSemanalDTO> { return this.http.get<ResumenSemanalDTO>(`/api/calendario/usuario/${id}/resumen`,{params:{fecha}}); }
  progresoSemanal(id:number): Observable<ProgresoSemanalDTO> { return this.http.get<ProgresoSemanalDTO>(`/api/progresos/usuario/${id}/semanal`); }
  recomendacionInicial(id:number): Observable<RecomendacionInicialDTO> { return this.http.get<RecomendacionInicialDTO>(`/api/usuarios/${id}/recomendaciones`); }
  recomendacionProgreso(id:number): Observable<RecomendacionProgresoDTO> { return this.http.get<RecomendacionProgresoDTO>(`/api/progresos/usuario/${id}/recomendacion`); }
  recomendacionAvanzada(id:number): Observable<RecomendacionAvanzadaDTO> { return this.http.get<RecomendacionAvanzadaDTO>(`/api/progresos/usuario/${id}/recomendacion-avanzada`); }
  ajusteRutina(id:number): Observable<AjusteRutinaDTO> { return this.http.get<AjusteRutinaDTO>(`/api/rutinas/usuario/${id}/ajuste`); }
  tipsDelDia(): Observable<TipDTO[]> { return this.http.get<TipDTO[]>('/api/tips/hoy'); }
  buscarGlosario(termino:string): Observable<GlosarioDTO> { return this.http.get<GlosarioDTO>('/api/glosario/buscar',{params:{termino}}); }
  consultarIA(idUsuario:number,pregunta:string): Observable<IaResponseDTO> { return this.http.post<IaResponseDTO>('/api/ia/chat',{idUsuario,pregunta}); }
  resumenProgreso(id:number): Observable<ResumenProgresoDTO> { return this.http.get<ResumenProgresoDTO>(`/api/progresos/usuario/${id}/resumen`); }
  compararMeses(id:number,mesBase:string,mesComparado:string): Observable<ComparacionMensualDTO> {
    return this.http.get<ComparacionMensualDTO>(`/api/progresos/usuario/${id}/comparacion-mensual`,{params:{mesBase,mesComparado}});
  }
  historialProgreso(id:number): Observable<HistorialProgresoDTO> { return this.http.get<HistorialProgresoDTO>(`/api/progresos/usuario/${id}/historial`); }
  exportarCsv(id:number): Observable<Blob> { return this.http.get(`/api/progresos/usuario/${id}/exportar`,{responseType:'blob'}); }
  objetivos(): Observable<ObjetivoDTO[]> { return this.http.get<ObjetivoDTO[]>('/api/objetivos'); }
  cambiarObjetivo(id:number,idObjetivo:number): Observable<{mensaje:string}> { return this.http.put<{mensaje:string}>(`/api/usuarios/${id}/objetivo`,{idObjetivo}); }
  finalizarRutina(idUsuario:number,idRutina:number,porcentajeCumplimiento:number): Observable<unknown> {
    const params = new HttpParams().set('idUsuario',idUsuario).set('idRutina',idRutina).set('porcentajeCumplimiento',porcentajeCumplimiento);
    return this.http.post('/api/progresos/finalizar',null,{params});
  }
}
