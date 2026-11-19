import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RutinaDTO } from '../model/trueform.model';

@Injectable({ providedIn: 'root' })
export class RutinaService {
  private http = inject(HttpClient);
  listarPorUsuario(id: number): Observable<RutinaDTO[]> {
    return this.http.get<RutinaDTO[]>(`/api/rutinas/usuario/${id}`);
  }
  crear(datos: Omit<RutinaDTO, 'idRutina'>): Observable<RutinaDTO> {
    return this.http.post<RutinaDTO>('/api/rutinas', datos);
  }
}
