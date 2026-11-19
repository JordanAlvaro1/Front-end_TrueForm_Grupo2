import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgresoDTO } from '../model/trueform.model';

@Injectable({ providedIn: 'root' })
export class ProgresoService {
  private http = inject(HttpClient);
  listarPorUsuario(id: number): Observable<ProgresoDTO[]> {
    return this.http.get<ProgresoDTO[]>(`/api/progresos/usuario/${id}`);
  }
  crear(datos: Pick<ProgresoDTO, 'idUsuario'|'idRutina'|'pesoActual'|'porcentajeCumplimiento'|'observaciones'>): Observable<ProgresoDTO> {
    return this.http.post<ProgresoDTO>('/api/progresos', datos);
  }
}
