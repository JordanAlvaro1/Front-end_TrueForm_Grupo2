import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroEntrenamientoDTO } from '../model/trueform.model';

@Injectable({providedIn: 'root'})
export class RegistroEntrenamientoService {
  private http = inject(HttpClient);
  listarPorUsuario(id: number): Observable<RegistroEntrenamientoDTO[]> {
    return this.http.get<RegistroEntrenamientoDTO[]>(`/api/registros-entrenamiento/usuario/${id}`);
  }
  crear(datos: Pick<RegistroEntrenamientoDTO, 'idRutina'|'idEjercicio'|'fecha'|'series'|'repeticiones'|'pesoKg'>): Observable<RegistroEntrenamientoDTO> {
    return this.http.post<RegistroEntrenamientoDTO>('/api/registros-entrenamiento', datos);
  }
}
