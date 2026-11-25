import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../servicios/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // No enviamos un token a dominios ajenos: TrueForm utiliza rutas /api/... mediante proxy.
  if (!req.url.startsWith('/api/')) return next(req);

  const auth = inject(AuthService);
  const router = inject(Router);
  const esLogin = req.url === '/api/auth/login-jwt' || req.url === '/api/auth/login';
  const esRegistro = req.url === '/api/usuarios' && req.method === 'POST';
  const esPublica = esLogin || esRegistro;
  const token = esPublica ? null : auth.obtenerToken();
  const solicitud = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(solicitud).pipe(
    catchError((error: unknown) => {
      // No ocultar el error: los componentes conservan sus propios mensajes de fallo.
      // Tampoco cerrar sesión por un 403: significa que faltan permisos, no autenticación.
      if (error instanceof HttpErrorResponse && error.status === 401 && !esPublica) {
        auth.cerrarSesion();
        void router.navigateByUrl('/login');
      }
      return throwError(() => error);
    })
  );
};
