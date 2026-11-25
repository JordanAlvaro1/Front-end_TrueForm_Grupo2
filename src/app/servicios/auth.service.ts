import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UsuarioDTO } from '../model/trueform.model';

export interface JwtLoginResponseDTO {
  token: string;
  rol: 'USER' | 'ADMIN';
  usuario: UsuarioDTO;
}

const TOKEN_KEY = 'tf_jwt';
const ROL_KEY = 'tf_rol';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  iniciarSesion(email: string, password: string): Observable<JwtLoginResponseDTO> {
    return this.http.post<JwtLoginResponseDTO>('/api/auth/login-jwt', { email, password })
      .pipe(tap(respuesta => this.guardarSesion(respuesta)));
  }

  private guardarSesion(respuesta: JwtLoginResponseDTO): void {
    const usuario = respuesta?.usuario;
    if (!respuesta?.token || !usuario?.idUsuario ||
        !['USER', 'ADMIN'].includes(respuesta.rol)) {
      throw new Error('La respuesta de autenticación es incompleta.');
    }
    this.cerrarSesion();
    localStorage.setItem(TOKEN_KEY, respuesta.token);
    localStorage.setItem(ROL_KEY, respuesta.rol);
    localStorage.setItem('idUsuario', String(usuario.idUsuario));
    localStorage.setItem('nombreUsuario', `${usuario.nombres} ${usuario.apellidos}`);
    localStorage.setItem('nivelUsuario', usuario.nivel);
  }

  obtenerToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) throw new Error('Token inválido');
      const b64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(b64)) as { exp?: number };
      if (typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()) {
        this.cerrarSesion();
        return null;
      }
      return token;
    } catch {
      this.cerrarSesion();
      return null;
    }
  }

  tieneSesion(): boolean {
    return this.obtenerToken() !== null;
  }

  obtenerRol(): 'USER' | 'ADMIN' | null {
    if (!this.tieneSesion()) return null;
    const rol = localStorage.getItem(ROL_KEY);
    return rol === 'USER' || rol === 'ADMIN' ? rol : null;
  }

  cerrarSesion(): void {
    for (const clave of [TOKEN_KEY, ROL_KEY, 'idUsuario', 'nombreUsuario',
                         'nivelUsuario', 'usuarioActual']) {
      localStorage.removeItem(clave);
    }
  }
}
