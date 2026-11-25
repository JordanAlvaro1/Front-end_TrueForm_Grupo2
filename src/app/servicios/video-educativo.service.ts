import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Debe coincidir con VideoEducativo.java del backend de TrueForm.
export interface VideoEducativoDTO {
  idVideo: number;
  titulo: string;
  descripcion: string;
  urlVideo: string;
  categoria: string;
  nivel: 'GENERAL' | 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
  activo: boolean;
}

@Injectable({ providedIn: 'root' })
export class VideoEducativoService {
  private readonly http = inject(HttpClient);

  // La API devuelve los publicados del nivel indicado y los de nivel GENERAL.
  listarPublicados(nivel: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO'): Observable<VideoEducativoDTO[]> {
    const params = new HttpParams().set('nivel', nivel);
    return this.http.get<VideoEducativoDTO[]>('/api/videos', { params });
  }
}
