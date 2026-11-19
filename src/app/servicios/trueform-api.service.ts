import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObjetivoDTO, RegistroUsuarioDTO, UsuarioDTO } from '../model/trueform.model';

// Conservamos estas exportaciones para que login.ts y registro.ts originales sigan funcionando.
export type { ObjetivoDTO, RegistroUsuarioDTO, UsuarioDTO } from '../model/trueform.model';

@Injectable({ providedIn: 'root' })
export class TrueformApiService {
  private readonly http = inject(HttpClient);
  // IMPORTANTE: URL relativa. angular.json + proxy.conf.json envían /api a Spring Boot :8080.
  // No se usa JWT, sesión HTTP ni CSRF. Solo para pruebas locales de clase.
  objetivos(): Observable<ObjetivoDTO[]> {
    return this.http.get<ObjetivoDTO[]>('/api/objetivos');
  }
  registrar(datos: RegistroUsuarioDTO): Observable<UsuarioDTO> {
    return this.http.post<UsuarioDTO>('/api/usuarios', datos);
  }
  iniciarSesion(email: string, password: string): Observable<UsuarioDTO> {
    return this.http.post<UsuarioDTO>('/api/auth/login', { email, password });
  }
  buscarUsuario(idUsuario: number): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`/api/usuarios/${idUsuario}`);
  }
}
