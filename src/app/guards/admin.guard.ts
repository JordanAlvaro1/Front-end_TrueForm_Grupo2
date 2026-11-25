import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.tieneSesion()) {
    return router.createUrlTree(['/login']);
  }

  if (auth.obtenerRol() !== 'ADMIN') {
    return router.createUrlTree(['/espacio']);
  }

  return true;
};
