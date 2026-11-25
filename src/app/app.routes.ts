import { Routes } from '@angular/router';

import { Inicio } from './paginas/inicio/inicio';
import { Nosotros } from './paginas/nosotros/nosotros';
import { Beneficios } from './paginas/beneficios/beneficios';
import { Contacto } from './paginas/contacto/contacto';
import { Login } from './paginas/login/login';
import { Registro } from './paginas/registro/registro';
import { Ejercicios } from './paginas/ejercicios/ejercicios';
import { Panel } from './paginas/panel/panel';
import { Espacio } from './paginas/espacio/espacio';
import { Admin } from './paginas/admin/admin';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'nosotros', component: Nosotros },
  { path: 'beneficios', component: Beneficios },
  { path: 'contacto', component: Contacto },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'ejercicios', component: Ejercicios },

  // Rutas protegidas para usuarios autenticados
  {
    path: 'panel',
    component: Panel,
    canActivate: [authGuard],
  },
  {
    path: 'espacio',
    component: Espacio,
    canActivate: [authGuard],
  },

  // Ruta exclusiva para administradores
  {
    path: 'admin',
    component: Admin,
    canActivate: [adminGuard],
  },

  // Esta ruta siempre debe quedar al final
  { path: '**', redirectTo: '' },
];
