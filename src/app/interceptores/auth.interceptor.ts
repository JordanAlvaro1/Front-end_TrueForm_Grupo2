
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../servicios/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if (!req.url.startsWith('/api/')) return next(req);

  const backendUrl = 'https://trueform-backend-d978.onrender.com';

  const auth = inject(AuthService);
  const router = inject(Router);
  const esLogin = req.url === '/api/auth/login-jwt' || req.url === '/api/auth/login';
  const esRegistro = req.url === '/api/usuarios' && req.method === 'POST';
  const esPublica = esLogin || esRegistro;
  const token = esPublica ? null : auth.obtenerToken();

  const solicitud = req.clone({
    url: backendUrl + req.url,
    ...(token ? {
      setHeaders: { Authorization: `Bearer ${token}` }
    } : {})
  });

  return next(solicitud).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !esPublica) {
        auth.cerrarSesion();
        void router.navigateByUrl('/login');
      }
      return throwError(() => error);
    })
  );
};

