import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EjercicioDTO } from '../model/trueform.model';

@Injectable({ providedIn: 'root' })
export class EjercicioService {
  private http = inject(HttpClient);
  listar(): Observable<EjercicioDTO[]> {
    return this.http.get<EjercicioDTO[]>('/api/ejercicios');
  }
  porGrupo(grupo: string): Observable<EjercicioDTO[]> {
    return this.http.get<EjercicioDTO[]>(`/api/ejercicios/grupo/${encodeURIComponent(grupo)}`);
  }
}
